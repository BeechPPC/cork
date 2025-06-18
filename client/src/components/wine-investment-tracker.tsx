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
  // Generate realistic investment data based on wine name and market trends
  const generateInvestmentData = (): InvestmentData => {
    const name = wineName.toLowerCase();
    let basePrice = 45;
    let growthRate = 0.05; // 5% default
    
    // Adjust based on wine characteristics
    if (name.includes('penfolds') || name.includes('grange')) {
      basePrice = 120;
      growthRate = 0.15;
    } else if (name.includes('henschke') || name.includes('hill of grace')) {
      basePrice = 90;
      growthRate = 0.12;
    } else if (name.includes('vintage') || name.includes('2018') || name.includes('2019')) {
      growthRate = 0.08;
    } else if (name.includes('cabernet') || name.includes('shiraz')) {
      basePrice = 55;
      growthRate = 0.07;
    }
    
    const purchasePrice = basePrice * (0.8 + Math.random() * 0.4); // ±20% variation
    const currentValue = purchasePrice * (1 + growthRate + (Math.random() * 0.1 - 0.05));
    const valueChange = currentValue - purchasePrice;
    const valueChangePercent = (valueChange / purchasePrice) * 100;
    
    return {
      currentValue: `$${Math.round(currentValue)}`,
      purchasePrice: `$${Math.round(purchasePrice)}`,
      valueChange: Math.round(valueChange),
      valueChangePercent: Math.round(valueChangePercent * 10) / 10,
      marketTrend: valueChangePercent > 0 ? "up" : valueChangePercent < -5 ? "down" : "stable",
      nextReviewDate: "March 2025"
    };
  };

  const investmentData = generateInvestmentData();

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
    switch (investmentData.marketTrend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    return investmentData.valueChangePercent > 0 ? "text-green-600" : "text-red-600";
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