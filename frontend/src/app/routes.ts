import { createElement } from "react";
import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ChatPage } from "./pages/ChatPage";
import { PharmacyPage } from "./pages/PharmacyPage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const protect = (page: React.ReactElement) =>
  createElement(ProtectedRoute, null, page);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/auth/callback",
    Component: AuthCallbackPage,
  },
  {
    path: "/chat",
    element: protect(createElement(ChatPage)),
  },
  {
    path: "/pharmacy",
    element: protect(createElement(PharmacyPage)),
  },
  {
    path: "/pricing",
    Component: PricingPage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
]);
