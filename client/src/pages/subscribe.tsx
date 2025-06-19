import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ clientSecret }: { clientSecret: string }) => {
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
        return_url: window.location.origin + '/dashboard',
      },
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to Premium! You now have unlimited access.",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-grape to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-poppins font-bold text-slate">
          Upgrade to Premium
        </CardTitle>
        <p className="text-gray-600">
          Unlock unlimited wine discoveries and analysis
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <PaymentElement className="mb-6" />
          <Button 
            type="submit" 
            className="w-full bg-grape text-white hover:bg-purple-800"
            disabled={!stripe || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe for $4.99/month'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>• Cancel anytime</p>
          <p>• 7-day free trial</p>
          <p>• Secure payment processing</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
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
  }, [toast]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="py-16">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-grape mx-auto mb-4" />
              <p className="text-gray-600">Preparing your subscription...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
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

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SubscribeForm />
          </Elements>

          {/* Benefits Reminder */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-xl font-poppins font-bold text-slate text-center mb-6">
              What you'll get with Premium
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-grape bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-grape text-2xl">∞</span>
                </div>
                <h4 className="font-semibold text-slate mb-1">Unlimited Saves</h4>
                <p className="text-sm text-gray-600">Save as many wines as you want to your cellar</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-grape bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-grape text-2xl">📸</span>
                </div>
                <h4 className="font-semibold text-slate mb-1">Unlimited Analysis</h4>
                <p className="text-sm text-gray-600">Upload and analyze your entire wine collection</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-grape bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-grape text-2xl">🤖</span>
                </div>
                <h4 className="font-semibold text-slate mb-1">Enhanced AI</h4>
                <p className="text-sm text-gray-600">Get more detailed and personalized recommendations</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-grape bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-grape text-2xl">🛠️</span>
                </div>
                <h4 className="font-semibold text-slate mb-1">Advanced Tools</h4>
                <p className="text-sm text-gray-600">Access premium cellar management features</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
