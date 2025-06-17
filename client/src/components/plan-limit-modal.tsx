import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Wine, Upload, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface PlanLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "save" | "upload";
  currentCount: number;
  maxCount: number;
}

export default function PlanLimitModal({
  open,
  onOpenChange,
  type,
  currentCount,
  maxCount,
}: PlanLimitModalProps) {
  const handleUpgrade = () => {
    onOpenChange(false);
    window.location.href = '/pricing';
  };

  const handleMaybeLater = () => {
    onOpenChange(false);
  };

  const getIcon = () => {
    return type === "save" ? <Wine className="w-8 h-8 text-wine" /> : <Upload className="w-8 h-8 text-wine" />;
  };

  const getTitle = () => {
    return type === "save" ? "Cellar Limit Reached" : "Upload Limit Reached";
  };

  const getDescription = () => {
    if (type === "save") {
      return `You've saved ${currentCount}/${maxCount} wines on your Free plan. Upgrade to Premium for unlimited saves and exclusive features.`;
    }
    return `You've analyzed ${currentCount}/${maxCount} wines this month on your Free plan. Upgrade to Premium for unlimited wine uploads and analysis.`;
  };

  const getPremiumFeatures = () => {
    if (type === "save") {
      return [
        "Unlimited wine saves in your cellar",
        "Advanced cellar management tools",
        "Enhanced AI recommendations",
        "Priority support"
      ];
    }
    return [
      "Unlimited wine uploads & analysis",
      "Advanced AI wine recognition",
      "Detailed aging potential insights",
      "Priority support"
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 bg-wine bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            {getIcon()}
          </div>
          <DialogTitle className="text-xl font-poppins font-bold text-slate text-center">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Premium Features Preview */}
        <div className="my-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-5 h-5 text-grape" />
            <span className="font-semibold text-grape">Premium Features</span>
          </div>
          <ul className="space-y-2">
            {getPremiumFeatures().map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-grape rounded-full flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Preview */}
        <div className="bg-gradient-to-r from-grape to-purple-900 text-white p-4 rounded-lg mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Premium Plan</span>
            </div>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-2xl font-bold">$19</span>
              <span className="text-purple-200">/month</span>
            </div>
            <p className="text-xs text-purple-200 mt-1">7-day free trial • Cancel anytime</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleUpgrade}
            className="flex-1 bg-grape text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
          <Button 
            onClick={handleMaybeLater}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </Button>
        </div>

        {/* Current Usage Display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current usage:</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {currentCount}/{maxCount} {type === "save" ? "wines saved" : "wines analyzed"}
            </Badge>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min((currentCount / maxCount) * 100, 100)}%` }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
