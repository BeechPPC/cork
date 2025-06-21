import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wine, MapPin, Star, Grape, Award, Clock, Thermometer } from "lucide-react";
import Header from "@/components/header";

interface WineRegion {
  id: string;
  name: string;
  description: string;
  climate: string;
  established: string;
  signatureVarieties: string[];
  characteristics: string[];
  famousWineries: Array<{
    name: string;
    specialty: string;
    established: string;
    description: string;
  }>;
  foodPairings: string[];
  priceRange: string;
  bestVintages: string[];
}

interface WineVariety {
  id: string;
  name: string;
  type: "red" | "white" | "sparkling";
  description: string;
  flavourProfile: string[];
  servingTemp: string;
  agingPotential: string;
  bestRegions: string[];
  foodPairings: string[];
  characteristics: string[];
}

const australianRegions: WineRegion[] = [
  {
    id: "barossa-valley",
    name: "Barossa Valley",
    description: "Australia's most famous wine region, renowned worldwide for exceptional Shiraz and rich, full-bodied reds. Located in South Australia, just northeast of Adelaide.",
    climate: "Mediterranean with warm, dry summers and mild winters",
    established: "1840s",
    signatureVarieties: ["Shiraz", "Grenache", "Cabernet Sauvignon", "Riesling"],
    characteristics: ["Rich, powerful reds", "Concentrated flavours", "Old vine heritage", "Full-bodied wines"],
    famousWineries: [
      {
        name: "Penfolds",
        specialty: "Grange Shiraz",
        established: "1844",
        description: "Home to Australia's most iconic wine, Grange, and pioneers of premium Australian winemaking."
      },
      {
        name: "Henschke",
        specialty: "Hill of Grace Shiraz",
        established: "1868",
        description: "Five generations of family winemaking, famous for single vineyard expressions and old vine Shiraz."
      },
      {
        name: "Wolf Blass",
        specialty: "Black Label Cabernet",
        established: "1966",
        description: "Innovative winemaking techniques producing approachable premium wines with international acclaim."
      },
      {
        name: "Seppeltsfield",
        specialty: "Fortified wines",
        established: "1851",
        description: "Historic estate famous for aged tawny ports and centennial collection dating back to 1878."
      }
    ],
    foodPairings: ["BBQ beef", "Lamb roasts", "Game meats", "Aged cheeses", "Dark chocolate"],
    priceRange: "$15-$800+",
    bestVintages: ["2010", "2012", "2016", "2018", "2020"]
  },
  {
    id: "hunter-valley",
    name: "Hunter Valley",
    description: "Australia's oldest wine region, famous for elegant Semillon and Shiraz. Located in New South Wales, just 2 hours north of Sydney.",
    climate: "Humid subtropical with warm summers and mild winters",
    established: "1820s",
    signatureVarieties: ["Semillon", "Shiraz", "Chardonnay", "Verdelho"],
    characteristics: ["Elegant, food-friendly wines", "Unique Hunter Valley Semillon", "Medium-bodied reds", "Cellar-worthy whites"],
    famousWineries: [
      {
        name: "Tyrrell's Wines",
        specialty: "Vat 1 Semillon",
        established: "1858",
        description: "Pioneer of Hunter Valley winemaking, famous for developing the region's signature Semillon style."
      },
      {
        name: "Brokenwood",
        specialty: "Graveyard Vineyard Shiraz",
        established: "1970",
        description: "Boutique winery producing exceptional single-vineyard Shiraz and elegant cricket-themed wines."
      },
      {
        name: "Lindemans",
        specialty: "Hunter River Semillon",
        established: "1843",
        description: "Historic family winery instrumental in establishing Hunter Valley's reputation for premium wines."
      },
      {
        name: "Lake's Folly",
        specialty: "Cabernet Sauvignon",
        established: "1963",
        description: "Pioneering boutique winery that helped establish the modern Hunter Valley wine renaissance."
      }
    ],
    foodPairings: ["Fresh seafood", "Grilled chicken", "Asian cuisine", "Soft cheeses", "Light pasta dishes"],
    priceRange: "$12-$200+",
    bestVintages: ["2011", "2014", "2016", "2019", "2021"]
  },
  {
    id: "margaret-river",
    name: "Margaret River",
    description: "Western Australia's premium wine region, renowned for elegant Cabernet Sauvignon and Chardonnay. Located between two oceans, creating a unique maritime climate.",
    climate: "Mediterranean maritime with consistent ocean breezes",
    established: "1960s",
    signatureVarieties: ["Cabernet Sauvignon", "Chardonnay", "Sauvignon Blanc", "Merlot"],
    characteristics: ["Elegant, refined wines", "Bordeaux-style blends", "Pristine fruit flavours", "Excellent aging potential"],
    famousWineries: [
      {
        name: "Cullen Wines",
        specialty: "Diana Madeline Cabernet Blend",
        established: "1971",
        description: "Biodynamic pioneers producing some of Australia's most respected Cabernet blends and Chardonnay."
      },
      {
        name: "Leeuwin Estate",
        specialty: "Art Series Chardonnay",
        established: "1974",
        description: "Iconic estate known for world-class Chardonnay and hosting major concerts among the vines."
      },
      {
        name: "Vasse Felix",
        specialty: "Tom Cullity Cabernet",
        established: "1967",
        description: "The region's founding winery, pioneering Margaret River's reputation for premium wine production."
      },
      {
        name: "Moss Wood",
        specialty: "Cabernet Sauvignon",
        established: "1969",
        description: "Boutique family winery producing consistently excellent Cabernet and pioneering Pinot Noir."
      }
    ],
    foodPairings: ["Fresh crayfish", "Roast lamb", "Soft cheeses", "Grilled fish", "Mediterranean cuisine"],
    priceRange: "$18-$300+",
    bestVintages: ["2012", "2015", "2017", "2019", "2021"]
  },
  {
    id: "yarra-valley",
    name: "Yarra Valley",
    description: "Victoria's premier cool-climate region, famous for elegant Pinot Noir and sparkling wines. Located just east of Melbourne with diverse microclimates.",
    climate: "Cool continental with significant diurnal temperature variation",
    established: "1830s (revived 1960s)",
    signatureVarieties: ["Pinot Noir", "Chardonnay", "Cabernet Sauvignon", "Sparkling wines"],
    characteristics: ["Cool-climate elegance", "Complex Pinot Noir", "Premium sparkling wines", "Food-friendly styles"],
    famousWineries: [
      {
        name: "Domaine Chandon",
        specialty: "Sparkling wines",
        established: "1986",
        description: "French Champagne house Moët & Chandon's Australian venture, producing world-class sparkling wines."
      },
      {
        name: "Coldstream Hills",
        specialty: "Pinot Noir",
        established: "1985",
        description: "Founded by wine writer James Halliday, specialising in elegant cool-climate Pinot Noir."
      },
      {
        name: "Yering Station",
        specialty: "Village wines",
        established: "1838 (replanted 1996)",
        description: "Historic estate combining heritage buildings with modern winemaking, known for accessible premium wines."
      },
      {
        name: "De Bortoli",
        specialty: "Noble One Botrytis Semillon",
        established: "1928 (Yarra since 1987)",
        description: "Family winery producing exceptional dessert wines and elegant table wines across multiple regions."
      }
    ],
    foodPairings: ["Duck", "Salmon", "Mushroom dishes", "Goat cheese", "Fine dining cuisine"],
    priceRange: "$16-$250+",
    bestVintages: ["2013", "2015", "2017", "2019", "2021"]
  },
  {
    id: "clare-valley",
    name: "Clare Valley",
    description: "South Australia's premier cool-climate region, world-renowned for exceptional Riesling with incredible aging potential and elegant Shiraz.",
    climate: "Continental with cool nights and warm days",
    established: "1840s",
    signatureVarieties: ["Riesling", "Shiraz", "Cabernet Sauvignon", "Grenache"],
    characteristics: ["World-class Riesling", "Mineral-driven wines", "Excellent aging potential", "Crisp, dry styles"],
    famousWineries: [
      {
        name: "Grosset",
        specialty: "Polish Hill Riesling",
        established: "1981",
        description: "Boutique producer crafting some of Australia's finest Rieslings with exceptional purity and aging potential."
      },
      {
        name: "Jim Barry Wines",
        specialty: "The Armagh Shiraz",
        established: "1959",
        description: "Family winery producing iconic single-vineyard Shiraz and exceptional Rieslings across multiple sites."
      },
      {
        name: "Kilikanoon",
        specialty: "Oracle Shiraz",
        established: "1997",
        description: "Modern winery focusing on small-batch, single-vineyard expressions of Clare Valley terroir."
      },
      {
        name: "Pewsey Vale",
        specialty: "Eden Valley Riesling",
        established: "1847",
        description: "Historic vineyard at high elevation producing ethereal, long-lived Rieslings with remarkable purity."
      }
    ],
    foodPairings: ["Asian cuisine", "Spicy foods", "Fresh seafood", "Pork", "Aromatic herbs"],
    priceRange: "$14-$150+",
    bestVintages: ["2012", "2014", "2017", "2019", "2021"]
  }
];

