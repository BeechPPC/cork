import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PremiumBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PremiumBadge({ size = "md", className = "" }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  return (
    <Badge className={`bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border-yellow-500 ${sizeClasses[size]} ${className}`}>
      <Crown className={`${iconSizes[size]} mr-1`} />
      Premium
    </Badge>
  );
}