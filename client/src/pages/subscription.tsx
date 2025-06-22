import { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Crown, 
  Check, 
  CreditCard, 
  Calendar, 
  User, 
  ArrowRight, 
  Download, 
  ExternalLink,
  MapPin,
  Edit,
  Save,
  X,
  Pause,
  Play,
  RefreshCw,
  AlertTriangle,
  Shield
} from "lucide-react";
import Header from "@/components/header";
import { Link } from "wouter";

interface BillingInfo {
  hasStripeData: boolean;
  customer?: {
    email: string;
    name: string;
    address: any;
  };
  invoices: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    invoice_pdf: string;
    hosted_invoice_url: string;
    period_start: number;
    period_end: number;
  }>;
  paymentMethod?: {
    id: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  } | null;
  subscription?: {
    id: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
    cancel_at_period_end: boolean;
    plan: string;
    pause_collection?: any;
  } | null;
}

export default function Subscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRetentionOffer, setShowRetentionOffer] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [addressForm, setAddressForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'AU'
  });

  const isPremium = user?.subscriptionPlan === 'premium';

  // Fetch billing information
  const { data: billingInfo, isLoading: billingLoading } = useQuery<BillingInfo>({
    queryKey: ['/api/billing-info'],
    enabled: isPremium,
  });

  // Update billing address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async (address: any) => {
      const response = await apiRequest("POST", "/api/update-billing-address", { address });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Billing address updated successfully",
      });
      setIsEditingAddress(false);
      queryClient.invalidateQueries({ queryKey: ['/api/billing-info'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update billing address",
        variant: "destructive",
      });
    },
  });

  const handleEditAddress = () => {
    if (billingInfo?.customer?.address) {
      setAddressForm({
        line1: billingInfo.customer.address.line1 || '',
        line2: billingInfo.customer.address.line2 || '',
        city: billingInfo.customer.address.city || '',
        state: billingInfo.customer.address.state || '',
        postal_code: billingInfo.customer.address.postal_code || '',
        country: billingInfo.customer.address.country || 'AU'
      });
    }
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    updateAddressMutation.mutate(addressForm);
  };

  const handleManagePayment = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-portal-session");
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open payment management",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  // Subscription control mutations
  const pauseSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/pause-subscription");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Paused",
        description: "Your subscription has been paused. You can resume it anytime.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/billing-info'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to pause subscription",
        variant: "destructive",
      });
    },
  });

  const resumeSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/resume-subscription");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Resumed",
        description: "Your subscription has been resumed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/billing-info'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resume subscription",
        variant: "destructive",
      });
    },
  });

  const changePlanMutation = useMutation({
    mutationFn: async (newPlan: string) => {
      const response = await apiRequest("POST", "/api/change-plan", { newPlan });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Plan Changed",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/billing-info'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to change plan",
        variant: "destructive",
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async ({ cancelImmediately, reason }: { cancelImmediately: boolean; reason: string }) => {
      const response = await apiRequest("POST", "/api/cancel-subscription", { cancelImmediately, reason });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Canceled",
        description: data.message,
      });
      setShowCancelModal(false);
      setShowRetentionOffer(false);
      queryClient.invalidateQueries({ queryKey: ['/api/billing-info'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reactivate-subscription");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Reactivated",
        description: "Welcome back! Your subscription has been reactivated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/billing-info'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reactivate subscription",
        variant: "destructive",
      });
    },
  });

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (!cancellationReason) {
      setShowRetentionOffer(true);
      return;
    }
    cancelSubscriptionMutation.mutate({ cancelImmediately: false, reason: cancellationReason });
  };

  const handleCancelImmediate = () => {
    cancelSubscriptionMutation.mutate({ cancelImmediately: true, reason: cancellationReason });
  };

  const isPaused = billingInfo?.subscription?.pause_collection !== null;
  const isCanceled = billingInfo?.subscription?.cancel_at_period_end;
  const currentPlan = billingInfo?.subscription?.plan;

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
                {isPremium && billingInfo?.subscription && (
                  <div className="space-y-1 mt-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        Next billing: {formatDate(billingInfo.subscription.current_period_end)} 
                        ({billingInfo.subscription.plan === 'month' ? 'Monthly' : 'Yearly'})
                      </span>
                    </div>
                    {billingInfo.subscription.cancel_at_period_end && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Cancels at period end
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              {isPremium && (
                <Crown className="h-12 w-12 text-grape" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Billing & Account Management - Only show for Premium users */}
        {isPremium && (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-slate dark:text-white">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {billingLoading ? (
                    <p className="text-gray-500">Loading payment information...</p>
                  ) : billingInfo?.paymentMethod ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            {billingInfo.paymentMethod.brand?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate dark:text-white">
                              •••• •••• •••• {billingInfo.paymentMethod.last4}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Expires {billingInfo.paymentMethod.exp_month.toString().padStart(2, '0')}/{billingInfo.paymentMethod.exp_year}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleManagePayment}
                        className="w-full"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Update Payment Method
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 dark:text-gray-400 mb-3">No payment method on file</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleManagePayment}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-slate dark:text-white">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Billing Address
                    </div>
                    {!isEditingAddress && billingInfo?.customer?.address && (
                      <Button variant="ghost" size="sm" onClick={handleEditAddress}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {billingLoading ? (
                    <p className="text-gray-500">Loading address information...</p>
                  ) : isEditingAddress ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="line1">Address Line 1</Label>
                        <Input
                          id="line1"
                          value={addressForm.line1}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                        <Input
                          id="line2"
                          value={addressForm.line2}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                          placeholder="Apartment, suite, unit, etc."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="postal_code">Postcode</Label>
                          <Input
                            id="postal_code"
                            value={addressForm.postal_code}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, postal_code: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={addressForm.country}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={handleSaveAddress}
                          disabled={updateAddressMutation.isPending}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {updateAddressMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditingAddress(false)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : billingInfo?.customer?.address ? (
                    <div className="space-y-2">
                      <p className="text-slate dark:text-white">{billingInfo.customer.address.line1}</p>
                      {billingInfo.customer.address.line2 && (
                        <p className="text-slate dark:text-white">{billingInfo.customer.address.line2}</p>
                      )}
                      <p className="text-slate dark:text-white">
                        {billingInfo.customer.address.city}, {billingInfo.customer.address.state} {billingInfo.customer.address.postal_code}
                      </p>
                      <p className="text-slate dark:text-white">{billingInfo.customer.address.country}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 dark:text-gray-400 mb-3">No billing address on file</p>
                      <Button variant="outline" size="sm" onClick={handleEditAddress}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Add Billing Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Billing History */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-slate dark:text-white">
                  <Download className="mr-2 h-5 w-5" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {billingLoading ? (
                  <p className="text-gray-500">Loading billing history...</p>
                ) : billingInfo?.invoices && billingInfo.invoices.length > 0 ? (
                  <div className="space-y-4">
                    {billingInfo.invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-slate dark:text-white">
                                {formatAmount(invoice.amount, invoice.currency)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(invoice.created)}
                              </p>
                            </div>
                            <div>
                              <Badge 
                                variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                className={invoice.status === 'paid' ? 'bg-green-500' : ''}
                              >
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Billing period: {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {invoice.hosted_invoice_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View
                              </a>
                            </Button>
                          )}
                          {invoice.invoice_pdf && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                PDF
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No billing history available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription Controls */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-slate dark:text-white">
                  <Shield className="mr-2 h-5 w-5" />
                  Subscription Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Plan Change */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate dark:text-white">Change Plan</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Switch between monthly and yearly billing. Prorated amounts will be applied.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant={currentPlan === 'month' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changePlanMutation.mutate('monthly')}
                        disabled={currentPlan === 'month' || changePlanMutation.isPending || isPaused}
                        className={currentPlan === 'month' ? 'bg-grape' : ''}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {currentPlan === 'month' ? 'Current: Monthly' : 'Switch to Monthly'}
                      </Button>
                      <Button
                        variant={currentPlan === 'year' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changePlanMutation.mutate('yearly')}
                        disabled={currentPlan === 'year' || changePlanMutation.isPending || isPaused}
                        className={currentPlan === 'year' ? 'bg-grape' : ''}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {currentPlan === 'year' ? 'Current: Yearly' : 'Switch to Yearly (Save 17%)'}
                      </Button>
                    </div>
                  </div>

                  {/* Pause/Resume */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate dark:text-white">Pause Subscription</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {isPaused ? 'Your subscription is currently paused. Resume to regain access.' : 'Temporarily pause your subscription without losing your account.'}
                    </p>
                    {isPaused ? (
                      <Button
                        size="sm"
                        onClick={() => resumeSubscriptionMutation.mutate()}
                        disabled={resumeSubscriptionMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {resumeSubscriptionMutation.isPending ? 'Resuming...' : 'Resume Subscription'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pauseSubscriptionMutation.mutate()}
                        disabled={pauseSubscriptionMutation.isPending || isCanceled}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        {pauseSubscriptionMutation.isPending ? 'Pausing...' : 'Pause Subscription'}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Cancel/Reactivate */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate dark:text-white">
                    {isCanceled ? 'Reactivate Subscription' : 'Cancel Subscription'}
                  </h4>
                  
                  {isCanceled ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            Your subscription is set to cancel on {formatDate(billingInfo?.subscription?.current_period_end || 0)}. 
                            You can reactivate it before then to continue your service.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => reactivateSubscriptionMutation.mutate()}
                        disabled={reactivateSubscriptionMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {reactivateSubscriptionMutation.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Cancel your subscription with options to retain access until your billing period ends.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelClick}
                        disabled={isPaused}
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Separator className="my-8" />
          </>
        )}

        {/* Cancellation Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                We're sorry to see you go. Please let us know why you're canceling to help us improve.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for canceling (optional)</Label>
                <Select value={cancellationReason} onValueChange={setCancellationReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="too_expensive">Too expensive</SelectItem>
                    <SelectItem value="not_using">Not using enough</SelectItem>
                    <SelectItem value="missing_features">Missing features</SelectItem>
                    <SelectItem value="found_alternative">Found alternative</SelectItem>
                    <SelectItem value="temporary">Temporary break</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="w-full sm:w-auto"
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelConfirm}
                disabled={cancelSubscriptionMutation.isPending}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                {cancelSubscriptionMutation.isPending ? 'Processing...' : 'Cancel at Period End'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Retention Offer Modal */}
        <Dialog open={showRetentionOffer} onOpenChange={setShowRetentionOffer}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Wait! We'd love to keep you</DialogTitle>
              <DialogDescription>
                Before you go, here are some options that might help:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4 border-grape/20">
                  <div className="flex items-center space-x-3">
                    <Pause className="h-5 w-5 text-grape" />
                    <div>
                      <h4 className="font-medium">Pause instead of cancel</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Take a break and resume when you're ready
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border-grape/20">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="h-5 w-5 text-grape" />
                    <div>
                      <h4 className="font-medium">Switch to yearly and save 17%</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Lower monthly cost with annual billing
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  pauseSubscriptionMutation.mutate();
                  setShowRetentionOffer(false);
                }}
                disabled={pauseSubscriptionMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause Instead
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  changePlanMutation.mutate('yearly');
                  setShowRetentionOffer(false);
                }}
                disabled={changePlanMutation.isPending || currentPlan === 'year'}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Switch to Yearly
              </Button>
              <Button
                onClick={handleCancelImmediate}
                disabled={cancelSubscriptionMutation.isPending}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                {cancelSubscriptionMutation.isPending ? 'Canceling...' : 'Still Cancel'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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