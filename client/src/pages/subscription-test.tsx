import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionTest() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reset-subscription-test', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Subscription Reset",
          description: "You can now test the subscription flow again",
        });
        setTimeout(() => {
          window.location.href = '/subscribe';
        }, 1000);
      } else {
        throw new Error('Failed to reset subscription');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset subscription status",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This page allows you to reset your subscription status for testing purposes.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Current Status</h3>
              <p className="text-yellow-700">You already have an active subscription, which is why the payment form doesn't appear.</p>
            </div>
            <Button 
              onClick={resetSubscription}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Resetting..." : "Reset Subscription for Testing"}
            </Button>
            <div className="text-sm text-gray-500">
              <p><strong>Note:</strong> This is for testing only. In production, users would manage subscriptions through Stripe's customer portal.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}