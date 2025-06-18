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

export default function CellarAnalytics({ isPremium, onUpgrade, savedWines = [], uploadedWines = [] }: CellarAnalyticsProps) {
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

  const allWines = [...savedWines, ...uploadedWines];
  
  // Calculate real analytics from actual wine data
  const calculateRealAnalytics = () => {
    const totalWines = allWines.length;
    
    if (totalWines === 0) {
      return {
        totalValue: 0,
        averageValue: 0,
        readyToDrink: 0,
        cellaring: 0,
        peakWindow: 0,
        regions: [],
        totalBottles: 0
      };
    }
    
    // Extract and count regions
    const regionCounts: { [key: string]: number } = {};
    allWines.forEach(wine => {
      const region = wine.region || 'Unknown Region';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    
    const regions = Object.entries(regionCounts)
      .map(([region, count]) => ({
        region,
        count,
        percentage: Math.round((count / totalWines) * 100)
      }))
      .sort((a, b) => b.count - a.count);
    
    // Calculate estimated values from price ranges
    const extractPrice = (priceRange: string): number => {
      if (!priceRange) return 35;
      const matches = priceRange.match(/\$(\d+)(?:-\$?(\d+))?/);
      if (matches) {
        const min = parseInt(matches[1]);
        const max = matches[2] ? parseInt(matches[2]) : min;
        return (min + max) / 2;
      }
      return 35;
    };
    
    const wineValues = allWines.map(wine => 
      extractPrice(wine.priceRange || wine.estimatedValue || '$30-40')
    );
    
    const totalValue = wineValues.reduce((sum, value) => sum + value, 0);
    const averageValue = totalValue / totalWines;
    
    const totalBottles = totalWines;
    
    // Estimate drinking windows based on wine types and vintages
    const currentYear = new Date().getFullYear();
    let readyCount = 0;
    let cellaringCount = 0;
    let peakCount = 0;
    
    allWines.forEach(wine => {
      const vintage = wine.vintage ? parseInt(wine.vintage) : currentYear - 2;
      const age = currentYear - vintage;
      const type = wine.wineType?.toLowerCase() || wine.type?.toLowerCase() || '';
      
      // Simple heuristic based on wine type and age
      if (type.includes('white') || type.includes('rosé') || age >= 5) {
        readyCount++;
      } else if (age < 3) {
        cellaringCount++;
      } else {
        peakCount++;
      }
    });
    
    return {
      totalValue: Math.round(totalValue),
      averageValue: Math.round(averageValue),
      readyToDrink: readyCount,
      cellaring: cellaringCount,
      peakWindow: peakCount,
      regions,
      totalBottles
    };
  };

  const analytics = calculateRealAnalytics();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Collection Value</p>
                <p className="text-2xl font-bold text-blue-800">${analytics.totalValue.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Avg: ${analytics.averageValue}/bottle</p>
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
                <p className="text-xs text-green-600">Of {allWines.length} total</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Collection Size</p>
                <p className="text-sm font-semibold text-purple-800">{allWines.length} wines</p>
                <p className="text-xs text-purple-600">Total bottles</p>
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
            {analytics.regions.length > 0 ? analytics.regions.map((region, index) => (
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
                  <span className="text-xs text-gray-500">{region.percentage}%</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No wines in collection yet</p>
            )}
          </CardContent>
        </Card>

        {/* Drinking Windows */}
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Drinking Windows</CardTitle>
              <PremiumBadge size="sm" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Ready Now</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {analytics.readyToDrink} wines
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">Cellaring (2-5 years)</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {analytics.cellaring} wines
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">Peak Window</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {analytics.peakWindow} wines
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}