const wineVarieties: WineVariety[] = [
  {
    id: "shiraz",
    name: "Shiraz",
    type: "red",
    description: "Australia's signature red grape, producing rich, full-bodied wines with dark fruit flavours and spicy characteristics. Known as Syrah internationally.",
    flavourProfile: ["Blackberry", "Plum", "Black pepper", "Chocolate", "Vanilla", "Smoke"],
    servingTemp: "16-18°C",
    agingPotential: "5-20+ years",
    bestRegions: ["Barossa Valley", "Hunter Valley", "McLaren Vale", "Clare Valley"],
    foodPairings: ["BBQ meats", "Lamb", "Beef stews", "Aged cheeses", "Game"],
    characteristics: ["Full-bodied", "High tannins", "Rich texture", "Spicy finish"]
  },
  {
    id: "cabernet-sauvignon",
    name: "Cabernet Sauvignon",
    type: "red",
    description: "The king of red grapes, producing structured, age-worthy wines with cassis flavours and firm tannins. Excels in Australia's premium regions.",
    flavourProfile: ["Blackcurrant", "Cedar", "Tobacco", "Dark chocolate", "Mint", "Bell pepper"],
    servingTemp: "16-18°C",
    agingPotential: "10-25+ years",
    bestRegions: ["Margaret River", "Coonawarra", "Barossa Valley", "Yarra Valley"],
    foodPairings: ["Red meat", "Roast lamb", "Hard cheeses", "Dark chocolate"],
    characteristics: ["Full-bodied", "Firm tannins", "Complex structure", "Long aging potential"]
  },
  {
    id: "riesling",
    name: "Riesling",
    type: "white",
    description: "Australia produces some of the world's finest dry Rieslings, with incredible purity, minerality, and aging potential, particularly from cool-climate regions.",
    flavourProfile: ["Lime", "Green apple", "Stone fruits", "Floral notes", "Mineral", "Petrol (aged)"],
    servingTemp: "8-10°C",
    agingPotential: "5-15+ years",
    bestRegions: ["Clare Valley", "Eden Valley", "Tasmania", "Great Southern"],
    foodPairings: ["Asian cuisine", "Seafood", "Spicy foods", "Goat cheese"],
    characteristics: ["Crisp acidity", "Mineral-driven", "Dry style", "Exceptional aging"]
  },
  {
    id: "chardonnay",
    name: "Chardonnay",
    type: "white",
    description: "Australia's most planted white grape, producing styles from crisp, unoaked expressions to rich, barrel-fermented wines with exceptional complexity.",
    flavourProfile: ["Citrus", "Stone fruits", "Vanilla", "Butter", "Oak", "Tropical fruits"],
    servingTemp: "10-12°C",
    agingPotential: "2-8 years",
    bestRegions: ["Margaret River", "Yarra Valley", "Adelaide Hills", "Tasmania"],
    foodPairings: ["Seafood", "Poultry", "Cream sauces", "Soft cheeses"],
    characteristics: ["Medium to full-bodied", "Versatile styles", "Complex textures", "Food-friendly"]
  },
  {
    id: "pinot-noir",
    name: "Pinot Noir",
    type: "red",
    description: "The noble grape of Burgundy thrives in Australia's cool-climate regions, producing elegant, complex wines with bright acidity and silky textures.",
    flavourProfile: ["Cherry", "Strawberry", "Raspberry", "Earth", "Spice", "Rose petals"],
    servingTemp: "14-16°C",
    agingPotential: "3-10 years",
    bestRegions: ["Yarra Valley", "Mornington Peninsula", "Tasmania", "Adelaide Hills"],
    foodPairings: ["Duck", "Salmon", "Mushrooms", "Soft cheeses", "Asian cuisine"],
    characteristics: ["Light to medium-bodied", "Elegant tannins", "Complex aromatics", "Food versatile"]
  },
  {
    id: "semillon",
    name: "Semillon",
    type: "white",
    description: "A uniquely Australian style, particularly from Hunter Valley, producing wines that develop incredible complexity and honey notes with age.",
    flavourProfile: ["Lemon", "Grass", "Honey", "Toast", "Nuts", "Lanolin"],
    servingTemp: "8-10°C",
    agingPotential: "10-20+ years",
    bestRegions: ["Hunter Valley", "Barossa Valley", "Margaret River"],
    foodPairings: ["Seafood", "Asian cuisine", "Light poultry", "Soft cheeses"],
    characteristics: ["Medium-bodied", "Develops with age", "Unique character", "Food-friendly"]
  }
];

