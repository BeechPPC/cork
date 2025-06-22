import { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, CreditCard, Calendar, User, ArrowRight } from "lucide-react";
import Header from "@/components/header";
import { Link } from "wouter";

export default function Subscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isPremium = user?.subscriptionPlan === 'premium';

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to start checkout process",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to payment service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const freeFeatures = [
    "3 wine recommendations per search",
    "Save up to 3 wines",
    "2 wine photo uploads",
    "Basic wine information"
  ];

  const premiumFeatures = [
    "Unlimited wine recommendations",
    "Unlimited wine saves",
    "Unlimited wine photo uploads",
    "Detailed wine analysis & valuation",
    "Voice-to-text search",
    "Advanced food pairing suggestions",
    "Cellar analytics & insights",
    "Priority customer support"
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-poppins font-bold text-slate dark:text-white mb-4">
            Subscription Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your cork subscription and billing preferences
          </p>
        </div>

        {/* Current Status Card */}
        <Card className="mb-8 border-grape/20 bg-gradient-to-br from-grape/5 to-purple-50 dark:from-grape/10 dark:to-purple-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-slate dark:text-white">
                <User className="mr-2 h-5 w-5" />
                Current Plan
              </CardTitle>
              <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-grape text-white" : ""}>
                {isPremium ? "Premium" : "Free"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate dark:text-white mb-2">
                  {isPremium ? "Premium Plan" : "Free Plan"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {isPremium 
                    ? "You have access to all premium features and unlimited usage"
                    : "You're currently on the free plan with limited features"
                  }
                </p>
                {isPremium && (
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Billing managed through Stripe</span>
                  </div>
                )}
              </div>
              {isPremium && (
                <Crown className="h-12 w-12 text-grape" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan Comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className={`border-2 ${!isPremium ? 'border-grape bg-grape/5 dark:bg-grape/10' : 'border-gray-200 dark:border-gray-700'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-slate dark:text-white">Free Plan</span>
                {!isPremium && <Badge className="bg-grape text-white">Current</Badge>}
              </CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-300 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!isPremium && (
                <Badge variant="outline" className="w-full justify-center py-2 border-grape text-grape">
                  Your Current Plan
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={`border-2 ${isPremium ? 'border-grape bg-grape/5 dark:bg-grape/10' : 'border-gray-200 dark:border-gray-700'} relative`}>
            {!isPremium && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-grape text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-slate dark:text-white">Premium Plan</span>
                {isPremium && <Badge className="bg-grape text-white">Current</Badge>}
              </CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate dark:text-white">$4.99</span>
                <span className="text-gray-600 dark:text-gray-300 ml-2">/month</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">or $49.99/year (save 17%)</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {!isPremium ? (
                <div className="space-y-3">
                  <Button 
                    onClick={() => handleUpgrade('monthly')}
                    disabled={isLoading}
                    className="w-full bg-grape hover:bg-grape/90 text-white"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isLoading ? "Processing..." : "Start Monthly Plan"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleUpgrade('yearly')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-grape text-grape hover:bg-grape/10"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    {isLoading ? "Processing..." : "Start Yearly Plan (Save 17%)"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    7-day free trial • Cancel anytime
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Badge variant="outline" className="w-full justify-center py-2 border-grape text-grape">
                    Your Current Plan
                  </Badge>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Manage billing and subscription details in your Stripe customer portal
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        {!isPremium && (
          <div className="mt-8 text-center">
            <Card className="border-grape/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate dark:text-white mb-2">
                  Ready to unlock unlimited wine discoveries?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start your 7-day free trial today and experience the full power of cork's AI-powered wine recommendations.
                </p>
                <Link href="/pricing">
                  <Button variant="outline" className="border-grape text-grape hover:bg-grape/10">
                    View Detailed Pricing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}