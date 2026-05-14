import { Link } from "react-router";
import { Activity, MessageSquare, Clock, ShieldCheck, MapPin, Navigation, Loader2, Check, Zap, Shield, Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "../components/UserMenu";

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Top Navigation */}
      <motion.nav 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            {/* Logo + Name — fixed width left */}
            <div className="flex-1">
              <Link to="/" className="flex items-center gap-2.5 group w-fit">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-lg">MedAI Advisor</span>
              </Link>
            </div>

            {/* Navigation Links — truly centered */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Home</Link>
              <Link to="/chat" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Chat</Link>
              <Link to="/pharmacy" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Pharmacy</Link>
              <Link to="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">About</Link>
            </div>

            {/* CTA — fixed width right, aligned to end */}
            <div className="flex-1 flex items-center justify-end gap-3">
              {user ? (
                <UserMenu />
              ) : (
                <Link to="/login">
                  <Button className="rounded-full px-6 h-10 bg-primary hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5">
                    Get Started
                  </Button>
                </Link>
              )}
              <button className="md:hidden">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Animated Background */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl"
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo/Icon */}
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Activity className="w-9 h-9 text-white" />
            </div>
          </motion.div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
              AI-Powered Health Guidance, <br />
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 bg-clip-text text-transparent">
                Anytime
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get instant, reliable health information and guidance from our AI assistant. 
              Available 24/7 to help you understand your symptoms and make informed decisions.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to={user ? "/chat" : "/login"}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-base shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all"
                >
                  Get Started
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
            
          </div>
        </motion.div>
      </div>

      {/* Section 1 - AI Chat Demo */}
      <div className="bg-white py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left - Chat Demo */}
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">AI Health Assistant</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-accent"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="py-6 space-y-4">
                  {/* User Message */}
                  <motion.div 
                    className="flex justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%] shadow-md">
                      <p className="text-sm leading-relaxed">
                        I have a sore throat and mild fever.
                      </p>
                    </div>
                  </motion.div>

                  {/* AI Response */}
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-muted/60 rounded-2xl rounded-tl-md px-5 py-4 max-w-[85%] shadow-md border border-gray-100">
                      <div className="space-y-4">
                        {/* Possible Causes */}
                        <div>
                          <h5 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                            <motion.span 
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            Possible Causes
                          </h5>
                          <ul className="space-y-1.5 ml-3.5">
                            <motion.li 
                              className="text-xs text-gray-700 leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.6 }}
                            >
                              • Viral infection (common cold or flu)
                            </motion.li>
                            <motion.li 
                              className="text-xs text-gray-700 leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.7 }}
                            >
                              • Strep throat (bacterial infection)
                            </motion.li>
                            <motion.li 
                              className="text-xs text-gray-700 leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.8 }}
                            >
                              • Upper respiratory infection
                            </motion.li>
                          </ul>
                        </div>

                        {/* General Advice */}
                        <div>
                          <h5 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                            <motion.span 
                              className="w-1.5 h-1.5 rounded-full bg-accent"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                            General Advice
                          </h5>
                          <ul className="space-y-1.5 ml-3.5">
                            <motion.li 
                              className="text-xs text-gray-700 leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.9 }}
                            >
                              • Stay hydrated with warm fluids
                            </motion.li>
                            <motion.li 
                              className="text-xs text-gray-700 leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 1.0 }}
                            >
                              • Get plenty of rest
                            </motion.li>
                            <motion.li 
                              className="text-xs text-gray-700 leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 1.1 }}
                            >
                              • Use throat lozenges for relief
                            </motion.li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Typing Indicator */}
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="bg-muted/60 rounded-2xl rounded-tl-md px-5 py-3 shadow-md border border-gray-100">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-3 h-3 text-primary" />
                        </motion.div>
                        <span className="text-xs text-gray-500">Analyzing...</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </motion.div>
            </motion.div>

            {/* Right - Description */}
            <motion.div 
              className="order-1 md:order-2 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold text-gray-900 leading-tight">
                  Smart, Structured Health Guidance
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our AI provides organized, easy-to-understand medical guidance with clear sections 
                  for causes, advice, and safety warnings. Get the information you need without the confusion.
                </p>
              </div>

              <div className="space-y-5">
                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Instant Response</h4>
                    <p className="text-sm text-gray-600">
                      Get immediate answers to your health questions 24/7
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Clear Structure</h4>
                    <p className="text-sm text-gray-600">
                      Information organized into logical sections for easy understanding
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Safety-Focused Advice</h4>
                    <p className="text-sm text-gray-600">
                      Clear guidance on when to seek professional medical attention
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section 2 - Pharmacy Map Demo */}
      <div className="bg-gradient-to-b from-muted/30 to-muted/10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left - Description */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold text-gray-900 leading-tight">
                  Find Nearby Pharmacies Instantly
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Locate pharmacies near you with our interactive map. See real-time availability, 
                  operating hours, and get directions with a single tap.
                </p>
              </div>

              <Link to="/pharmacy">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="rounded-full px-6 h-11 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-shadow">
                    <MapPin className="w-4 h-4 mr-2" />
                    Explore Pharmacies
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Right - Map Demo */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative h-[420px]"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
                  {/* Grid Pattern */}
                  <div 
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }}
                  />

                  {/* User Location Pin with Pulsing Animation */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <motion.div 
                        className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div 
                        className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30"
                        animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div 
                        className="absolute inset-0 w-4 h-4 rounded-full bg-primary/20"
                        animate={{ scale: [1, 2.5, 2.5], opacity: [0.3, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Pharmacy Pins with Hover States */}
                  <motion.div 
                    className="absolute top-[30%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    whileHover={{ scale: 1.2, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className="w-7 h-7 text-accent fill-accent drop-shadow-lg" />
                  </motion.div>
                  <motion.div 
                    className="absolute top-[65%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    whileHover={{ scale: 1.2, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className="w-7 h-7 text-accent fill-accent drop-shadow-lg" />
                  </motion.div>
                  <motion.div 
                    className="absolute top-[40%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    whileHover={{ scale: 1.2, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className="w-7 h-7 text-accent fill-accent drop-shadow-lg" />
                  </motion.div>

                  {/* Selected Pharmacy Info Card */}
                  <motion.div 
                    className="absolute top-[20%] left-[55%] transform -translate-x-1/2 bg-white rounded-xl shadow-2xl p-4 w-64 border border-gray-100"
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">CVS Pharmacy</h4>
                      <div className="flex items-center gap-1.5">
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-accent"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs text-accent font-medium">Open</span>
                        <span className="text-xs text-gray-500">• Closes 10:00 PM</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                        <span>0.3 mi away</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button size="sm" className="w-full rounded-lg bg-primary hover:bg-primary/90 h-8 text-xs mt-2">
                          <Navigation className="w-3 h-3 mr-1.5" />
                          Get Directions
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Map Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <motion.button 
                      className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-gray-700 font-medium text-lg">+</span>
                    </motion.button>
                    <motion.button 
                      className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-gray-700 font-medium text-lg">−</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3-Step Section */}
      <div className="bg-muted py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">1. Describe Your Symptoms</h3>
                <p className="text-gray-600">
                  Simply chat with our AI and describe what you're experiencing. 
                  Be as detailed as you'd like.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">2. Get Instant Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes your symptoms and provides possible causes, 
                  questions, and general advice.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">3. Make Informed Decisions</h3>
                <p className="text-gray-600">
                  Understand when to seek medical attention and get recommendations 
                  for next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Disclaimer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="font-semibold text-amber-900 mb-2">Medical Disclaimer</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              This AI health assistant is for informational purposes only and does not provide medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
              with any questions you may have regarding a medical condition. Never disregard professional medical 
              advice or delay in seeking it because of something you have read here. If you think you may have a 
              medical emergency, call your doctor or emergency services immediately.
            </p>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            © 2026 AI Health Guidance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}