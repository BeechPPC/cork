import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Upload as UploadIcon, Loader2, Camera, CheckCircle, AlertCircle, Edit3, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UploadArea from "@/components/upload-area";
import PlanLimitModal from "@/components/plan-limit-modal";

interface AnalysisResult {
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
}

export default function Upload() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWine, setEditedWine] = useState<AnalysisResult | null>(null);

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

  const analyzeWineMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('wine_image', file);
      
      const response = await fetch('/api/upload/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setEditedWine(data);
      toast({
        title: "Analysis Complete!",
        description: "Your wine has been analyzed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
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
      if (errorMessage.includes("Upload limit reached")) {
        setShowLimitModal(true);
        return;
      }
      
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze wine. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    analyzeWineMutation.mutate(file);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setEditedWine(null);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && analysisResult) {
      setEditedWine({ ...analysisResult });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedWine) return;

    try {
      const response = await apiRequest("PUT", `/api/uploads/${editedWine.id}`, editedWine);
      const updatedWine = await response.json();
      
      setAnalysisResult(updatedWine);
      setEditedWine(updatedWine);
      setIsEditing(false);
      
      toast({
        title: "Changes Saved",
        description: "Wine details have been updated successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof AnalysisResult, value: string) => {
    if (!editedWine) return;
    setEditedWine({
      ...editedWine,
      [field]: value
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-grape" />
      </div>
    );
  }

  const uploadCount = user?.usage?.uploadedWines || 0;
  const isFreePlan = user?.subscriptionPlan !== 'premium';
  const limitReached = isFreePlan && uploadCount >= 3;

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate mb-4">
              Analyse Your Wine Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload photos of wines from your cellar and let AI determine their optimal drinking window
            </p>
          </div>

          {!analysisResult ? (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8">
                {/* Upload Limit Indicator */}
                {isFreePlan && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-yellow-800">Free Plan Usage</span>
                        <p className="text-xs text-yellow-700">
                          {uploadCount} of 3 wine analyses used this month
                        </p>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-xs text-grape hover:text-purple-800 font-medium p-0"
                        onClick={() => window.location.href = '/pricing'}
                      >
                        Upgrade for unlimited
                      </Button>
                    </div>
                    <div className="mt-2 bg-yellow-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((uploadCount / 3) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <UploadArea 
                  onFileUpload={handleFileUpload}
                  isLoading={analyzeWineMutation.isPending}
                  disabled={limitReached}
                />

                {limitReached && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-700 font-medium">Upload limit reached</p>
                    <p className="text-xs text-red-600 mt-1">
                      Upgrade to Premium for unlimited wine uploads and analysis
                    </p>
                    <Button 
                      className="mt-3 bg-grape text-white hover:bg-purple-800"
                      onClick={() => window.location.href = '/pricing'}
                    >
                      Upgrade Now
                    </Button>
                  </div>
                )}

                {/* Upload Instructions */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-grape bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-grape font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-slate mb-2">Clear Photos</h4>
                    <p className="text-sm text-gray-600">Capture clear images of wine labels and bottles</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-grape bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-grape font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-slate mb-2">AI Analysis</h4>
                    <p className="text-sm text-gray-600">Our AI identifies the wine and analyses aging potential</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-grape bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-grape font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-slate mb-2">Get Insights</h4>
                    <p className="text-sm text-gray-600">Receive optimal drinking windows and tasting notes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Analysis Results */
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-poppins font-bold text-slate">Analysis Results</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Analysis Complete</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditToggle}
                      className="border-grape text-grape hover:bg-grape hover:text-white"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel Edit' : 'Edit Details'}
                    </Button>
                  </div>
                </div>
                
                {!isEditing ? (
                  /* Display Mode */
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <img 
                        src={analysisResult.originalImageUrl} 
                        alt="User uploaded wine bottle" 
                        className="w-full h-64 object-cover rounded-xl" 
                      />
                    </div>
                    
                    <div>
                      <div className="mb-4">
                        <Badge variant="secondary" className="text-wine bg-red-50 mb-2">
                          {analysisResult.wineType}
                        </Badge>
                        <h4 className="text-lg font-poppins font-semibold text-slate mt-2 mb-1">
                          {analysisResult.wineName || "Wine Analysis Complete"}
                        </h4>
                        <p className="text-sm text-gray-600">{analysisResult.region}</p>
                        {analysisResult.vintage && (
                          <p className="text-sm text-gray-600">Vintage: {analysisResult.vintage}</p>
                        )}
                      </div>

                      <div className="space-y-4">
                        {analysisResult.optimalDrinkingStart && analysisResult.optimalDrinkingEnd && (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h5 className="font-semibold text-green-800 mb-1">Optimal Drinking Window</h5>
                            <p className="text-sm text-green-700">
                              {analysisResult.optimalDrinkingStart} - {analysisResult.optimalDrinkingEnd}
                            </p>
                            {analysisResult.peakYearsStart && analysisResult.peakYearsEnd && (
                              <p className="text-xs text-green-600 mt-1">
                                Peak years: {analysisResult.peakYearsStart}-{analysisResult.peakYearsEnd}
                              </p>
                            )}
                          </div>
                        )}

                        {analysisResult.analysis && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h5 className="font-semibold text-blue-800 mb-1">AI Analysis</h5>
                            <p className="text-sm text-blue-700">{analysisResult.analysis}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          {analysisResult.estimatedValue && (
                            <span className="font-medium text-slate">
                              Estimated Value: {analysisResult.estimatedValue}
                            </span>
                          )}
                          {analysisResult.abv && (
                            <span className="text-gray-600">{analysisResult.abv}</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Button 
                          onClick={handleNewAnalysis}
                          className="flex-1 bg-grape text-white hover:bg-purple-800"
                        >
                          Analyse Another Wine
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-grape text-grape hover:bg-grape hover:text-white"
                          onClick={() => window.location.href = '/cellar'}
                        >
                          View Cellar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <img 
                        src={analysisResult.originalImageUrl} 
                        alt="User uploaded wine bottle" 
                        className="w-full h-64 object-cover rounded-xl" 
                      />
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                          Editing Wine Details
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Correct any details that weren't recognized properly by the AI analysis.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Basic Information */}
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="wineName" className="text-sm font-medium text-slate">
                            Wine Name *
                          </Label>
                          <Input
                            id="wineName"
                            value={editedWine?.wineName || ''}
                            onChange={(e) => handleInputChange('wineName', e.target.value)}
                            placeholder="Enter wine name"
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="wineType" className="text-sm font-medium text-slate">
                              Wine Type *
                            </Label>
                            <Input
                              id="wineType"
                              value={editedWine?.wineType || ''}
                              onChange={(e) => handleInputChange('wineType', e.target.value)}
                              placeholder="Red, White, Sparkling..."
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="vintage" className="text-sm font-medium text-slate">
                              Vintage
                            </Label>
                            <Input
                              id="vintage"
                              value={editedWine?.vintage || ''}
                              onChange={(e) => handleInputChange('vintage', e.target.value)}
                              placeholder="2018"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="region" className="text-sm font-medium text-slate">
                            Region *
                          </Label>
                          <Input
                            id="region"
                            value={editedWine?.region || ''}
                            onChange={(e) => handleInputChange('region', e.target.value)}
                            placeholder="Barossa Valley, Hunter Valley..."
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Drinking Windows */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate">Drinking Windows</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="optimalStart" className="text-sm font-medium text-slate">
                              Optimal Start
                            </Label>
                            <Input
                              id="optimalStart"
                              value={editedWine?.optimalDrinkingStart || ''}
                              onChange={(e) => handleInputChange('optimalDrinkingStart', e.target.value)}
                              placeholder="2024"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="optimalEnd" className="text-sm font-medium text-slate">
                              Optimal End
                            </Label>
                            <Input
                              id="optimalEnd"
                              value={editedWine?.optimalDrinkingEnd || ''}
                              onChange={(e) => handleInputChange('optimalDrinkingEnd', e.target.value)}
                              placeholder="2030"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="peakStart" className="text-sm font-medium text-slate">
                              Peak Start
                            </Label>
                            <Input
                              id="peakStart"
                              value={editedWine?.peakYearsStart || ''}
                              onChange={(e) => handleInputChange('peakYearsStart', e.target.value)}
                              placeholder="2026"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="peakEnd" className="text-sm font-medium text-slate">
                              Peak End
                            </Label>
                            <Input
                              id="peakEnd"
                              value={editedWine?.peakYearsEnd || ''}
                              onChange={(e) => handleInputChange('peakYearsEnd', e.target.value)}
                              placeholder="2028"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Additional Details */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="abv" className="text-sm font-medium text-slate">
                              ABV
                            </Label>
                            <Input
                              id="abv"
                              value={editedWine?.abv || ''}
                              onChange={(e) => handleInputChange('abv', e.target.value)}
                              placeholder="14.5%"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="estimatedValue" className="text-sm font-medium text-slate">
                              Estimated Value
                            </Label>
                            <Input
                              id="estimatedValue"
                              value={editedWine?.estimatedValue || ''}
                              onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                              placeholder="$45-65 AUD"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="analysis" className="text-sm font-medium text-slate">
                            Analysis & Tasting Notes
                          </Label>
                          <Textarea
                            id="analysis"
                            value={editedWine?.analysis || ''}
                            onChange={(e) => handleInputChange('analysis', e.target.value)}
                            placeholder="Describe the wine's characteristics, tasting notes, and aging potential..."
                            className="mt-1 min-h-[100px]"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleSaveChanges}
                          className="flex-1 bg-grape text-white hover:bg-purple-800"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleEditToggle}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <PlanLimitModal 
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        type="upload"
        currentCount={uploadCount}
        maxCount={3}
      />
      
      <Footer />
    </div>
  );
}
