import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, Loader2, Camera, CheckCircle, AlertCircle } from "lucide-react";
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
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Analysis Complete</span>
                  </div>
                </div>
                
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
