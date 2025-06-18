import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Loader2 } from "lucide-react";

interface Wine {
  name: string;
  type: string;
  region: string;
  vintage?: string;
  description: string;
  priceRange: string;
  abv: string;
  rating: string;
  matchReason?: string;
}

interface WineCardProps {
  wine: Wine;
  onSave?: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  showSaveButton?: boolean;
  showRemoveButton?: boolean;
  source?: string;
  createdAt?: string;
}

export default function WineCard({
  wine,
  onSave,
  onRemove,
  isLoading = false,
  showSaveButton = false,
  showRemoveButton = false,
  source,
  createdAt,
}: WineCardProps) {
  // Default wine image - using a premium wine bottle from Unsplash
  const defaultImageUrl = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";

  const getSourceBadge = () => {
    if (!source) return null;
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${
          source === 'recommendation' 
            ? 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' 
            : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
        }`}
      >
        {source === 'recommendation' ? 'Recommended' : 'Uploaded'}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <img 
          src={defaultImageUrl}
          alt={`${wine.name} wine bottle`}
          className="w-full h-48 object-cover rounded-xl mb-4" 
        />
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs font-medium text-wine dark:text-red-400 bg-red-50 dark:bg-red-900/20">
              {wine.type}
            </Badge>
            {getSourceBadge()}
          </div>
          
          <h3 className="font-poppins font-semibold text-lg text-slate dark:text-white mb-1 line-clamp-2">
            {wine.name}
          </h3>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {wine.region}{wine.vintage && `, ${wine.vintage}`}
          </p>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
            {wine.description}
          </p>
          
          {wine.matchReason && (
            <p className="text-xs text-grape dark:text-purple-400 mb-3 italic">
              "{wine.matchReason}"
            </p>
          )}
          
          <div className="flex items-center space-x-2 text-sm mb-2">
            <span className="font-medium text-slate dark:text-white">{wine.priceRange}</span>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span className="text-gray-700 dark:text-gray-300">{wine.abv}</span>
          </div>
          
          {createdAt && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Saved {formatDate(createdAt)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{wine.rating}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showSaveButton && (
              <Button 
                onClick={onSave}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-grape hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                <span>Save</span>
              </Button>
            )}
            
            {showRemoveButton && (
              <Button 
                onClick={onRemove}
                disabled={isLoading}
                variant="ghost"
                size="sm"
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
