import { Link } from "react-router";
import { Activity, Heart, Shield, Zap, Lock, Users, ArrowRight, Star, CheckCircle, Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Chat", to: "/chat" },
  { label: "Pharmacy", to: "/pharmacy" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
];

const values = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Patient First",
    desc: "Every feature is designed with the patient's wellbeing and clarity in mind. Health guidance should be accessible to everyone.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trusted & Safe",
    desc: "We uphold the highest standards of data privacy, medical accuracy, and transparency in how our AI works.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Insight",
    desc: "Fast, reliable guidance when you need it most — whether it's 2pm or 2am, our AI is ready to help.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Privacy First",
    desc: "Your health data is yours. We use end-to-end encryption and never sell your personal information.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "For Everyone",
    desc: "From individuals to care teams, our platform is built to scale and adapt to every health journey.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Continuous Improvement",
    desc: "Our AI learns from the latest medical literature, continuously improving to provide better guidance over time.",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe your symptoms",
    desc: "Type your symptoms or health question in plain language. No medical jargon required.",
  },
  {
    number: "02",
    title: "AI analyzes & responds",
    desc: "Our AI cross-references thousands of medical resources to generate structured, clear guidance within seconds.",
  },
  {
    number: "03",
    title: "Take informed action",
    desc: "Use your personalized summary to decide your next step — from home care to finding a nearby pharmacy or specialist.",
  },
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    bio: "Board-certified physician with 15 years in internal medicine and digital health innovation.",
    img: "https://images.unsplash.com/photo-1762237798212-bcc000c00891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjQzMDUwMnww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    name: "James Rivera",
    role: "CEO & Co-Founder",
    bio: "Serial entrepreneur and health-tech veteran, previously led growth at two med-tech unicorns.",
    img: "https://images.unsplash.com/photo-1598596932689-31a0512bf127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc3RhcnR1cCUyMGZvdW5kZXIlMjB0ZWNoJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNDg1MzU1fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    name: "Aisha Patel",
    role: "Head of AI Research",
    bio: "PhD in computational biology; specializes in NLP models for clinical language understanding.",
    img: "https://images.unsplash.com/photo-1672462478040-a5920e2c23d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzb2Z0d2FyZSUyMGVuZ2luZWVyJTIwc21pbGluZ3xlbnwxfHx8fDE3NzI0ODUzNTV8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    name: "Dr. Marcus Webb",
    role: "Medical Advisor",
    bio: "Emergency medicine specialist and public health advocate with expertise in AI safety in clinical settings.",
    img: "https://images.unsplash.com/photo-1770836037622-11643462bc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMGhlYWx0aGNhcmUlMjBwcm9mZXNzaW9uYWxzfGVufDF8fHx8MTc3MjQ4NTM1M3ww&ixlib=rb-4.1.0&q=80&w=400",
  },
];

const trustItems = [
  "End-to-end encrypted health data",
  "HIPAA-aligned data handling (Team plan)",
  "No data sold to third parties — ever",
  "AI responses always include medical disclaimers",
  "Regular third-party security audits",
  "Transparent AI model limitations disclosed",
];

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Ambient Background Animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)" }}
          animate={{ x: [0, 50, 0], y: [0, 25, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%)" }}
          animate={{ x: [0, -35, 0], y: [0, -30, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-2/3 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)" }}
          animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-300/10"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${10 + i * 18}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2,
            }}
          />
        ))}
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
                    l.to === "/about"
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
        <section className="relative text-center pt-28 pb-20 px-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-sm text-primary mb-6">
              <Heart className="w-4 h-4" />
              Our mission
            </span>
            <h1 className="text-5xl font-semibold text-gray-900 mb-6 leading-tight max-w-3xl mx-auto">
              Built to make health guidance{" "}
              <span className="text-primary">simpler</span> and more{" "}
              <span className="text-primary">accessible</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              We believe everyone deserves clear, instant health information — regardless of location, insurance status, or time of day. MedAI Advisor bridges the gap between questions and clarity.
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <Link to="/chat">
                <Button className="rounded-full px-7 h-11 bg-primary hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Try it free
                </Button>
              </Link>
              <Link to="/pricing" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors group">
                View pricing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Mission */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-12 md:p-16 text-center relative overflow-hidden"
          >
            {/* Subtle animated glow */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.12), transparent)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="text-3xl font-semibold text-gray-900 mb-5 relative">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto relative">
              MedAI Advisor was founded in 2024 with a single mission: to democratize health guidance. Too many people delay care because they don't know if their symptoms are serious. Too many miss pharmacy hours, can't afford a consultation, or simply need reassurance at 3am.
              <br /><br />
              We built an AI-powered platform that provides structured, responsible health guidance — empowering people to make informed decisions about their own wellbeing while always encouraging professional medical consultation when needed.
            </p>
          </motion.div>
        </section>

        {/* Values */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">What we stand for</h2>
            <p className="text-gray-500">Core principles that guide every decision we make.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(139,92,246,0.12)", transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-gray-200 bg-white p-7 cursor-pointer hover:border-purple-200 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {v.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Three simple steps to health clarity.</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-12 top-12 bottom-12 w-0.5 bg-purple-100 hidden md:block" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-8 items-start group"
                >
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="w-24 h-24 rounded-2xl bg-white border-2 border-purple-200 flex flex-col items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-purple-200/50 group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-2xl font-semibold text-primary">{step.number}</span>
                    </motion.div>
                  </div>
                  <div className="flex-1 pt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Meet the team</h2>
            <p className="text-gray-500">Physicians, engineers, and researchers united by a shared mission.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden cursor-pointer hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300"
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-0.5">{member.name}</h3>
                  <p className="text-xs text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gray-50 border border-gray-200 p-10 md:p-14"
          >
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Trust & Safety</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We take your safety and privacy seriously. Our platform is built with medical responsibility at its core — every AI response includes appropriate disclaimers, and we continuously work with medical advisors to ensure our guidance remains responsible, accurate, and safe.
                </p>
                <ul className="space-y-3">
                  {trustItems.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 rounded-2xl bg-amber-50 border border-amber-200 p-6">
                <h3 className="text-base font-semibold text-amber-900 mb-3">⚠ Medical Disclaimer</h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  MedAI Advisor is <strong>not a licensed medical provider</strong> and does not offer medical diagnoses or treatment recommendations. All information provided is for general health education purposes only.
                  <br /><br />
                  Always consult a qualified healthcare professional before making medical decisions. In an emergency, call your local emergency services (e.g., 911 in the US) immediately.
                  <br /><br />
                  AI-generated health information may not always be accurate or up to date. Use with judgment and professional guidance.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl bg-primary p-14 overflow-hidden"
            style={{ boxShadow: "0 0 60px rgba(139,92,246,0.3)" }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1), transparent 60%)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="text-3xl font-semibold text-white mb-4 relative">
              Ready to take control of your health?
            </h2>
            <p className="text-purple-200 mb-8 relative">Join thousands already using MedAI Advisor for smarter health decisions.</p>
            <Link to="/register">
              <Button className="rounded-full px-8 h-12 bg-white text-primary hover:bg-purple-50 transition-all hover:shadow-xl hover:-translate-y-0.5 relative">
                Start for free today
              </Button>
            </Link>
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
