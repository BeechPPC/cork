import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, ChefHat, Wine, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PremiumBadge from "./premium-badge";

interface MealPairingProps {
  isPremium: boolean;
  onUpgrade?: () => void;
}

interface PairingRecommendation {
  wineName: string;
  wineType: string;
  producer?: string;
  vintage?: string;
  region: string;
  priceRange: string;
  matchReason: string;
  confidence: number;
}

interface AnalysisResult {
  recognizedFood: string[];
  cuisineType: string;
  mainIngredients: string[];
  cookingMethod: string;
  recommendations: PairingRecommendation[];
}

export default function MealPairing({ isPremium, onUpgrade }: MealPairingProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisType, setAnalysisType] = useState<'meal' | 'menu' | null>(null);
  const { toast } = useToast();

  if (!isPremium) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              AI Meal & Menu Pairing
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Upload photos of your meals or restaurant wine menus for instant pairing recommendations
            </p>
          </div>
          <PremiumBadge size="lg" className="mb-4" />
          <button 
            onClick={onUpgrade}
            className="text-grape hover:text-purple-800 font-medium text-sm underline"
          >
            Upgrade to unlock AI meal pairing
          </button>
        </CardContent>
      </Card>
    );
  }

  const handleFileUpload = async (file: File, type: 'meal' | 'menu') => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, or WebP).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisType(type);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('analysisType', type);

      const response = await fetch('/api/analyze-meal-pairing', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json() as AnalysisResult;
      setAnalysisResult(result);
      toast({
        title: "Analysis complete!",
        description: `Found ${result.recommendations.length} wine recommendations`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMealUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'meal');
    }
  };

  const handleMenuUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'menu');
    }
  };

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-orange-600" />
            AI Meal & Menu Pairing
          </CardTitle>
          <PremiumBadge size="sm" />
        </div>
        <p className="text-sm text-gray-600">
          Upload photos for instant wine pairing recommendations
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isAnalyzing && !analysisResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Meal Upload */}
            <div className="text-center">
              <input
                type="file"
                id="meal-upload"
                accept="image/*"
                onChange={handleMealUpload}
                className="hidden"
              />
              <label
                htmlFor="meal-upload"
                className="cursor-pointer block p-6 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 transition-colors"
              >
                <ChefHat className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-800 mb-1">Upload Meal Photo</h3>
                <p className="text-xs text-gray-600">
                  Take a photo of your food for pairing suggestions
                </p>
              </label>
            </div>

            {/* Menu Upload */}
            <div className="text-center">
              <input
                type="file"
                id="menu-upload"
                accept="image/*"
                onChange={handleMenuUpload}
                className="hidden"
              />
              <label
                htmlFor="menu-upload"
                className="cursor-pointer block p-6 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 transition-colors"
              >
                <Wine className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-800 mb-1">Upload Wine Menu</h3>
                <p className="text-xs text-gray-600">
                  Photo of restaurant wine list for menu-specific pairings
                </p>
              </label>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-800 mb-2">
              {analysisType === 'meal' ? 'Analyzing your meal...' : 'Reading wine menu...'}
            </h3>
            <p className="text-sm text-gray-600">
              {analysisType === 'meal' 
                ? 'Identifying ingredients and cooking methods'
                : 'Extracting wine information from menu'
              }
            </p>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-4">
            {/* Food Analysis */}
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-orange-600" />
                Food Analysis
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Cuisine:</span>
                  <span className="ml-2 font-medium text-gray-800">{analysisResult.cuisineType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cooking Method:</span>
                  <span className="ml-2 font-medium text-gray-800">{analysisResult.cookingMethod}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Recognized Items:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysisResult.recognizedFood.map((food, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-800">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <span className="text-gray-600 text-sm">Main Ingredients:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysisResult.mainIngredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Wine Recommendations */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Wine className="w-4 h-4 mr-2 text-orange-600" />
                Wine Recommendations ({analysisResult.recommendations.length})
              </h3>
              
              {analysisResult.recommendations.map((wine, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">{wine.wineName}</h4>
                      <p className="text-sm text-gray-600">
                        {wine.producer && `${wine.producer} • `}
                        {wine.region} • {wine.wineType}
                        {wine.vintage && ` • ${wine.vintage}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={wine.confidence > 85 ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {wine.confidence}% match
                      </Badge>
                      <p className="text-sm font-medium text-gray-800 mt-1">{wine.priceRange}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded italic">
                    "{wine.matchReason}"
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={() => {
                  setAnalysisResult(null);
                  setAnalysisType(null);
                }}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Analyze Another Photo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}