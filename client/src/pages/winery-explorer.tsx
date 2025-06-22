import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Phone, Mail, Globe, Calendar, Clock, Wine, Star } from "lucide-react";
import Header from "@/components/header";
import { apiRequest } from "@/lib/queryClient";

interface WineryInfo {
  wineryName: string;
  address: string;
  region: string;
  websiteUrl: string;
  description: string;
  establishedYear: string;
  contactPhone: string;
  contactEmail: string;
  specialtyWines: string[];
  cellarDoorHours: string;
  tastingFees: string;
  bookingRequired: boolean;
}

export default function WineryExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: wineries, isLoading, error } = useQuery({
    queryKey: ['/api/search-wineries', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return { wineries: [] };
      const response = await apiRequest("POST", "/api/search-wineries", { query: searchTerm });
      return response.json();
    },
    enabled: !!searchTerm
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery.trim());
    }
  };

  const WineryCard = ({ winery }: { winery: WineryInfo }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-grape">{winery.wineryName}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{winery.region}</span>
              {winery.establishedYear !== "Unknown" && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Est. {winery.establishedYear}</span>
                </>
              )}
            </div>
          </div>
          {winery.bookingRequired && (
            <Badge variant="outline" className="text-grape border-grape">
              Booking Required
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {winery.description}
        </p>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-grape" />
            <span className="text-gray-600 dark:text-gray-300">{winery.address}</span>
          </div>
          
          {winery.contactPhone !== "Not available" && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-grape" />
              <span className="text-gray-600 dark:text-gray-300">{winery.contactPhone}</span>
            </div>
          )}
          
          {winery.contactEmail !== "Not available" && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-grape" />
              <span className="text-gray-600 dark:text-gray-300">{winery.contactEmail}</span>
            </div>
          )}
          
          {winery.websiteUrl !== "Not available" && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="w-4 h-4 text-grape" />
              <a 
                href={winery.websiteUrl.startsWith('http') ? winery.websiteUrl : `https://${winery.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grape hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {/* Cellar Door Information */}
        <div className="bg-grape/5 dark:bg-grape/10 p-3 rounded-lg space-y-2">
          <h4 className="font-semibold text-grape flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Cellar Door</span>
          </h4>
          <div className="text-sm space-y-1">
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Hours:</strong> {winery.cellarDoorHours}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Tasting Fees:</strong> {winery.tastingFees}
            </p>
          </div>
        </div>

        {/* Specialty Wines */}
        {winery.specialtyWines.length > 0 && (
          <div>
            <h4 className="font-semibold text-grape mb-2 flex items-center space-x-2">
              <Wine className="w-4 h-4" />
              <span>Specialty Wines</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {winery.specialtyWines.map((wine, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {wine}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Discover Wineries
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Winery Explorer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover Australian wineries by name, region, or wine type. Find contact details, 
            cellar door information, and specialty wines from across Australia's renowned wine regions.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex space-x-4">
              <Input
                type="text"
                placeholder="Search by winery name, region, or wine type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg py-3"
              />
              <Button 
                type="submit" 
                className="bg-grape hover:bg-grape/90 text-white px-8"
                disabled={isLoading}
              >
                <Search className="w-5 h-5 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchTerm && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate dark:text-white mb-2">
                Search Results for "{searchTerm}"
              </h2>
              {wineries?.wineries && (
                <p className="text-gray-600 dark:text-gray-300">
                  Found {wineries.wineries.length} winer{wineries.wineries.length === 1 ? 'y' : 'ies'}
                </p>
              )}
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 dark:text-red-400">
                  Something went wrong while searching. Please try again.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {wineries?.wineries && wineries.wineries.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wineries.wineries.map((winery: WineryInfo, index: number) => (
                <WineryCard key={index} winery={winery} />
              ))}
            </div>
          )}

          {wineries?.wineries && wineries.wineries.length === 0 && searchTerm && !isLoading && (
            <Card className="border-gray-200 bg-gray-50 dark:bg-gray-800/50">
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No wineries found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try searching with different terms like region names (e.g., "Barossa Valley") 
                  or wine types (e.g., "Shiraz").
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchQuery(""); setSearchTerm(""); }}
                  className="border-grape text-grape hover:bg-grape/10"
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}

          {!searchTerm && (
            <Card className="border-grape/20 bg-gradient-to-br from-grape/5 to-purple-50 dark:from-grape/10 dark:to-purple-900/20">
              <CardContent className="p-12 text-center">
                <Wine className="w-16 h-16 text-grape mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate dark:text-white mb-4">
                  Explore Australian Wineries
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Search for wineries across Australia's premier wine regions. Find contact information, 
                  cellar door details, and discover their specialty wines.
                </p>
                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchQuery("Barossa Valley"); setSearchTerm("Barossa Valley"); }}
                    className="border-grape text-grape hover:bg-grape/10"
                  >
                    Barossa Valley
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchQuery("Hunter Valley"); setSearchTerm("Hunter Valley"); }}
                    className="border-grape text-grape hover:bg-grape/10"
                  >
                    Hunter Valley
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchQuery("Yarra Valley"); setSearchTerm("Yarra Valley"); }}
                    className="border-grape text-grape hover:bg-grape/10"
                  >
                    Yarra Valley
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}