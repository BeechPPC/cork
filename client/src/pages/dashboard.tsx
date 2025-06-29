import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  Wine,
  Sparkles,
  Camera,
  MessageSquare,
  Mic,
  Upload,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  apiRequest,
  authenticatedApiRequest,
  queryClient,
} from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation';
import { useMutation } from '@tanstack/react-query';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WineCard from '@/components/wine-card';
import WinePairingSuggestions from '@/components/wine-pairing-suggestions';
import MealPairing from '@/components/meal-pairing';
import VoiceSearch from '@/components/voice-search';

import PlanLimitModal from '@/components/plan-limit-modal';
import ProfileSetupModal from '@/components/profile-setup-modal';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth-wrapper';

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
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<WineRecommendation[]>(
    []
  );
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [menuImage, setMenuImage] = useState<File | null>(null);
  const [menuQuestion, setMenuQuestion] = useState('');
  const [menuAnalysisResult, setMenuAnalysisResult] = useState('');
  const [isAnalyzingMenu, setIsAnalyzingMenu] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Fetch user from backend API
  const { data: user, isLoading: isUserLoading } = useAuthenticatedQuery(
    ['/api/auth/user'],
    async token => {
      const res = await fetch('/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      console.log('🔍 User data fetched:', {
        id: userData.id,
        subscriptionPlan: userData.subscriptionPlan,
        email: userData.email,
        timestamp: new Date().toISOString(),
      });
      return userData;
    }
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: 'Unauthorized',
        description: 'You are logged out. Logging in again...',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Check if profile setup is needed (use backend user)
  useEffect(() => {
    console.log('🔍 Dashboard profile setup check:', {
      hasUser: !!user,
      userProfileCompleted: user?.profileCompleted,
      hasDateOfBirth: !!user?.dateOfBirth,
      hasProfileData: !!(user?.dateOfBirth || user?.wineExperienceLevel),
      user: user,
      isUserLoading: isUserLoading,
      timestamp: new Date().toISOString(),
    });

    // If user data is still loading, wait
    if (isUserLoading) {
      console.log('⏳ Waiting for user data to load...');
      setShowProfileSetup(false);
      return;
    }

    // If no user data available, show profile setup as fallback
    if (!user) {
      console.log(
        '⚠️ No user data available, showing profile setup as fallback'
      );
      setShowProfileSetup(true);
      return;
    }

    // If profile is explicitly marked as completed, hide the modal
    if (user.profileCompleted === true) {
      console.log('✅ Profile already completed - hiding modal');
      setShowProfileSetup(false);
      return;
    }

    // If profile is explicitly marked as not completed, show the modal
    if (user.profileCompleted === false) {
      console.log('✅ Showing profile setup modal - user needs onboarding');
      setShowProfileSetup(true);
      return;
    }

    // If profileCompleted is undefined/null, check if user has any profile data
    // This handles legacy users who might not have the profileCompleted field
    if (user.profileCompleted === undefined || user.profileCompleted === null) {
      if (user.dateOfBirth) {
        console.log(
          '✅ User has profile data but no completion flag - assuming completed'
        );
        setShowProfileSetup(false);
      } else {
        console.log('✅ User has no profile data - showing profile setup');
        setShowProfileSetup(true);
      }
      return;
    }

    // Default case - hide modal
    console.log('✅ Default case - hiding profile setup modal');
    setShowProfileSetup(false);
  }, [user, isUserLoading]);

  // TEMPORARY: Force show profile setup for debugging
  const forceShowProfileSetup = () => {
    console.log('🔧 Force showing profile setup modal for debugging');
    setShowProfileSetup(true);
  };

  // TEMPORARY: Force refresh user data for debugging
  const forceRefreshUserData = () => {
    console.log('🔧 Force refreshing user data for debugging');
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
  };

  // Debug: Log user data changes
  useEffect(() => {
    if (user) {
      console.log('🔄 User data updated:', {
        id: user.id,
        subscriptionPlan: user.subscriptionPlan,
        email: user.email,
        profileCompleted: user.profileCompleted,
        dateOfBirth: user.dateOfBirth,
        timestamp: new Date().toISOString(),
      });
    }
  }, [user]);

  const getRecommendationsMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const response = await apiRequest('POST', '/api/recommendations', {
        query: searchQuery,
      });
      return response.json();
    },
    onSuccess: data => {
      console.log('New recommendations received:', data.recommendations);
      setRecommendations(data.recommendations || []);
      toast({
        title: 'Recommendations Found!',
        description: `Found ${
          data.recommendations?.length || 0
        } wine recommendations for you.`,
      });
    },
    onError: error => {
      if (isUnauthorizedError(error)) {
        toast({
          title: 'Unauthorized',
          description: 'You are logged out. Logging in again...',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/api/login';
        }, 500);
        return;
      }
      toast({
        title: 'Error',
        description: 'Failed to get wine recommendations. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const saveWineMutation = useMutation({
    mutationFn: async (wine: WineRecommendation) => {
      const response = await authenticatedApiRequest(
        'POST',
        '/api/cellar/save',
        {
          wineName: wine.name,
          wineType: wine.type,
          region: wine.region,
          vintage: wine.vintage ? String(wine.vintage) : undefined,
          description: wine.description,
          priceRange: wine.priceRange,
          abv: String(wine.abv),
          rating: String(wine.rating),
          source: 'recommendation',
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Wine Saved!',
        description: 'Added to your cellar successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: error => {
      if (isUnauthorizedError(error)) {
        toast({
          title: 'Unauthorized',
          description: 'You are logged out. Logging in again...',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/api/login';
        }, 500);
        return;
      }

      const errorMessage = error.message;
      if (errorMessage.includes('Plan limit reached')) {
        setShowLimitModal(true);
        return;
      }

      toast({
        title: 'Error',
        description: 'Failed to save wine. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleGetRecommendations = (searchQuery?: string) => {
    const queryToUse = searchQuery || query;

    if (!queryToUse || typeof queryToUse !== 'string' || !queryToUse.trim()) {
      toast({
        title: 'Input Required',
        description: "Please describe what kind of wine you're looking for.",
        variant: 'destructive',
      });
      return;
    }

    // Clear previous recommendations to prevent caching issues
    setRecommendations([]);

    if (searchQuery) {
      setQuery(searchQuery);
    }
    getRecommendationsMutation.mutate(queryToUse);
  };

  const handleSaveWine = (wine: WineRecommendation) => {
    saveWineMutation.mutate(wine);
  };

  const handleMenuUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file',
          description: 'Please upload an image file (JPG, PNG, or WebP).',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }

      setMenuImage(file);
      setMenuAnalysisResult('');
    }
  };

  const handleMenuAnalysis = async () => {
    if (!menuImage || !menuQuestion.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please upload a menu image and enter your question.',
        variant: 'destructive',
      });
      return;
    }

    if (user?.subscriptionPlan !== 'premium') {
      toast({
        title: 'Premium Feature Required',
        description: 'Upgrade to Premium to analyze wine menus',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzingMenu(true);
    setMenuAnalysisResult('');

    try {
      const formData = new FormData();
      formData.append('image', menuImage);
      formData.append('question', menuQuestion);

      const response = await fetch('/api/analyze-wine-menu', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setMenuAnalysisResult(result.analysis);

      toast({
        title: 'Analysis complete!',
        description: 'Your wine menu analysis is ready',
      });
    } catch (error) {
      console.error('Menu analysis failed:', error);
      toast({
        title: 'Analysis failed',
        description: 'Please try again with a clearer image.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzingMenu(false);
    }
  };

  const removeMenuImage = () => {
    setMenuImage(null);
    setMenuAnalysisResult('');
    setMenuQuestion('');
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
              Describe your mood, occasion, or food pairing and let our AI
              sommelier find your perfect match
            </p>

            {/* TEMPORARY DEBUG BUTTON */}
            <div className="mt-4 space-x-2">
              <Button
                onClick={forceShowProfileSetup}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                🔧 Debug: Force Show Profile Setup
              </Button>
              <Button
                onClick={forceRefreshUserData}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                🔄 Debug: Refresh User Data
              </Button>
            </div>
          </div>

          {/* Recommendation Input - Now with Tabs */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-cream border border-gray-200">
              <CardContent className="p-8">
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                    <TabsTrigger
                      value="text"
                      className="flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Text Search</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="voice"
                      className="flex items-center space-x-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Voice Search</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="photo"
                      className="flex items-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Meal Pairing</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="menu"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Wine Menu Help</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate mb-3">
                        Tell us what you're looking for
                      </label>
                      <Textarea
                        className="w-full resize-none focus:ring-grape focus:border-grape"
                        rows={4}
                        placeholder="Suggest a wine for steak around $30..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
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
                        onClick={() => handleGetRecommendations()}
                        disabled={
                          getRecommendationsMutation.isPending ||
                          !query ||
                          typeof query !== 'string' ||
                          !query.trim()
                        }
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
                      onUpgrade={() => (window.location.href = '/pricing')}
                    />
                  </TabsContent>

                  <TabsContent value="photo">
                    <MealPairing
                      isPremium={user?.subscriptionPlan === 'premium'}
                      onUpgrade={() => (window.location.href = '/pricing')}
                    />
                  </TabsContent>

                  <TabsContent value="menu" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="block text-sm font-medium text-slate mb-3">
                          Upload Wine Menu Photo
                        </Label>

                        {!menuImage ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-grape transition-colors">
                            <input
                              type="file"
                              id="menu-upload"
                              accept="image/*"
                              onChange={handleMenuUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="menu-upload"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm font-medium text-gray-700">
                                Click to upload wine menu
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                JPG, PNG or WebP up to 10MB
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-grape" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {menuImage.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(menuImage.size / 1024 / 1024).toFixed(2)}{' '}
                                    MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={removeMenuImage}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="menu-question"
                          className="block text-sm font-medium text-slate mb-3"
                        >
                          Ask a Question About the Menu
                        </Label>
                        <Textarea
                          id="menu-question"
                          value={menuQuestion}
                          onChange={e => setMenuQuestion(e.target.value)}
                          placeholder="What wine on this menu would pair well with steak?"
                          className="w-full resize-none focus:ring-grape focus:border-grape"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleMenuAnalysis}
                          disabled={
                            !menuImage ||
                            !menuQuestion.trim() ||
                            isAnalyzingMenu
                          }
                          className="bg-grape hover:bg-purple-700 text-white px-6 py-2"
                        >
                          {isAnalyzingMenu ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analysing Menu...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Analyse Menu
                            </>
                          )}
                        </Button>
                      </div>

                      {user?.subscriptionPlan !== 'premium' && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">
                              Premium Feature
                            </span>
                          </div>
                          <p className="text-sm text-amber-700 mt-1">
                            Upgrade to Premium to analyse wine menus and get
                            expert recommendations.
                          </p>
                          <Button
                            size="sm"
                            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => (window.location.href = '/pricing')}
                          >
                            Upgrade Now
                          </Button>
                        </div>
                      )}

                      {menuAnalysisResult && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Wine Menu Analysis
                          </h4>
                          <p className="text-sm text-blue-800 whitespace-pre-wrap">
                            {menuAnalysisResult}
                          </p>
                        </div>
                      )}
                    </div>
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
                    key={`${wine.name}-${wine.region}-${index}`}
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
                    onUpgrade={() => (window.location.href = '/pricing')}
                  />
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {recommendations.length === 0 &&
            !getRecommendationsMutation.isPending && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wine className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-slate mb-2">
                  Ready for Wine Recommendations?
                </h3>
                <p className="text-gray-600 mb-6">
                  Describe what you're looking for and let our AI sommelier help
                  you discover amazing wines
                </p>
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
        onComplete={() => {
          setTimeout(() => {
            setShowProfileSetup(false);
          }, 100);
        }}
      />

      <Footer />
    </div>
  );
}
