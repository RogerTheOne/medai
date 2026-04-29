import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../app/context/AuthContext';

const fakeUser = {
  id: '1',
  email: 'test@gmail.com',
  name: 'Roger',
  avatarUrl: null,
  createdAt: '',
  updatedAt: '',
};

// Helper component that exposes AuthContext state to the DOM so we can assert on it
function TestComponent() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-name">{user ? user.name : 'not logged in'}</div>
      <button onClick={() => login(fakeUser, 'fake-token')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

// Clear localStorage before each test to prevent state leaking between tests
beforeEach(() => localStorage.clear());

// ─── Test cases ────────────────────────────────────────────────────

it('initial state: user is not logged in and localStorage is empty', () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  expect(screen.getByTestId('user-name').textContent).toBe('not logged in');
  expect(localStorage.getItem('accessToken')).toBeNull();
});

it('after login(), user state is updated and localStorage contains the token and user', async () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  await userEvent.click(screen.getByText('Login'));

  expect(screen.getByTestId('user-name').textContent).toBe('Roger');
  expect(localStorage.getItem('accessToken')).toBe('fake-token');
  expect(JSON.parse(localStorage.getItem('user')!).email).toBe('test@gmail.com');
});

it('after logout(), user state is cleared and localStorage entries are removed', async () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  // Log in first
  await userEvent.click(screen.getByText('Login'));
  expect(screen.getByTestId('user-name').textContent).toBe('Roger');

  // Then log out
  await userEvent.click(screen.getByText('Logout'));

  expect(screen.getByTestId('user-name').textContent).toBe('not logged in');
  expect(localStorage.getItem('accessToken')).toBeNull();
  expect(localStorage.getItem('user')).toBeNull();
});

it('when localStorage already has data (simulating a page refresh), auth state is restored automatically', () => {
  // Pre-populate localStorage to simulate a returning user who refreshes the page
  localStorage.setItem('accessToken', 'saved-token');
  localStorage.setItem('user', JSON.stringify(fakeUser));

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  // AuthProvider's useEffect should read localStorage and restore the session
  expect(screen.getByTestId('user-name').textContent).toBe('Roger');
});
