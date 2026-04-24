import { useState } from "react";
import { Link } from "react-router";
import { Activity, Check, ChevronDown, Menu, Zap, Users, Shield, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Chat", to: "/chat" },
  { label: "Pharmacy", to: "/pharmacy" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
];

const plans = [
  {
    name: "Starter",
    icon: <Zap className="w-5 h-5" />,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for personal health queries and occasional guidance.",
    features: [
      "10 AI consultations/month",
      "Basic symptom checker",
      "Pharmacy finder",
      "Email support",
      "Medical disclaimer included",
    ],
    cta: "Get Started Free",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    icon: <Star className="w-5 h-5" />,
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: "For individuals who want comprehensive health guidance anytime.",
    features: [
      "Unlimited AI consultations",
      "Advanced symptom analysis",
      "Priority pharmacy finder",
      "Medication reminders",
      "Health history tracking",
      "Priority support",
      "PDF health summaries",
    ],
    cta: "Start Pro Trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    icon: <Users className="w-5 h-5" />,
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: "Designed for small clinics, wellness teams, and care providers.",
    features: [
      "Everything in Pro",
      "Up to 20 team members",
      "Admin dashboard",
      "Role-based access",
      "API access",
      "Dedicated account manager",
      "HIPAA-compliant storage",
    ],
    cta: "Contact Sales",
    highlight: false,
    badge: null,
  },
];

const faqs = [
  {
    q: "Is MedAI Advisor a replacement for my doctor?",
    a: "No. MedAI Advisor is an AI-powered health guidance tool designed to help you understand symptoms and find information. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle, and we prorate any differences automatically.",
  },
  {
    q: "Is my health data secure?",
    a: "Absolutely. We use end-to-end encryption and follow industry-leading security practices. Pro and Team plans include enhanced data protection features. We never sell your personal health information.",
  },
  {
    q: "What does the yearly discount include?",
    a: "Switching to yearly billing saves you approximately 20% compared to monthly billing. You'll be charged once annually and get access to all features in your plan for the full year.",
  },
  {
    q: "Does the free Starter plan require a credit card?",
    a: "No credit card required. Simply create an account to get started with the Starter plan instantly.",
  },
];

export function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Ambient Background Animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)" }}
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Mesh grid subtle */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8B5CF6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg">MedAI Advisor</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-sm font-medium transition-colors ${
                    l.to === "/pricing"
                      ? "text-primary"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden md:block">
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-4 py-2">
                  Log In
                </button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
              <button className="md:hidden">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 flex-1">
        {/* Hero */}
        <section className="text-center pt-24 pb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-sm text-primary mb-6">
              <Shield className="w-4 h-4" />
              Transparent pricing, no hidden fees
            </span>
            <h1 className="text-5xl font-semibold text-gray-900 mb-5 leading-tight">
              Simple pricing for<br />
              <span className="text-primary">peace of mind</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Choose the plan that fits your health journey. Upgrade, downgrade, or cancel anytime.
            </p>
          </motion.div>

          {/* Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className={`text-sm font-medium transition-colors ${!yearly ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${yearly ? "bg-primary" : "bg-gray-200"}`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm"
                animate={{ x: yearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? "text-gray-900" : "text-gray-400"}`}>
              Yearly
              <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Save 20%</span>
            </span>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl p-8 flex flex-col cursor-pointer ${
                  plan.highlight
                    ? "bg-primary text-white shadow-2xl shadow-purple-300/40"
                    : "bg-white border border-gray-200 shadow-sm hover:shadow-lg"
                }`}
                style={
                  plan.highlight
                    ? { boxShadow: "0 0 40px rgba(139,92,246,0.25), 0 20px 40px rgba(0,0,0,0.1)" }
                    : {}
                }
              >
                {/* Animated glow for Pro */}
                {plan.highlight && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15), transparent 60%)" }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-primary text-xs font-semibold shadow-md border border-purple-200">
                    {plan.badge}
                  </span>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? "bg-white/20" : "bg-purple-50"}`}>
                  <span className={plan.highlight ? "text-white" : "text-primary"}>{plan.icon}</span>
                </div>

                <h3 className={`text-xl mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.highlight ? "text-purple-100" : "text-gray-500"}`}>{plan.description}</p>

                <div className="mb-8 flex items-end gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={yearly ? "y" : "m"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`text-4xl font-semibold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                    >
                      ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className={`text-sm mb-1.5 ${plan.highlight ? "text-purple-200" : "text-gray-400"}`}>/mo</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? "bg-white/20" : "bg-purple-50"}`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-primary"}`} />
                      </div>
                      <span className={`text-sm ${plan.highlight ? "text-purple-50" : "text-gray-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <button
                    className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                      plan.highlight
                        ? "bg-white text-primary hover:bg-purple-50 shadow-lg"
                        : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Frequently asked questions</h2>
            <p className="text-gray-500">Everything you need to know about our plans and pricing.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-amber-50 border border-amber-200 p-8 flex gap-5 items-start"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-amber-900 mb-2">Medical Disclaimer</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                MedAI Advisor is an AI-powered health information platform and is <strong>not a licensed medical provider</strong>. The content provided is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. In case of emergency, call your local emergency services immediately.
              </p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">MedAI Advisor</span>
          </Link>
          <p className="text-xs text-gray-400 text-center">
            © 2026 MedAI Advisor. Not a substitute for professional medical advice.
          </p>
          <div className="flex gap-5">
            <Link to="/pricing" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Pricing</Link>
            <Link to="/about" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">About</Link>
            <Link to="/chat" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Chat</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
