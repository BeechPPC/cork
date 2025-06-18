import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import PremiumBadge from "./premium-badge";

interface InvestmentData {
  currentValue: string;
  purchasePrice: string;
  valueChange: number;
  valueChangePercent: number;
  marketTrend: "up" | "down" | "stable";
  nextReviewDate: string;
}

interface WineInvestmentTrackerProps {
  wineName: string;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export default function WineInvestmentTracker({ 
  wineName, 
  isPremium, 
  onUpgrade 
}: WineInvestmentTrackerProps) {
  const mockInvestmentData: InvestmentData = {
    currentValue: "$180-220",
    purchasePrice: "$150",
    valueChange: 45,
    valueChangePercent: 23.5,
    marketTrend: "up",
    nextReviewDate: "March 2025"
  };

  if (!isPremium) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Investment Value Tracking
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Track your wine's investment potential with real-time market valuations and trends
            </p>
          </div>
          <PremiumBadge size="lg" className="mb-4" />
          <button 
            onClick={onUpgrade}
            className="text-grape hover:text-purple-800 font-medium text-sm underline"
          >
            Upgrade to track investment value
          </button>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (mockInvestmentData.marketTrend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    return mockInvestmentData.valueChangePercent > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800">Investment Tracking</CardTitle>
          <PremiumBadge size="sm" />
        </div>
        <p className="text-sm text-gray-600">Market valuation for {wineName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center mb-1">
              <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-xs text-gray-500">Current Value</span>
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {mockInvestmentData.currentValue}
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center mb-1">
              {getTrendIcon()}
              <span className="text-xs text-gray-500 ml-1">Value Change</span>
            </div>
            <div className={`text-lg font-semibold ${getTrendColor()}`}>
              +${mockInvestmentData.valueChange} ({mockInvestmentData.valueChangePercent}%)
            </div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Market Analysis</span>
            <Badge variant={mockInvestmentData.marketTrend === "up" ? "default" : "secondary"} className="text-xs">
              {mockInvestmentData.marketTrend === "up" ? "Bullish" : "Stable"}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Based on recent auction results and market trends, this wine shows strong investment potential.
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            Next review: {mockInvestmentData.nextReviewDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}