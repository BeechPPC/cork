import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wine, Sparkles, Camera, MessageSquare, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import WineCard from "@/components/wine-card";
import WinePairingSuggestions from "@/components/wine-pairing-suggestions";
import MealPairing from "@/components/meal-pairing";
import VoiceSearch from "@/components/voice-search";

import PlanLimitModal from "@/components/plan-limit-modal";
import ProfileSetupModal from "@/components/profile-setup-modal";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface WineRecommendation {
  name: string;
  type: string;
  region: string;
  vintage?: string;
  description: string;
  priceRange: string;
  abv: string;
  rating: string;
  matchReason: string;
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<WineRecommendation[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Check if profile setup is needed
  useEffect(() => {
    if (user && !user.profileCompleted) {
      setShowProfileSetup(true);
    }
  }, [user]);

  const getRecommendationsMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const response = await apiRequest("POST", "/api/recommendations", { query: searchQuery });
      return response.json();
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations || []);
      toast({
        title: "Recommendations Found!",
        description: `Found ${data.recommendations?.length || 0} wine recommendations for you.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to get wine recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveWineMutation = useMutation({
    mutationFn: async (wine: WineRecommendation) => {
      const response = await apiRequest("POST", "/api/cellar/save", {
        wineName: wine.name,
        wineType: wine.type,
        region: wine.region,
        vintage: wine.vintage ? String(wine.vintage) : undefined,
        description: wine.description,
        priceRange: wine.priceRange,
        abv: String(wine.abv),
        rating: String(wine.rating),
        source: "recommendation",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Wine Saved!",
        description: "Added to your cellar successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      const errorMessage = error.message;
      if (errorMessage.includes("Plan limit reached")) {
        setShowLimitModal(true);
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to save wine. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetRecommendations = (searchQuery?: string) => {
    const queryToUse = searchQuery || query;
    if (!queryToUse || typeof queryToUse !== 'string' || !queryToUse.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe what kind of wine you're looking for.",
        variant: "destructive",
      });
      return;
    }
    setQuery(queryToUse);
    getRecommendationsMutation.mutate(queryToUse);
  };

  const handleSaveWine = (wine: WineRecommendation) => {
    saveWineMutation.mutate(wine);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-grape" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate mb-4">
              What Wine Are You Craving?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Describe your mood, occasion, or food pairing and let our AI sommelier find your perfect match
            </p>
          </div>

          {/* Recommendation Input - Now with Tabs */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-cream border border-gray-200">
              <CardContent className="p-8">
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="text" className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Text Search</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center space-x-2">
                      <Mic className="w-4 h-4" />
                      <span>Voice Search</span>
                    </TabsTrigger>
                    <TabsTrigger value="photo" className="flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Meal Photos</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate mb-3">Tell us what you're looking for</label>
                      <Textarea 
                        className="w-full resize-none focus:ring-grape focus:border-grape" 
                        rows={4} 
                        placeholder="I'm having a romantic dinner with my partner and we're serving grilled lamb with rosemary. Looking for something bold but not too heavy..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-4 h-4 text-grape" />
                          <span>AI-powered recommendations</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wine className="w-4 h-4 text-grape" />
                          <span>Australian wines focus</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleGetRecommendations}
                        disabled={getRecommendationsMutation.isPending || !query.trim()}
                        className="bg-grape hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                      >
                        {getRecommendationsMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Getting Recommendations...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Get Recommendations
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="voice" className="space-y-6">
                    <VoiceSearch 
                      onSearch={handleGetRecommendations}
                      isSearching={getRecommendationsMutation.isPending}
                      isPremium={user?.subscriptionPlan === 'premium'}
                      onUpgrade={() => window.location.href = '/pricing'}
                    />
                  </TabsContent>

                  <TabsContent value="photo">
                    <MealPairing 
                      isPremium={user?.subscriptionPlan === 'premium'}
                      onUpgrade={() => window.location.href = '/pricing'}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Wine Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((wine, index) => (
                  <WineCard
                    key={index}
                    wine={wine}
                    onSave={() => handleSaveWine(wine)}
                    isLoading={saveWineMutation.isPending}
                    showSaveButton={true}
                    isPremium={user?.subscriptionPlan === 'premium'}
                    showPremiumFeatures={true}
                  />
                ))}
              </div>

              {/* Premium Food Pairing Suggestions */}
              {recommendations.length > 0 && (
                <div className="mt-8">
                  <WinePairingSuggestions 
                    wineName={recommendations[0].name}
                    wineType={recommendations[0].type}
                    isPremium={user?.subscriptionPlan === 'premium'}
                    onUpgrade={() => window.location.href = '/pricing'}
                  />
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {recommendations.length === 0 && !getRecommendationsMutation.isPending && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wine className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-slate mb-2">Ready for Wine Recommendations?</h3>
              <p className="text-gray-600 mb-6">Describe what you're looking for and let our AI sommelier help you discover amazing wines</p>
            </div>
          )}
        </div>
      </section>

      <PlanLimitModal 
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        type="save"
        currentCount={0}
        maxCount={3}
      />

      <ProfileSetupModal
        open={showProfileSetup}
        onComplete={() => setShowProfileSetup(false)}
      />
    </div>
  );
}
