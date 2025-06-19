import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Crown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ onSuccess, selectedPlan }: { onSuccess: () => void; selectedPlan: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?subscription=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full bg-grape hover:bg-purple-700 py-3 text-lg font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Start 7-Day Free Trial ({selectedPlan === 'yearly' ? '$49.99/year' : '$4.99/month'})
          </>
        )}
      </Button>
      <p className="text-sm text-gray-600 text-center">
        Your trial starts today. You'll be charged {selectedPlan === 'yearly' ? '$49.99/year' : '$4.99/month'} after 7 days. Cancel anytime.
      </p>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ plan: selectedPlan })
    })
      .then(async (res) => {
        if (res.status === 401) {
          toast({
            title: "Please log in",
            description: "You need to be logged in to subscribe",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }
        
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.message === "Already subscribed") {
          toast({
            title: "Already Subscribed",
            description: "You're already a premium member!",
          });
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else if (data.message) {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to initialize subscription. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, [toast, selectedPlan]);

  const handleSuccess = () => {
    setSubscriptionCreated(true);
    toast({
      title: "Welcome to Premium!",
      description: "Your 7-day free trial has started. Enjoy unlimited access!",
    });
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-grape mx-auto mb-4" />
            <p className="text-gray-600">Setting up your subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  if (subscriptionCreated) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Premium!</h2>
              <p className="text-gray-600 mb-4">
                Your 7-day free trial has started. Redirecting to dashboard...
              </p>
              <Loader2 className="w-4 h-4 animate-spin text-grape mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card>
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Setup Failed</h2>
              <p className="text-gray-600 mb-6">
                We couldn't set up your subscription. Please try again or contact support.
              </p>
              <Button onClick={() => window.location.href = '/pricing'}>
                Back to Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Premium Subscription
          </h1>
          <p className="text-lg text-gray-600">
            Start your 7-day free trial and unlock unlimited wine discoveries
          </p>
        </div>

        {/* Plan Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-center mb-4">Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Card 
              className={`cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'ring-2 ring-grape' : ''}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Monthly</h3>
                <p className="text-2xl font-bold text-grape">$4.99</p>
                <p className="text-sm text-gray-600">per month</p>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer transition-all ${selectedPlan === 'yearly' ? 'ring-2 ring-grape' : ''}`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Yearly</h3>
                <p className="text-2xl font-bold text-grape">$49.99</p>
                <p className="text-sm text-gray-600">per year</p>
                <Badge className="mt-1 bg-green-100 text-green-800">Save $10</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-grape">
                <Crown className="w-5 h-5 mr-2" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-3" />
                <span className="text-sm">Unlimited wine saves & uploads</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-3" />
                <span className="text-sm">AI meal & menu photo analysis</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-3" />
                <span className="text-sm">Food pairing recommendations</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-3" />
                <span className="text-sm">Advanced cellar analytics</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-3" />
                <span className="text-sm">Priority support</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm onSuccess={handleSuccess} selectedPlan={selectedPlan} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};