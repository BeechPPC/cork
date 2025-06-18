import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wine, Sparkles, Upload, Shield } from "lucide-react";
import Header from "@/components/header";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-grape to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1547595628-c61a29f496f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Elegant wine cellar background" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-poppins font-bold mb-6 leading-tight text-white">
                Discover Your Perfect 
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"> Wine Match</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-100 font-light">
                AI-powered recommendations tailored to your taste, mood, and occasion. Focus on premium Australian wines.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={handleGetStarted}
                  className="bg-wine text-white px-8 py-4 rounded-xl font-poppins font-semibold text-lg hover:bg-red-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Discovering
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-poppins font-semibold text-lg hover:bg-white hover:text-grape transition-all"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-100">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>18+ Age Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wine className="w-5 h-5" />
                  <span>Australian Focus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Powered</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                alt="Elegant wine tasting setup" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
            </div>
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
          <Button 
            onClick={handleGetStarted}
            className="bg-grape hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-poppins font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Free plan includes 3 saved wines • Upgrade anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate dark:bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-poppins font-bold text-grape dark:text-purple-400 mb-4">cork</h3>
              <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">
                AI-powered wine recommendations with a focus on Australian wines. Discover your perfect match for any occasion.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Recommendations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wine Upload</a></li>
                <li><a href="#" className="hover:text-white transition-colors">My Cellar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wine Education</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Age Verification</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Responsible Drinking</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              © 2024 cork. All rights reserved. Drink responsibly.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 md:mt-0">
              Must be 18+ to use this service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
