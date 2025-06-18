import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, Target, TrendingUp } from "lucide-react";
import PremiumBadge from "./premium-badge";

interface CellarAnalyticsProps {
  isPremium: boolean;
  onUpgrade?: () => void;
  savedWines?: any[];
  uploadedWines?: any[];
}

export default function CellarAnalytics({ isPremium, onUpgrade }: CellarAnalyticsProps) {
  const mockAnalytics = {
    totalValue: "$2,450",
    averageValue: "$122",
    bestPerformer: "2018 Penfolds Grange",
    regionBreakdown: [
      { region: "Barossa Valley", count: 8, percentage: 40 },
      { region: "Hunter Valley", count: 6, percentage: 30 },
      { region: "Margaret River", count: 4, percentage: 20 },
      { region: "Others", count: 2, percentage: 10 }
    ],
    readyToDrink: 5,
    cellaring: 12,
    peakWindow: 3
  };

  if (!isPremium) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Cellar Analytics Dashboard
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get detailed insights into your wine collection with value tracking, regional analysis, and drinking windows
            </p>
          </div>
          <PremiumBadge size="lg" className="mb-4" />
          <button 
            onClick={onUpgrade}
            className="text-grape hover:text-purple-800 font-medium text-sm underline"
          >
            Upgrade to unlock cellar analytics
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Collection Value</p>
                <p className="text-2xl font-bold text-blue-800">{analytics.totalValue}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Ready to Drink</p>
                <p className="text-2xl font-bold text-green-800">{analytics.readyToDrink} wines</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Best Performer</p>
                <p className="text-sm font-semibold text-purple-800">{mockAnalytics.bestPerformer}</p>
              </div>
              <PieChart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Breakdown */}
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Regional Distribution</CardTitle>
              <PremiumBadge size="sm" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAnalytics.regionBreakdown.map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                    />
                    <span className="text-sm font-medium text-gray-700">{region.region}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {region.count} wines
                  </Badge>
                  <span className="text-sm text-gray-600">{region.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Drinking Windows */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Drinking Windows</CardTitle>
              <PremiumBadge size="sm" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-green-700">Ready Now</span>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {mockAnalytics.readyToDrink} wines
                </Badge>
              </div>
              <p className="text-xs text-gray-600">Optimal drinking window</p>
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">Cellaring</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {mockAnalytics.cellaring} wines
                </Badge>
              </div>
              <p className="text-xs text-gray-600">Still developing</p>
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-orange-700">Peak Window</span>
                <Badge className="bg-orange-100 text-orange-800 text-xs">
                  {mockAnalytics.peakWindow} wines
                </Badge>
              </div>
              <p className="text-xs text-gray-600">Approaching prime</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}