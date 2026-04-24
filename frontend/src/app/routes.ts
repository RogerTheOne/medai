import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ChatPage } from "./pages/ChatPage";
import { PharmacyPage } from "./pages/PharmacyPage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";

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
    path: "/chat",
    Component: ChatPage,
  },
  {
    path: "/pharmacy",
    Component: PharmacyPage,
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
