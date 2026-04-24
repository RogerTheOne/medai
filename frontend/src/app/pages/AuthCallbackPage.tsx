/**
 * AuthCallbackPage
 *
 * This page is the landing point after a user completes Google OAuth consent.
 *
 * FULL FLOW CONTEXT:
 *   1. User clicks "Continue with Google" on LoginPage.
 *   2. LoginPage redirects the browser to Google's OAuth consent screen,
 *      passing `redirect_uri=http://localhost:5173/auth/callback` so Google
 *      knows where to send the user back.
 *   3. After the user approves, Google redirects the browser to:
 *        http://localhost:5173/auth/callback?code=XXXX
 *      React Router matches that URL and renders THIS component.
 *   4. This component picks up the `code` from the URL, sends it to our
 *      backend, receives a JWT, and stores it so the user is logged in.
 *
 * WHY A SEPARATE CALLBACK PAGE?
 *   Google cannot hand the authorization code directly to our backend —
 *   it can only redirect a browser. So the frontend acts as the middleman:
 *   catch the code from the URL, then forward it to our own backend API.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * called is a ref (not state) used to guarantee this effect runs only once,
   * even if React renders the component twice in Strict Mode during development.
   * A ref persists between renders without triggering re-renders, making it
   * perfect as a "has this already run?" flag.
   */
  const called = useRef(false);

  // If something goes wrong, we store the error message here so we can
  // display it to the user instead of silently failing.
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard: exit immediately if the exchange has already been attempted.
    if (called.current) return;
    called.current = true;

    /**
     * STEP 1 — Extract the authorization code from the URL.
     *
     * When Google redirects here it appends `?code=XXXX` to the URL.
     * URLSearchParams parses the query string so we can read individual params.
     *
     * Example full URL at this point:
     *   http://localhost:5173/auth/callback?code=4/0AX4XfWi...&scope=email+profile
     */
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // If there's no code, something went wrong before we got here
    // (e.g. the user denied permission on the Google consent screen).
    if (!code) {
      setError("No authorization code received from Google.");
      return;
    }

    /**
     * STEP 2 — Reconstruct the exact same redirectUri used in LoginPage.
     *
     * Our backend must pass this same redirectUri back to Google during the
     * token exchange. Google verifies that both values match exactly as a
     * security measure to prevent authorization code interception attacks.
     *
     * `window.location.origin` gives us "http://localhost:5173" in development,
     * or the real domain (e.g. "https://medai.com") in production — so this
     * line works correctly in both environments without hardcoding.
     */
    const redirectUri = `${window.location.origin}/auth/callback`;

    /**
     * STEP 3 — Send the code to our backend to complete the exchange.
     *
     * Why can't the frontend exchange the code directly with Google?
     * The exchange requires the GOOGLE_CLIENT_SECRET, which must never be
     * exposed in frontend code (anyone could read it in the browser).
     * Our backend holds the secret securely and does the exchange server-side.
     *
     * What the backend does with { code, redirectUri }:
     *   a. Calls Google's token endpoint to swap `code` for an id_token.
     *   b. Verifies the id_token and extracts the user's profile (email, name, avatar).
     *   c. Creates or updates the user record in our database.
     *   d. Issues our own JWT (accessToken) tied to that user.
     *   e. Returns { user, accessToken } to us here.
     *
     * The Vite dev server proxies "/api/*" to "http://localhost:3000"
     * (configured in vite.config.ts), so this fetch reaches our Express backend.
     */
    fetch("/api/v1/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }),
    })
      .then(async (res) => {
        if (!res.ok) {
          // Try to parse the backend's error message for a meaningful description.
          // If that fails too, fall back to the raw HTTP status code.
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        /**
         * STEP 4 — Persist the session and redirect.
         *
         * `login()` (from AuthContext) stores the user object and accessToken
         * in both React state and localStorage. localStorage keeps the user
         * logged in across page refreshes and browser restarts until they
         * explicitly log out or the JWT expires (7 days).
         *
         * After login(), we go to the home page "/" which will now show
         * the user's avatar in the nav bar.
         */
        login(data.user, data.accessToken);
        navigate("/");
      })
      .catch((err: Error) => {
        // Surface the error on-screen instead of silently bouncing to /login,
        // so the user (and developers) can see what actually went wrong.
        setError(err.message);
      });
  }, [login, navigate]);

  // --- Render: error state ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-6">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-2">Login failed</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-primary hover:underline"
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  // --- Render: loading state (shown while the backend exchange is in progress) ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
