import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Utensils } from "lucide-react";
import PremiumBadge from "./premium-badge";

interface PairingSuggestion {
  category: string;
  dishes: string[];
  servingTemp: string;
  glassType: string;
  decantTime?: string;
}

interface WinePairingSuggestionsProps {
  wineName: string;
  wineType: string;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export default function WinePairingSuggestions({ 
  wineName, 
  wineType, 
  isPremium, 
  onUpgrade 
}: WinePairingSuggestionsProps) {
  const mockPairings: PairingSuggestion[] = [
    {
      category: "Main Courses",
      dishes: ["Grilled lamb with rosemary", "Beef wellington", "Duck confit"],
      servingTemp: "16-18°C",
      glassType: "Bordeaux glass",
      decantTime: "30-45 minutes"
    },
    {
      category: "Cheese",
      dishes: ["Aged cheddar", "Blue cheese", "Camembert"],
      servingTemp: "16-18°C", 
      glassType: "Bordeaux glass"
    },
    {
      category: "Desserts",
      dishes: ["Dark chocolate tart", "Berry compote", "Aged cheese board"],
      servingTemp: "16-18°C",
      glassType: "Bordeaux glass"
    }
  ];

  if (!isPremium) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Premium Food Pairing Suggestions
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get expert recommendations for food pairings, serving temperatures, and optimal glassware
            </p>
          </div>
          <PremiumBadge size="lg" className="mb-4" />
          <button 
            onClick={onUpgrade}
            className="text-grape hover:text-purple-800 font-medium text-sm underline"
          >
            Upgrade to unlock pairing suggestions
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800">Food Pairing Suggestions</CardTitle>
          <PremiumBadge size="sm" />
        </div>
        <p className="text-sm text-gray-600">Expert recommendations for {wineName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockPairings.map((pairing, index) => (
          <div key={index} className="border-l-4 border-yellow-400 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Utensils className="w-4 h-4 mr-2 text-yellow-600" />
              {pairing.category}
            </h4>
            <div className="flex flex-wrap gap-1 mb-2">
              {pairing.dishes.map((dish, dishIndex) => (
                <Badge key={dishIndex} variant="outline" className="text-xs border-yellow-300 text-yellow-800">
                  {dish}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Serve at {pairing.servingTemp} in {pairing.glassType}
              </div>
              {pairing.decantTime && (
                <div className="text-amber-700">
                  Decant for {pairing.decantTime} before serving
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}