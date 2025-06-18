import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wine, Upload, Trash2, Eye, BarChart3, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import WineCard from "@/components/wine-card";
import CellarAnalytics from "@/components/cellar-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface SavedWine {
  id: number;
  wineName: string;
  wineType: string;
  region: string;
  vintage?: string;
  description: string;
  priceRange: string;
  abv: string;
  rating: string;
  source: string;
  createdAt: string;
}

interface UploadedWine {
  id: number;
  wineName: string;
  wineType: string;
  region: string;
  vintage?: string;
  optimalDrinkingStart: string;
  optimalDrinkingEnd: string;
  peakYearsStart: string;
  peakYearsEnd: string;
  analysis: string;
  estimatedValue: string;
  abv: string;
  originalImageUrl: string;
  createdAt: string;
}

export default function Cellar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

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

  const { data: savedWines = [], isLoading: savedWinesLoading } = useQuery({
    queryKey: ["/api/cellar"],
    enabled: isAuthenticated,
  });

  const { data: uploadedWines = [], isLoading: uploadedWinesLoading } = useQuery({
    queryKey: ["/api/uploads"],
    enabled: isAuthenticated,
  });

  const removeWineMutation = useMutation({
    mutationFn: async (wineId: number) => {
      await apiRequest("DELETE", `/api/cellar/${wineId}`);
    },
    onSuccess: () => {
      toast({
        title: "Wine Removed",
        description: "Wine removed from your cellar successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cellar"] });
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
      toast({
        title: "Error",
        description: "Failed to remove wine. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRemoveWine = (wineId: number) => {
    removeWineMutation.mutate(wineId);
  };

  const filteredSavedWines = savedWines.filter((wine: SavedWine) => {
    if (activeTab === "all") return true;
    if (activeTab === "recommendations") return wine.source === "recommendation";
    if (activeTab === "uploaded") return wine.source === "uploaded";
    return true;
  });

  const allWines = [...filteredSavedWines, ...uploadedWines];
  const hasWines = allWines.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin w-8 h-8 border-4 border-grape border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate mb-4">My Cellar</h2>
              <p className="text-lg text-gray-600">Your personalized wine collection and recommendations</p>
            </div>
            
            {/* Plan Status */}
            <div className="text-right">
              <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">{user?.subscriptionPlan === 'premium' ? 'Premium' : 'Free'} Plan</span>
                <span className="text-sm font-semibold text-slate">
                  {user?.subscriptionPlan === 'premium' ? '∞' : `${user?.usage?.savedWines || 0}/3`} saved
                </span>
              </div>
              {user?.subscriptionPlan !== 'premium' && (
                <Link href="/pricing">
                  <Button variant="link" className="mt-2 text-sm text-grape hover:text-purple-800 font-medium p-0">
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 max-w-2xl">
              <TabsTrigger value="all">All Wines</TabsTrigger>
              <TabsTrigger value="recommendations">Recommended</TabsTrigger>
              <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              {hasWines ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Saved Wine Cards */}
                  {filteredSavedWines.map((wine: SavedWine) => (
                    <WineCard
                      key={`saved-${wine.id}`}
                      wine={{
                        name: wine.wineName,
                        type: wine.wineType,
                        region: wine.region,
                        vintage: wine.vintage,
                        description: wine.description,
                        priceRange: wine.priceRange,
                        abv: wine.abv,
                        rating: wine.rating,
                      }}
                      onRemove={() => handleRemoveWine(wine.id)}
                      isLoading={removeWineMutation.isPending}
                      showRemoveButton={true}
                      source={wine.source}
                      createdAt={wine.createdAt}
                    />
                  ))}
                  
                  {/* Uploaded Wine Cards */}
                  {uploadedWines.map((wine: UploadedWine) => (
                    <div key={`uploaded-${wine.id}`} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <img 
                        src={wine.originalImageUrl} 
                        alt="Uploaded wine bottle" 
                        className="w-full h-48 object-cover rounded-xl mb-4" 
                      />
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs font-medium text-wine bg-red-50">
                            {wine.wineType}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-500 bg-blue-50">
                            Uploaded
                          </Badge>
                        </div>
                        <h3 className="font-poppins font-semibold text-lg text-slate mb-1">
                          {wine.wineName || "Unknown Wine"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{wine.region}</p>
                        {wine.optimalDrinkingStart && wine.optimalDrinkingEnd && (
                          <p className="text-xs text-green-600 font-medium">
                            Optimal: {wine.optimalDrinkingStart}-{wine.optimalDrinkingEnd}
                            {wine.peakYearsStart && wine.peakYearsEnd && (
                              <> • Peak: {wine.peakYearsStart}-{wine.peakYearsEnd}</>
                            )}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Uploaded {new Date(wine.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate">
                          {wine.estimatedValue || "Price unknown"}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-gray-400 hover:text-grape transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wine className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-slate mb-2">Your Cellar is Empty</h3>
                  <p className="text-gray-600 mb-6">Start building your wine collection by saving recommendations or uploading your wines</p>
                  <div className="flex justify-center space-x-4">
                    <Link href="/dashboard">
                      <Button className="bg-grape text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors">
                        Get Recommendations
                      </Button>
                    </Link>
                    <Link href="/upload">
                      <Button variant="outline" className="border-grape text-grape px-6 py-3 rounded-lg font-medium hover:bg-grape hover:text-white transition-colors">
                        Upload Wine
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="mt-8">
              {filteredSavedWines.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSavedWines.map((wine: SavedWine) => (
                    <WineCard
                      key={`rec-${wine.id}`}
                      wine={{
                        name: wine.wineName,
                        type: wine.wineType,
                        region: wine.region,
                        vintage: wine.vintage,
                        description: wine.description,
                        priceRange: wine.priceRange,
                        abv: wine.abv,
                        rating: wine.rating,
                      }}
                      onRemove={() => handleRemoveWine(wine.id)}
                      isLoading={removeWineMutation.isPending}
                      showRemoveButton={true}
                      source={wine.source}
                      createdAt={wine.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Wine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-semibold text-slate mb-2">No Recommended Wines</h3>
                  <p className="text-gray-600">Get personalized recommendations to start your collection</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="uploaded" className="mt-8">
              {uploadedWines.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {uploadedWines.map((wine: UploadedWine) => (
                    <div key={`up-${wine.id}`} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <img 
                        src={wine.originalImageUrl} 
                        alt="Uploaded wine bottle" 
                        className="w-full h-48 object-cover rounded-xl mb-4" 
                      />
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs font-medium text-wine bg-red-50">
                            {wine.wineType}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-500 bg-blue-50">
                            Uploaded
                          </Badge>
                        </div>
                        <h3 className="font-poppins font-semibold text-lg text-slate mb-1">
                          {wine.wineName || "Unknown Wine"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{wine.region}</p>
                        {wine.analysis && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-3">{wine.analysis}</p>
                        )}
                        {wine.optimalDrinkingStart && wine.optimalDrinkingEnd && (
                          <p className="text-xs text-green-600 font-medium">
                            Optimal: {wine.optimalDrinkingStart}-{wine.optimalDrinkingEnd}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate">
                          {wine.estimatedValue || "Price unknown"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-gray-400 hover:text-grape transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-semibold text-slate mb-2">No Uploaded Wines</h3>
                  <p className="text-gray-600">Upload photos of your wine collection for AI analysis</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <CellarAnalytics 
                isPremium={user?.subscriptionPlan === 'premium'}
                onUpgrade={() => window.location.href = '/pricing'}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
