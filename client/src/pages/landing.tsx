import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wine, Sparkles, Upload, Shield } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaThreads } from "react-icons/fa6";
import { SignUpButton } from "@clerk/clerk-react";
import { isClerkConfigured } from "@/lib/clerk";
import { Link } from "wouter";
import Header from "@/components/header";
import EmailCaptureModal from "@/components/email-capture-modal";


export default function Landing() {
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  // Show email capture popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmailCapture(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (!isClerkConfigured) {
      alert("Authentication is not configured yet. Please set up Clerk API keys to enable sign-up functionality.");
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30"></div>
          <img 
            src="https://images.unsplash.com/photo-1547595628-c61a29f496f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Elegant wine cellar background" 
            className="w-full h-full object-cover opacity-30" 
          />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-wine/30 to-grape/30 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">AI-Powered Wine Discovery</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-poppins font-bold mb-8 leading-tight">
              <span className="text-white">Discover Your</span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">Perfect Wine Match</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl lg:text-2xl mb-12 text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
              AI-powered recommendations tailored to your taste, mood, and occasion. Focus on premium Australian wines.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {isClerkConfigured ? (
                <SignUpButton mode="modal">
                  <Button 
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-2xl font-poppins font-semibold text-lg shadow-2xl hover:shadow-red-500/25 transition-all transform hover:scale-105 border-0"
                  >
                    Get Started Free
                  </Button>
                </SignUpButton>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-2xl font-poppins font-semibold text-lg shadow-2xl hover:shadow-red-500/25 transition-all transform hover:scale-105 border-0"
                >
                  Get Started Free (Setup Required)
                </Button>
              )}
              <Button 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-poppins font-semibold text-lg hover:bg-white/20 transition-all hover:border-white/50"
              >
                Watch Demo
              </Button>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-200">18+ Age Verified</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <Wine className="w-4 h-4 text-red-400" />
                <span className="text-gray-200">Australian Focus</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-200">AI Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating wine glasses decorative element */}
        <div className="absolute bottom-10 right-10 hidden lg:block opacity-20">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full blur-xl"></div>
            <Wine className="relative w-32 h-32 text-white/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate dark:text-white mb-4">
              Why Choose cork?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of wine discovery with our AI-powered platform designed for wine enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-white dark:bg-gray-700 border dark:border-gray-600">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-grape bg-opacity-10 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-grape dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-slate dark:text-white mb-3">AI Recommendations</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized wine suggestions based on your mood, occasion, and taste preferences
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-white dark:bg-gray-700 border dark:border-gray-600">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-wine bg-opacity-10 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-wine dark:text-red-400" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-slate dark:text-white mb-3">Wine Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload photos of your wines and discover optimal drinking windows with AI analysis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-white dark:bg-gray-700 border dark:border-gray-600">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-grape bg-opacity-10 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wine className="w-8 h-8 text-grape dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-slate dark:text-white mb-3">Personal Cellar</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Save and organize your wine discoveries in your personal digital cellar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate dark:text-white mb-4">
            Ready to Discover Your Perfect Wine?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of wine enthusiasts who trust cork for their wine discoveries
          </p>
          {isClerkConfigured ? (
            <SignUpButton mode="modal">
              <Button 
                className="bg-grape hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-poppins font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </Button>
            </SignUpButton>
          ) : (
            <Button 
              disabled
              className="bg-grape opacity-50 text-white px-8 py-4 rounded-xl font-poppins font-semibold text-lg shadow-lg"
            >
              Get Started Free (Setup Required)
            </Button>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Free plan includes 3 saved wines • Premium from $4.99/month
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate dark:bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-poppins font-bold text-grape dark:text-purple-400 mb-4">cork</h3>
              <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-6">
                AI-powered wine recommendations with a focus on Australian wines. Discover your perfect match for any occasion.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/cork.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Follow cork on Facebook"
                >
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a 
                  href="https://instagram.com/getcork.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Follow cork on Instagram"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a 
                  href="https://threads.net/@getcork.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Follow cork on Threads"
                >
                  <FaThreads className="h-6 w-6" />
                </a>
                <a 
                  href="https://linkedin.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Follow cork on LinkedIn"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Shop (Coming Soon)</h4>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Wine</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Apparel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shop All</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li><Link href="/help-centre"><span className="hover:text-white transition-colors cursor-pointer">Help Centre</span></Link></li>
                <li><Link href="/contact"><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></Link></li>
                <li><Link href="/wine-education"><span className="hover:text-white transition-colors cursor-pointer">Wine Education</span></Link></li>
                <li><Link href="#"><span className="hover:text-white transition-colors cursor-pointer">Referral Program(Coming Soon)</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li><Link href="/privacy-policy"><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></Link></li>
                <li><Link href="/terms-of-service"><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></Link></li>
                <li><Link href="/age-verification"><span className="hover:text-white transition-colors cursor-pointer">Age Verification</span></Link></li>
                <li><Link href="/responsible-drinking"><span className="hover:text-white transition-colors cursor-pointer">Responsible Drinking</span></Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              © 2025 cork. All rights reserved. Drink responsibly.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 md:mt-0">
              Must be 18+ to use this service
            </p>
          </div>
        </div>
      </footer>

      <EmailCaptureModal 
        open={showEmailCapture} 
        onOpenChange={setShowEmailCapture} 
      />
      

    </div>
  );
}
