import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Check, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import { Link } from "wouter";

export default function Checkout() {
  const [isLoading, setIsLoading] = useState({ monthly: false, yearly: false });
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(prev => ({ ...prev, [plan]: true }));
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received:', data);
        toast({
          title: "Setup Error",
          description: data.message || "Failed to create checkout session",
          variant: "destructive",
        });
        setIsLoading(prev => ({ ...prev, [plan]: false }));
      }
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      toast({
        title: "Connection Error", 
        description: "Failed to connect to payment service",
        variant: "destructive",
      });
      setIsLoading(prev => ({ ...prev, [plan]: false }));
    }
  };

  // Check for successful checkout return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const subscriptionSuccess = urlParams.get('subscription');
    
    if (sessionId && subscriptionSuccess === 'success') {
      // Handle successful checkout return
      fetch(`/api/checkout-success?session_id=${sessionId}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubscriptionCreated(true);
            toast({
              title: "Welcome to Premium!",
              description: "Your 7-day free trial has started. You'll be charged after the trial period.",
            });
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 3000);
          }
        })
        .catch(error => {
          console.error('Checkout success processing failed:', error);
        });
    }
  }, []);

  if (subscriptionCreated) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-poppins font-bold text-slate mb-2">
                Your 7-Day Free Trial Has Started!
              </h2>
              <p className="text-gray-600">
                Your payment method is saved. You'll be charged after the trial period ends. Redirecting to your dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/pricing">
              <Button variant="ghost" className="text-grape hover:text-purple-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-poppins font-bold text-slate mb-4">
              Start Your Premium Wine Journey
            </h1>
            <p className="text-lg text-gray-600">
              Choose your subscription plan and start your 7-day free trial
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm font-semibold text-green-800 mb-2">✅ Live Payment Mode</p>
              <p className="text-xs text-green-700 mb-2">Using production Stripe keys - real payments will be processed.</p>
              <p className="text-xs text-green-700">Use a real credit card to complete your subscription.</p>
              <p className="text-xs text-gray-600 mt-2"><strong>Note:</strong> Test cards (4242...) don't work in live mode.</p>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="relative border-2 border-gray-200 hover:border-grape transition-colors">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-poppins font-bold text-slate">
                  Monthly
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-grape">$4.99</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Perfect for casual wine enthusiasts
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Unlimited wine recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Unlimited wine image analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">AI meal pairing suggestions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Digital cellar management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Premium analytics</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={isLoading.monthly || isLoading.yearly}
                  className="w-full bg-grape hover:bg-purple-700 py-3 text-lg font-semibold"
                >
                  {isLoading.monthly ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Start 7-Day Free Trial
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  $4.99/month after trial • Cancel anytime
                </p>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="relative border-2 border-grape bg-gradient-to-b from-purple-50 to-white">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-grape text-white font-semibold px-3 py-1">
                  Save 17%
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-poppins font-bold text-slate">
                  Yearly
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-grape">$49.99</span>
                  <span className="text-gray-600 ml-2">/year</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="line-through text-gray-400">$59.88</span> • Save $9.89
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Everything in Monthly</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Advanced cellar insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Export your wine data</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">17% discount vs monthly</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={isLoading.monthly || isLoading.yearly}
                  className="w-full bg-grape hover:bg-purple-700 py-3 text-lg font-semibold"
                >
                  {isLoading.yearly ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Start 7-Day Free Trial
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  $49.99/year after trial • Cancel anytime
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Trusted by wine enthusiasts worldwide
            </p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm">Secure payments</span>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm">7-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}