export default function WineEducation() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Wine Education
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Australian Wine Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover Australia's world-renowned wine regions, signature varieties, and legendary wineries. 
            Learn what makes Australian wine unique and how to choose the perfect bottle for any occasion.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="regions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="regions" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Wine Regions</span>
              </TabsTrigger>
              <TabsTrigger value="varieties" className="flex items-center space-x-2">
                <Grape className="w-4 h-4" />
                <span>Grape Varieties</span>
              </TabsTrigger>
              <TabsTrigger value="basics" className="flex items-center space-x-2">
                <Wine className="w-4 h-4" />
                <span>Wine Basics</span>
              </TabsTrigger>
            </TabsList>

            {/* Wine Regions Tab */}
            <TabsContent value="regions">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Region List */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-slate dark:text-white mb-6">Australian Wine Regions</h2>
                  <div className="space-y-3">
                    {australianRegions.map((region) => (
                      <Card
                        key={region.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedRegion === region.id ? "ring-2 ring-grape" : ""
                        }`}
                        onClick={() => setSelectedRegion(region.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-slate dark:text-white">{region.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Est. {region.established}</p>
                            </div>
                            <MapPin className="w-5 h-5 text-grape" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Region Details */}
                <div className="lg:col-span-2">
                  {selectedRegion ? (
                    <div>
                      {australianRegions
                        .filter(region => region.id === selectedRegion)
                        .map(region => (
                          <div key={region.id}>
                            <div className="mb-6">
                              <h2 className="text-3xl font-bold text-slate dark:text-white mb-4">{region.name}</h2>
                              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                {region.description}
                              </p>
                              
                              <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                      <Thermometer className="w-5 h-5 text-grape" />
                                      <span>Climate & Terroir</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{region.climate}</p>
                                    <div className="space-y-2">
                                      {region.characteristics.map((char, index) => (
                                        <Badge key={index} variant="outline" className="mr-2">
                                          {char}
                                        </Badge>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                      <Grape className="w-5 h-5 text-grape" />
                                      <span>Signature Varieties</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      {region.signatureVarieties.map((variety, index) => (
                                        <Badge key={index} className="bg-grape/10 text-grape mr-2">
                                          {variety}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="mt-4">
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>Price Range:</strong> {region.priceRange}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>Best Recent Vintages:</strong> {region.bestVintages.join(', ')}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>

                            {/* Famous Wineries */}
                            <Card className="mb-6">
                              <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                  <Award className="w-5 h-5 text-grape" />
                                  <span>Famous Wineries</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {region.famousWineries.map((winery, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-slate dark:text-white">{winery.name}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          Est. {winery.established}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-grape font-medium mb-2">{winery.specialty}</p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {winery.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Food Pairings */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Perfect Food Pairings</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {region.foodPairings.map((food, index) => (
                                    <Badge key={index} variant="outline">
                                      {food}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Select a Region
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Choose a wine region from the list to learn about its characteristics, signature varieties, and famous wineries.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Grape Varieties Tab */}
            <TabsContent value="varieties">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Variety List */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-slate dark:text-white mb-6">Grape Varieties</h2>
                  <div className="space-y-3">
                    {wineVarieties.map((variety) => (
                      <Card
                        key={variety.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedVariety === variety.id ? "ring-2 ring-grape" : ""
                        }`}
                        onClick={() => setSelectedVariety(variety.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-slate dark:text-white">{variety.name}</h3>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  variety.type === "red" ? "border-red-300 text-red-600" :
                                  variety.type === "white" ? "border-yellow-300 text-yellow-600" :
                                  "border-pink-300 text-pink-600"
                                }`}
                              >
                                {variety.type}
                              </Badge>
                            </div>
                            <Grape className="w-5 h-5 text-grape" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Variety Details */}
                <div className="lg:col-span-2">
                  {selectedVariety ? (
                    <div>
                      {wineVarieties
                        .filter(variety => variety.id === selectedVariety)
                        .map(variety => (
                          <div key={variety.id}>
                            <div className="mb-6">
                              <div className="flex items-center space-x-4 mb-4">
                                <h2 className="text-3xl font-bold text-slate dark:text-white">{variety.name}</h2>
                                <Badge
                                  className={`${
                                    variety.type === "red" ? "bg-red-100 text-red-800" :
                                    variety.type === "white" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-pink-100 text-pink-800"
                                  }`}
                                >
                                  {variety.type} wine
                                </Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                {variety.description}
                              </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Flavour Profile</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {variety.flavourProfile.map((flavour, index) => (
                                      <Badge key={index} variant="outline">
                                        {flavour}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle>Wine Characteristics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Serving Temperature:</strong> {variety.servingTemp}</p>
                                    <p><strong>Aging Potential:</strong> {variety.agingPotential}</p>
                                    <div className="mt-3">
                                      {variety.characteristics.map((char, index) => (
                                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                                          {char}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Best Australian Regions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    {variety.bestRegions.map((region, index) => (
                                      <Badge key={index} className="bg-grape/10 text-grape mr-2">
                                        {region}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle>Food Pairings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {variety.foodPairings.map((food, index) => (
                                      <Badge key={index} variant="outline">
                                        {food}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Grape className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Select a Grape Variety
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Choose a grape variety to learn about its characteristics, flavour profile, and best Australian regions.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Wine Basics Tab */}
            <TabsContent value="basics">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate dark:text-white mb-8 text-center">
                  Australian Wine Basics
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-grape" />
                        <span>How to Read Australian Wine Labels</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <p><strong>Region:</strong> Look for specific regions like "Barossa Valley" or broader areas like "South Australia"</p>
                        <p><strong>Vintage:</strong> The year the grapes were harvested - important for aging and quality</p>
                        <p><strong>Variety:</strong> The grape type(s) used - minimum 85% required to list a single variety</p>
                        <p><strong>Alcohol:</strong> Typically 12-15% for table wines, higher for fortified wines</p>
                        <p><strong>Producer:</strong> The winery name and often the specific vineyard or block</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-grape" />
                        <span>What Makes Australian Wine Special</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <p><strong>Climate Diversity:</strong> From cool Tasmania to warm Barossa, offering incredible variety</p>
                        <p><strong>Old Vines:</strong> Some of the world's oldest Shiraz vines, producing concentrated flavours</p>
                        <p><strong>Innovation:</strong> Leading wine technology and sustainable practices</p>
                        <p><strong>Value:</strong> Exceptional quality at accessible prices across all categories</p>
                        <p><strong>Food Culture:</strong> Wines designed to complement Australia's diverse cuisine</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Australian Wine Classification System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-grape mb-2">Geographic Indications (GI)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Australia uses a Geographic Indications system to classify wine regions:
                        </p>
                        <div className="space-y-2 text-sm">
                          <p><strong>Zone:</strong> Large geographical areas (e.g., "South Australia")</p>
                          <p><strong>Region:</strong> Smaller areas with distinctive characteristics (e.g., "Barossa Valley")</p>
                          <p><strong>Sub-region:</strong> Specific areas within regions (e.g., "Eden Valley")</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tips for Choosing Australian Wine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-grape mb-3">For Beginners</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li>• Start with approachable varieties like Shiraz or Chardonnay</li>
                          <li>• Look for wines from well-known regions like Barossa or Hunter Valley</li>
                          <li>• Consider mid-range prices ($20-40) for good quality</li>
                          <li>• Ask for food pairing suggestions at wine shops</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-grape mb-3">For Enthusiasts</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li>• Explore single-vineyard expressions from premium producers</li>
                          <li>• Try cool-climate Pinot Noir from Yarra Valley or Tasmania</li>
                          <li>• Seek out old vine Shiraz and Grenache</li>
                          <li>• Consider aged wines, especially Hunter Valley Semillon</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}