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

interface RegionsByState {
  state: string;
  regions: WineRegion[];
}

const australianRegionsByState: RegionsByState[] = [
  {
    state: "South Australia",
    regions: [
      {
        id: "barossa-valley",
        name: "Barossa Valley",
        description: "Australia's most famous wine region, renowned worldwide for exceptional Shiraz and rich, full-bodied reds. Home to some of the world's oldest Shiraz vines.",
        climate: "Mediterranean with warm, dry summers and mild winters",
        established: "1840s",
        signatureVarieties: ["Shiraz", "Grenache", "Cabernet Sauvignon", "Riesling"],
        characteristics: ["Rich, powerful reds", "Old vine heritage", "Full-bodied wines", "Premium fortified wines"],
        famousWineries: [
          { name: "Penfolds", specialty: "Grange Shiraz", established: "1844", description: "Home to Australia's most iconic wine, Grange, and pioneers of premium Australian winemaking." },
          { name: "Henschke", specialty: "Hill of Grace Shiraz", established: "1868", description: "Five generations of family winemaking, famous for single vineyard expressions and old vine Shiraz." },
          { name: "Wolf Blass", specialty: "Black Label Cabernet", established: "1966", description: "Innovative winemaking techniques producing approachable premium wines." },
          { name: "Seppeltsfield", specialty: "Fortified wines", established: "1851", description: "Historic estate famous for aged tawny ports and centennial collection." }
        ],
        foodPairings: ["BBQ beef", "Lamb roasts", "Game meats", "Aged cheeses", "Dark chocolate"],
        priceRange: "$15-$800+",
        bestVintages: ["2010", "2012", "2016", "2018", "2020"]
      },
      {
        id: "mclaren-vale",
        name: "McLaren Vale",
        description: "Known for powerful Shiraz and innovative winemaking, McLaren Vale combines Mediterranean climate with diverse soils to create bold, expressive wines.",
        climate: "Mediterranean with sea breezes from Gulf St Vincent",
        established: "1838",
        signatureVarieties: ["Shiraz", "Grenache", "Cabernet Sauvignon", "Chardonnay"],
        characteristics: ["Bold, fruit-driven wines", "Sustainable practices", "Innovative winemaking", "Food-friendly styles"],
        famousWineries: [
          { name: "d'Arenberg", specialty: "The Dead Arm Shiraz", established: "1912", description: "Fourth-generation family winery known for quirky labels and exceptional quality." },
          { name: "Clarendon Hills", specialty: "Astralis Shiraz", established: "1990", description: "Small-batch producer focusing on single-vineyard expressions." },
          { name: "Hardys", specialty: "Eileen Hardy Shiraz", established: "1853", description: "Historic winery producing premium wines across multiple price points." }
        ],
        foodPairings: ["Grilled meats", "Mediterranean cuisine", "Pasta with red sauce", "Mature cheeses"],
        priceRange: "$12-$200+",
        bestVintages: ["2010", "2014", "2016", "2018", "2020"]
      },
      {
        id: "clare-valley",
        name: "Clare Valley",
        description: "World-renowned for exceptional Riesling with incredible aging potential and elegant Shiraz. Australia's premier cool-climate region in South Australia.",
        climate: "Continental with cool nights and warm days",
        established: "1840s",
        signatureVarieties: ["Riesling", "Shiraz", "Cabernet Sauvignon", "Grenache"],
        characteristics: ["World-class Riesling", "Mineral-driven wines", "Excellent aging potential", "Crisp, dry styles"],
        famousWineries: [
          { name: "Grosset", specialty: "Polish Hill Riesling", established: "1981", description: "Boutique producer crafting some of Australia's finest Rieslings." },
          { name: "Jim Barry Wines", specialty: "The Armagh Shiraz", established: "1959", description: "Family winery producing iconic single-vineyard Shiraz and exceptional Rieslings." },
          { name: "Kilikanoon", specialty: "Oracle Shiraz", established: "1997", description: "Modern winery focusing on small-batch, single-vineyard expressions." }
        ],
        foodPairings: ["Asian cuisine", "Spicy foods", "Fresh seafood", "Pork", "Aromatic herbs"],
        priceRange: "$14-$150+",
        bestVintages: ["2012", "2014", "2017", "2019", "2021"]
      },
      {
        id: "adelaide-hills",
        name: "Adelaide Hills",
        description: "Cool-climate region known for elegant Chardonnay, Pinot Noir, and sparkling wines. The high altitude provides ideal conditions for premium cool-climate varieties.",
        climate: "Cool continental with significant elevation variation",
        established: "1970s",
        signatureVarieties: ["Chardonnay", "Pinot Noir", "Sauvignon Blanc", "Sparkling wines"],
        characteristics: ["Cool-climate elegance", "High-altitude vineyards", "Crisp acidity", "Premium sparkling wines"],
        famousWineries: [
          { name: "Shaw + Smith", specialty: "M3 Chardonnay", established: "1989", description: "Premium producer specialising in elegant cool-climate wines." },
          { name: "Henschke", specialty: "Green's Hill Riesling", established: "1868", description: "Historic family winery with cool-climate vineyards in the Hills." },
          { name: "Bird in Hand", specialty: "Nest Egg Chardonnay", established: "1997", description: "Modern winery focusing on single-vineyard expressions." }
        ],
        foodPairings: ["Fresh seafood", "Poultry", "Soft cheeses", "Light Asian dishes", "Salads"],
        priceRange: "$16-$120+",
        bestVintages: ["2013", "2015", "2017", "2019", "2021"]
      },
      {
        id: "coonawarra",
        name: "Coonawarra",
        description: "Famous for terra rossa soil and exceptional Cabernet Sauvignon. This narrow strip of red earth produces some of Australia's most elegant and age-worthy reds.",
        climate: "Cool maritime climate with limestone drainage",
        established: "1890s",
        signatureVarieties: ["Cabernet Sauvignon", "Shiraz", "Merlot", "Chardonnay"],
        characteristics: ["Terra rossa soil", "Elegant structure", "Excellent aging potential", "Classic Bordeaux style"],
        famousWineries: [
          { name: "Wynns Coonawarra Estate", specialty: "Black Label Cabernet", established: "1951", description: "Iconic producer showcasing the best of Coonawarra terroir." },
          { name: "Majella Wines", specialty: "The Malleea Cabernet", established: "1991", description: "Family winery producing concentrated, age-worthy Cabernet Sauvignon." },
          { name: "Penley Estate", specialty: "Phoenix Cabernet", established: "1988", description: "Small family winery focusing on premium Cabernet Sauvignon." }
        ],
        foodPairings: ["Red meat", "Roast lamb", "Game", "Hard cheeses", "Hearty stews"],
        priceRange: "$18-$200+",
        bestVintages: ["2010", "2012", "2016", "2018", "2020"]
      },
      {
        id: "eden-valley",
        name: "Eden Valley",
        description: "High-altitude cool-climate region renowned for exceptional Riesling and elegant Shiraz. The elevated vineyards produce wines with remarkable purity and aging potential.",
        climate: "Cool continental with high altitude influence",
        established: "1847",
        signatureVarieties: ["Riesling", "Shiraz", "Cabernet Sauvignon", "Chardonnay"],
        characteristics: ["High altitude", "Cool climate", "Exceptional Riesling", "Elegant structure"],
        famousWineries: [
          { name: "Henschke", specialty: "Hill of Grace Shiraz", established: "1868", description: "Legendary family winery with some of the world's oldest Shiraz vines." },
          { name: "Pewsey Vale", specialty: "The Contours Riesling", established: "1847", description: "Historic vineyard producing ethereal, long-lived Rieslings at high elevation." },
          { name: "Wolf Blass", specialty: "Gold Label Riesling", established: "1966", description: "Premium producer known for elegant cool-climate expressions." }
        ],
        foodPairings: ["Asian cuisine", "Shellfish", "White meats", "Spicy foods", "Fresh herbs"],
        priceRange: "$16-$300+",
        bestVintages: ["2012", "2014", "2017", "2019", "2021"]
      },
      {
        id: "langhorne-creek",
        name: "Langhorne Creek",
        description: "Unique flood-irrigated region producing rich, full-bodied reds. The alluvial soils and traditional flooding techniques create distinctive, fruit-driven wines.",
        climate: "Mediterranean with unique flood irrigation",
        established: "1850s",
        signatureVarieties: ["Cabernet Sauvignon", "Shiraz", "Merlot", "Malbec"],
        characteristics: ["Flood irrigation", "Rich, fruit-driven wines", "Alluvial soils", "Full-bodied reds"],
        famousWineries: [
          { name: "Bleasdale Vineyards", specialty: "Generations Shiraz", established: "1850", description: "Historic family winery pioneering the region's flood irrigation methods." },
          { name: "Wolf Blass", specialty: "Grey Label Langhorne Creek", established: "1966", description: "Premium producer showcasing the region's distinctive terroir." },
          { name: "Casa Freschi", specialty: "Shiraz", established: "1998", description: "Modern family winery focusing on sustainable viticulture." }
        ],
        foodPairings: ["Red meat", "Game", "Rich pasta", "BBQ", "Aged cheeses"],
        priceRange: "$14-$80+",
        bestVintages: ["2010", "2014", "2016", "2018", "2020"]
      },
      {
        id: "padthaway",
        name: "Padthaway",
        description: "Cool-climate region known for elegant whites and structured reds. The terra rossa over limestone soils produce wines with excellent minerality and aging potential.",
        climate: "Cool continental with limestone influence",
        established: "1960s",
        signatureVarieties: ["Chardonnay", "Sauvignon Blanc", "Shiraz", "Cabernet Sauvignon"],
        characteristics: ["Terra rossa over limestone", "Elegant whites", "Mineral complexity", "Cool climate"],
        famousWineries: [
          { name: "Henry's Drive Vignerons", specialty: "Dead Letter Office Shiraz", established: "1998", description: "Modern winery focusing on single-vineyard expressions." },
          { name: "Stonehaven Wines", specialty: "Chardonnay", established: "1989", description: "Boutique producer specialising in cool-climate varieties." },
          { name: "Browns of Padthaway", specialty: "Family Reserve Shiraz", established: "1994", description: "Family winery producing premium estate wines." }
        ],
        foodPairings: ["Seafood", "Poultry", "Soft cheeses", "Light meats", "Asian cuisine"],
        priceRange: "$15-$70+",
        bestVintages: ["2013", "2015", "2017", "2019", "2021"]
      },
      {
        id: "riverland",
        name: "Riverland",
        description: "Australia's largest wine region by volume, producing approachable, value-driven wines. The Murray River irrigation supports consistent production of fruit-driven styles.",
        climate: "Hot continental with river irrigation",
        established: "1887",
        signatureVarieties: ["Chardonnay", "Shiraz", "Cabernet Sauvignon", "Merlot"],
        characteristics: ["High volume production", "Value wines", "River irrigation", "Consistent quality"],
        famousWineries: [
          { name: "Banrock Station", specialty: "Environmental wines", established: "1994", description: "Pioneering winery combining wine production with environmental conservation." },
          { name: "Kingston Estate", specialty: "Murray Darling wines", established: "1979", description: "Family winery producing accessible, food-friendly wines." },
          { name: "Angove Family Winemakers", specialty: "Organic Range", established: "1886", description: "Historic family winery focusing on sustainable and organic viticulture." }
        ],
        foodPairings: ["Casual dining", "BBQ", "Pizza", "Light pasta", "Everyday meals"],
        priceRange: "$8-$40+",
        bestVintages: ["2016", "2018", "2019", "2020", "2021"]
      },
      {
        id: "southern-fleurieu",
        name: "Southern Fleurieu",
        description: "Cool maritime region influenced by the Southern Ocean. Known for elegant wines with natural acidity, particularly Sauvignon Blanc and Pinot Noir.",
        climate: "Cool maritime with Southern Ocean influence",
        established: "1970s",
        signatureVarieties: ["Sauvignon Blanc", "Pinot Noir", "Chardonnay", "Shiraz"],
        characteristics: ["Maritime climate", "Natural acidity", "Cool climate elegance", "Ocean influence"],
        famousWineries: [
          { name: "Alexandrina Wines", specialty: "Sauvignon Blanc", established: "1998", description: "Boutique winery specialising in cool-climate maritime wines." },
          { name: "Currency Creek Estate", specialty: "Pinot Noir", established: "1969", description: "Pioneer of the region focusing on cool-climate varieties." },
          { name: "Finniss River Vineyard", specialty: "Shiraz", established: "1997", description: "Family winery producing distinctive maritime-influenced wines." }
        ],
        foodPairings: ["Fresh seafood", "Oysters", "Light salads", "Goat cheese", "Coastal cuisine"],
        priceRange: "$16-$60+",
        bestVintages: ["2015", "2017", "2019", "2020", "2021"]
      },
      {
        id: "kangaroo-island",
        name: "Kangaroo Island",
        description: "Isolated island region with pristine environment producing unique wines. The maritime climate and diverse soils create distinctive, terroir-driven expressions.",
        climate: "Maritime with island isolation",
        established: "1970s",
        signatureVarieties: ["Shiraz", "Cabernet Sauvignon", "Sangiovese", "Viognier"],
        characteristics: ["Island terroir", "Pristine environment", "Maritime influence", "Unique expressions"],
        famousWineries: [
          { name: "Dudley Wines", specialty: "Dexter Shiraz", established: "1994", description: "Pioneering island winery showcasing unique Kangaroo Island terroir." },
          { name: "False Cape Wines", specialty: "Shiraz", established: "2000", description: "Boutique producer focusing on minimal intervention winemaking." },
          { name: "Islander Estate Vineyards", specialty: "Sangiovese", established: "1999", description: "Family winery exploring alternative varieties on the island." }
        ],
        foodPairings: ["Game meats", "Island seafood", "Native herbs", "Artisan cheeses", "Unique local produce"],
        priceRange: "$18-$90+",
        bestVintages: ["2014", "2016", "2018", "2020", "2021"]
      }
    ]
  },
  {
    state: "New South Wales",
    regions: [
      {
        id: "hunter-valley",
        name: "Hunter Valley",
        description: "Australia's oldest wine region, famous for elegant Semillon that develops incredible complexity with age, and distinctive earthy Shiraz.",
        climate: "Humid subtropical with warm summers and mild winters",
        established: "1820s",
        signatureVarieties: ["Semillon", "Shiraz", "Chardonnay", "Verdelho"],
        characteristics: ["Unique Hunter Semillon", "Elegant, food-friendly wines", "Medium-bodied reds", "Cellar-worthy whites"],
        famousWineries: [
          { name: "Tyrrell's Wines", specialty: "Vat 1 Semillon", established: "1858", description: "Pioneer of Hunter Valley winemaking, famous for developing the region's signature Semillon style." },
          { name: "Brokenwood", specialty: "Graveyard Vineyard Shiraz", established: "1970", description: "Boutique winery producing exceptional single-vineyard Shiraz." },
          { name: "Lindemans", specialty: "Hunter River Semillon", established: "1843", description: "Historic family winery instrumental in establishing Hunter Valley's reputation." },
          { name: "Mount Pleasant", specialty: "Elizabeth Semillon", established: "1921", description: "Historic producer known for long-lived Semillon and Shiraz." }
        ],
        foodPairings: ["Fresh seafood", "Grilled chicken", "Asian cuisine", "Soft cheeses", "Light pasta dishes"],
        priceRange: "$12-$200+",
        bestVintages: ["2011", "2014", "2016", "2019", "2021"]
      },
      {
        id: "mudgee",
        name: "Mudgee",
        description: "High-altitude region producing robust reds and crisp whites. Known for sustainable practices and family-owned wineries in a picturesque rural setting.",
        climate: "Continental with hot days and cool nights",
        established: "1858",
        signatureVarieties: ["Cabernet Sauvignon", "Shiraz", "Chardonnay", "Merlot"],
        characteristics: ["High-altitude viticulture", "Intense fruit flavours", "Good structure", "Value for money"],
        famousWineries: [
          { name: "Huntington Estate", specialty: "Special Reserve Cabernet", established: "1969", description: "Family-owned estate known for premium Cabernet Sauvignon." },
          { name: "Logan Wines", specialty: "Orange Vineyard wines", established: "1997", description: "Innovative producer working across multiple cool-climate regions." },
          { name: "Lowe Wines", specialty: "Organic wines", established: "1987", description: "Pioneering organic producer focusing on sustainable viticulture." }
        ],
        foodPairings: ["Beef", "Lamb", "Game meats", "Rich pasta", "Aged cheeses"],
        priceRange: "$15-$80+",
        bestVintages: ["2014", "2016", "2018", "2020", "2021"]
      },
      {
        id: "orange",
        name: "Orange",
        description: "Cool-climate region at high altitude, producing elegant wines with excellent natural acidity. Known for Chardonnay, Pinot Noir, and aromatic varieties.",
        climate: "Cool continental with high altitude influence",
        established: "1980s",
        signatureVarieties: ["Chardonnay", "Pinot Noir", "Sauvignon Blanc", "Cabernet Sauvignon"],
        characteristics: ["High altitude", "Cool climate elegance", "Natural acidity", "Emerging reputation"],
        famousWineries: [
          { name: "Bloodwood Estate", specialty: "Big Men in Tights Chardonnay", established: "1983", description: "Pioneer of Orange region, known for elegant cool-climate wines." },
          { name: "Philip Shaw Wines", specialty: "No. 8 Pinot Noir", established: "1989", description: "Premium producer focusing on single-vineyard expressions." },
          { name: "Borrodell Vineyard", specialty: "Pinot Noir", established: "1994", description: "Boutique family winery specialising in cool-climate varieties." }
        ],
        foodPairings: ["Seafood", "Poultry", "Pork", "Asian cuisine", "Fresh cheeses"],
        priceRange: "$18-$100+",
        bestVintages: ["2015", "2017", "2019", "2020", "2021"]
      },
      {
        id: "canberra-district",
        name: "Canberra District",
        description: "Cool-climate region surrounding Australia's capital, known for elegant Riesling, structured reds, and innovative winemaking. The high altitude and continental climate produce wines with excellent acidity.",
        climate: "Cool continental with high altitude",
        established: "1970s",
        signatureVarieties: ["Riesling", "Shiraz", "Cabernet Sauvignon", "Pinot Noir"],
        characteristics: ["High altitude", "Cool climate", "Government region", "Boutique producers"],
        famousWineries: [
          { name: "Clonakilla", specialty: "Shiraz Viognier", established: "1971", description: "Iconic producer pioneering Shiraz-Viognier blends in Australia." },
          { name: "Helm Wines", specialty: "Classic Riesling", established: "1973", description: "Specialist Riesling producer known for traditional German-style wines." },
          { name: "Lark Hill", specialty: "Pinot Noir", established: "1978", description: "Biodynamic pioneer focusing on cool-climate varieties." }
        ],
        foodPairings: ["Fine dining", "Game meats", "Asian cuisine", "Soft cheeses", "Seasonal produce"],
        priceRange: "$20-$120+",
        bestVintages: ["2014", "2016", "2018", "2020", "2021"]
      },
      {
        id: "riverina",
        name: "Riverina",
        description: "Warm inland region famous for dessert wines, particularly Botrytis Semillon, and high-quality bulk wine production. The irrigation and warm climate support consistent yields.",
        climate: "Hot continental with irrigation",
        established: "1913",
        signatureVarieties: ["Semillon", "Chardonnay", "Shiraz", "Botrytis wines"],
        characteristics: ["Dessert wine specialist", "Irrigation viticulture", "Consistent production", "Noble rot wines"],
        famousWineries: [
          { name: "De Bortoli", specialty: "Noble One Botrytis Semillon", established: "1928", description: "World-renowned producer of premium dessert wines, particularly Noble One." },
          { name: "McWilliam's Wines", specialty: "Hanwood Estate", established: "1877", description: "Historic family winery pioneering the region's development." },
          { name: "Casella Family Brands", specialty: "Yellow Tail", established: "1969", description: "Large-scale producer known for accessible, fruit-driven wines." }
        ],
        foodPairings: ["Desserts", "Blue cheese", "Foie gras", "Fruit tarts", "Rich chocolate"],
        priceRange: "$10-$150+",
        bestVintages: ["2011", "2014", "2016", "2018", "2020"]
      },
      {
        id: "hilltops",
        name: "Hilltops",
        description: "Cool-climate region at high elevation, producing elegant wines with natural acidity. Known for Shiraz, Cabernet Sauvignon, and emerging reputation for whites.",
        climate: "Cool continental with high elevation",
        established: "1860s (modern era 1980s)",
        signatureVarieties: ["Shiraz", "Cabernet Sauvignon", "Riesling", "Chardonnay"],
        characteristics: ["High elevation", "Cool climate", "Natural acidity", "Emerging region"],
        famousWineries: [
          { name: "Chalkers Crossing", specialty: "Shiraz", established: "1998", description: "Modern winery focusing on cool-climate expressions of classic varieties." },
          { name: "Freeman Vineyards", specialty: "Cabernet Sauvignon", established: "1988", description: "Family winery producing elegant, structured wines." },
          { name: "Grove Estate", specialty: "Riesling", established: "1989", description: "Boutique producer specialising in cool-climate whites and reds." }
        ],
        foodPairings: ["Red meat", "Game", "Rich pasta", "Aged cheeses", "Hearty stews"],
        priceRange: "$16-$80+",
        bestVintages: ["2015", "2017", "2019", "2020", "2021"]
      }
    ]
  },
  {
    state: "Victoria",
    regions: [
      {
        id: "yarra-valley",
        name: "Yarra Valley",
        description: "Victoria's premier cool-climate region, famous for elegant Pinot Noir and sparkling wines. Located just east of Melbourne with diverse microclimates.",
        climate: "Cool continental with significant diurnal temperature variation",
        established: "1830s (revived 1960s)",
        signatureVarieties: ["Pinot Noir", "Chardonnay", "Cabernet Sauvignon", "Sparkling wines"],
        characteristics: ["Cool-climate elegance", "Complex Pinot Noir", "Premium sparkling wines", "Food-friendly styles"],
        famousWineries: [
          { name: "Domaine Chandon", specialty: "Sparkling wines", established: "1986", description: "French Champagne house Moët & Chandon's Australian venture." },
          { name: "Coldstream Hills", specialty: "Pinot Noir", established: "1985", description: "Founded by wine writer James Halliday, specialising in elegant Pinot Noir." },
          { name: "Yering Station", specialty: "Village wines", established: "1838 (replanted 1996)", description: "Historic estate combining heritage buildings with modern winemaking." },
          { name: "Mount Mary", specialty: "Quintet Cabernet Blend", established: "1971", description: "Iconic family winery producing age-worthy Bordeaux-style blends." }
        ],
        foodPairings: ["Duck", "Salmon", "Mushroom dishes", "Goat cheese", "Fine dining cuisine"],
        priceRange: "$16-$250+",
        bestVintages: ["2013", "2015", "2017", "2019", "2021"]
      },
      {
        id: "mornington-peninsula",
        name: "Mornington Peninsula",
        description: "Cool maritime climate region specialising in Pinot Noir and Chardonnay. The sea breezes and rolling hills create ideal conditions for elegant wines.",
        climate: "Cool maritime with consistent sea breezes",
        established: "1970s",
        signatureVarieties: ["Pinot Noir", "Chardonnay", "Pinot Gris", "Shiraz"],
        characteristics: ["Maritime influence", "Elegant Pinot Noir", "Complex Chardonnay", "Boutique wineries"],
        famousWineries: [
          { name: "Kooyong", specialty: "Single vineyard Pinot Noir", established: "1996", description: "Premium producer focusing on single-vineyard expressions of Pinot Noir." },
          { name: "Ten Minutes by Tractor", specialty: "McCutcheon Pinot Noir", established: "1999", description: "Unique winery focusing on three distinct vineyard sites." },
          { name: "Paringa Estate", specialty: "The Paringa Single Vineyard Shiraz", established: "1985", description: "Family winery producing elegant cool-climate wines." }
        ],
        foodPairings: ["Seafood", "Duck", "Soft cheeses", "Mushrooms", "Light Asian dishes"],
        priceRange: "$20-$150+",
        bestVintages: ["2014", "2016", "2018", "2020", "2021"]
      },
      {
        id: "rutherglen",
        name: "Rutherglen",
        description: "World-famous for fortified wines, particularly Muscat and Tokay. This warm climate region produces Australia's most celebrated dessert wines.",
        climate: "Warm continental with hot summers",
        established: "1851",
        signatureVarieties: ["Muscat", "Tokay (Muscadelle)", "Shiraz", "Durif"],
        characteristics: ["World-class fortified wines", "Rich, sweet dessert wines", "Unique aging systems", "Historic wine region"],
        famousWineries: [
          { name: "Chambers Rosewood", specialty: "Rare Muscat", established: "1858", description: "Legendary producer of Australia's finest fortified wines." },
          { name: "Campbells Wines", specialty: "Merchant Prince Muscat", established: "1870", description: "Family winery specialising in premium fortified wines." },
          { name: "All Saints Estate", specialty: "Museum Muscat", established: "1864", description: "Historic estate with extensive cellars of aged fortified wines." }
        ],
        foodPairings: ["Desserts", "Blue cheese", "Chocolate", "Fruit tarts", "Nuts"],
        priceRange: "$25-$300+",
        bestVintages: ["Multi-vintage blends", "Aged reserves", "Museum releases"]
      },
      {
        id: "heathcote",
        name: "Heathcote",
        description: "Known for powerful Shiraz grown on distinctive red Cambrian soil. This region produces concentrated, age-worthy reds with unique mineral characteristics.",
        climate: "Continental with warm days and cool nights",
        established: "1970s",
        signatureVarieties: ["Shiraz", "Cabernet Sauvignon", "Tempranillo", "Viognier"],
        characteristics: ["Red Cambrian soil", "Powerful Shiraz", "Mineral complexity", "Age-worthy reds"],
        famousWineries: [
          { name: "Jasper Hill", specialty: "Emily's Paddock Shiraz", established: "1975", description: "Iconic producer of full-bodied, age-worthy Shiraz." },
          { name: "Heathcote Estate", specialty: "Shiraz", established: "1978", description: "Pioneer of the region focusing on estate-grown wines." },
          { name: "Wild Duck Creek", specialty: "Duck Muck Shiraz", established: "1980", description: "Boutique winery producing intense, concentrated reds." }
        ],
        foodPairings: ["Red meat", "Game", "Spicy cuisine", "Hard cheeses", "BBQ"],
        priceRange: "$18-$120+",
        bestVintages: ["2010", "2014", "2016", "2018", "2020"]
      },
      {
        id: "goulburn-valley",
        name: "Goulburn Valley",
        description: "Historic wine region known for rich, full-bodied reds and exceptional Marsanne. The warm climate and deep alluvial soils produce concentrated, flavourful wines.",
        climate: "Warm continental with hot summers",
        established: "1860s",
        signatureVarieties: ["Shiraz", "Cabernet Sauvignon", "Marsanne", "Viognier"],
        characteristics: ["Rich, full-bodied reds", "Historic region", "Exceptional Marsanne", "Warm climate wines"],
        famousWineries: [
          { name: "Tahbilk", specialty: "Marsanne", established: "1860", description: "Historic estate famous for world-class Marsanne and traditional winemaking methods." },
          { name: "Mitchelton", specialty: "Shiraz", established: "1969", description: "Modern winery combining innovation with respect for traditional varieties." },
          { name: "Monichino Wines", specialty: "Sangiovese", established: "1962", description: "Family winery specialising in Italian varieties and traditional methods." }
        ],
        foodPairings: ["Roast meats", "Rich pasta", "Game birds", "Aged cheeses", "Mediterranean cuisine"],
        priceRange: "$16-$100+",
        bestVintages: ["2010", "2013", "2016", "2018", "2020"]
      },
      {
        id: "pyrenees",
        name: "Pyrenees",
        description: "Elevated region producing elegant cool-climate wines with excellent structure. Known for Cabernet Sauvignon, Shiraz, and emerging reputation for sparkling wines.",
        climate: "Cool continental with high elevation",
        established: "1960s",
        signatureVarieties: ["Cabernet Sauvignon", "Shiraz", "Chardonnay", "Sparkling wines"],
        characteristics: ["High elevation", "Elegant structure", "Cool climate", "Emerging sparkling wines"],
        famousWineries: [
          { name: "Dalwhinnie", specialty: "Cabernet Sauvignon", established: "1976", description: "High-altitude producer known for elegant, structured wines." },
          { name: "Taltarni", specialty: "Sparkling wines", established: "1969", description: "Pioneer of the region, specialising in premium sparkling wines." },
          { name: "Blue Pyrenees Estate", specialty: "Shiraz", established: "1963", description: "Historic estate producing distinctive cool-climate reds." }
        ],
        foodPairings: ["Lamb", "Venison", "Mushroom dishes", "Soft cheeses", "Fine dining"],
        priceRange: "$18-$80+",
        bestVintages: ["2012", "2015", "2017", "2019", "2021"]
      },
      {
        id: "grampians",
        name: "Grampians",
        description: "Rugged region with distinctive pepperiness in its Shiraz, influenced by the ancient mountain ranges. Known for robust reds and crisp cool-climate whites.",
        climate: "Continental with altitude variation",
        established: "1860s",
        signatureVarieties: ["Shiraz", "Cabernet Sauvignon", "Riesling", "Chardonnay"],
        characteristics: ["Peppery Shiraz", "Mountain influence", "Robust reds", "Distinctive terroir"],
        famousWineries: [
          { name: "Mount Langi Ghiran", specialty: "Shiraz", established: "1969", description: "Renowned for distinctive peppery Shiraz from high-altitude vineyards." },
          { name: "Best's Great Western", specialty: "Thomson Family Shiraz", established: "1866", description: "Historic family winery with some of Australia's oldest vines." },
          { name: "Seppelt Great Western", specialty: "Sparkling wines", established: "1865", description: "Historic producer famous for traditional method sparkling wines." }
        ],
        foodPairings: ["Peppered steaks", "Game meats", "Spicy cuisine", "Hard cheeses", "BBQ"],
        priceRange: "$15-$120+",
        bestVintages: ["2010", "2014", "2016", "2018", "2020"]
      },
      {
        id: "alpine-valleys",
        name: "Alpine Valleys",
        description: "High-altitude region producing elegant wines with excellent natural acidity. The cool climate and granite soils create distinctive, mineral-driven wines.",
        climate: "Cool continental with high altitude",
        established: "1980s",
        signatureVarieties: ["Chardonnay", "Pinot Noir", "Riesling", "Sangiovese"],
        characteristics: ["High altitude", "Granite soils", "Natural acidity", "Emerging region"],
        famousWineries: [
          { name: "Boyntons of Bright", specialty: "Feathertop Chardonnay", established: "1987", description: "Family winery specialising in cool-climate varieties at high altitude." },
          { name: "Ringer Reef", specialty: "Pinot Noir", established: "1988", description: "Boutique producer focusing on elegant cool-climate wines." },
          { name: "Gapsted Wines", specialty: "Ballerina Canopy Riesling", established: "1997", description: "Modern winery known for innovative winemaking and distinctive labels." }
        ],
        foodPairings: ["Trout", "Poultry", "Alpine cheeses", "Light Asian dishes", "Fresh herbs"],
        priceRange: "$16-$70+",
        bestVintages: ["2015", "2017", "2019", "2020", "2021"]
      },
      {
        id: "bendigo",
        name: "Bendigo",
        description: "Historic gold rush region producing powerful reds on ancient quartz soils. Known for robust Shiraz and Cabernet Sauvignon with excellent aging potential.",
        climate: "Continental with warm days and cool nights",
        established: "1850s (modern era 1960s)",
        signatureVarieties: ["Shiraz", "Cabernet Sauvignon", "Merlot", "Chardonnay"],
        characteristics: ["Quartz soils", "Powerful reds", "Historic region", "Age-worthy wines"],
        famousWineries: [
          { name: "Balgownie Estate", specialty: "Estate Cabernet Sauvignon", established: "1969", description: "Pioneer of modern Bendigo winemaking, known for structured, age-worthy reds." },
          { name: "Passing Clouds", specialty: "Gravy Shiraz", established: "1974", description: "Boutique winery producing distinctive, terroir-driven wines." },
          { name: "Harcourt Valley Vineyards", specialty: "Le Pres Cabernet", established: "1975", description: "Family estate focusing on premium single-vineyard expressions." }
        ],
        foodPairings: ["Red meat", "Game", "Rich stews", "Aged cheeses", "Hearty cuisine"],
        priceRange: "$18-$100+",
        bestVintages: ["2010", "2014", "2016", "2018", "2020"]
      },
      {
        id: "king-valley",
        name: "King Valley",
        description: "Cool-climate region famous for Italian varieties, particularly Prosecco and Pinot Grigio. The Brown Brothers family has pioneered alternative varieties in this diverse region.",
        climate: "Cool continental with altitude variation",
        established: "1889",
        signatureVarieties: ["Prosecco", "Pinot Grigio", "Sangiovese", "Barbera"],
        characteristics: ["Italian varieties", "Cool climate", "Alternative varieties", "Family wineries"],
        famousWineries: [
          { name: "Brown Brothers", specialty: "Patricia Pinot Grigio", established: "1889", description: "Pioneer family winery famous for experimenting with alternative varieties." },
          { name: "Dal Zotto Wines", specialty: "Prosecco", established: "1987", description: "Italian family winery specialising in authentic Italian varieties and methods." },
          { name: "Pizzini Wines", specialty: "Sangiovese", established: "1978", description: "Family winery focusing on Italian varieties with traditional winemaking." }
        ],
        foodPairings: ["Italian cuisine", "Seafood", "Light pasta", "Fresh cheeses", "Antipasto"],
        priceRange: "$14-$80+",
        bestVintages: ["2015", "2017", "2019", "2020", "2021"]
      }
    ]
  },
  {
    state: "Western Australia",
    regions: [
      {
        id: "margaret-river",
        name: "Margaret River",
        description: "Premium wine region renowned for elegant Cabernet Sauvignon and Chardonnay. Located between two oceans, creating a unique maritime climate perfect for Bordeaux varieties.",
        climate: "Mediterranean maritime with consistent ocean breezes",
        established: "1960s",
        signatureVarieties: ["Cabernet Sauvignon", "Chardonnay", "Sauvignon Blanc", "Merlot"],
        characteristics: ["Elegant, refined wines", "Bordeaux-style blends", "Pristine fruit flavours", "Excellent aging potential"],
        famousWineries: [
          { name: "Cullen Wines", specialty: "Diana Madeline Cabernet Blend", established: "1971", description: "Biodynamic pioneers producing some of Australia's most respected Cabernet blends." },
          { name: "Leeuwin Estate", specialty: "Art Series Chardonnay", established: "1974", description: "Iconic estate known for world-class Chardonnay and hosting concerts." },
          { name: "Vasse Felix", specialty: "Tom Cullity Cabernet", established: "1967", description: "The region's founding winery, pioneering Margaret River's reputation." },
          { name: "Moss Wood", specialty: "Cabernet Sauvignon", established: "1969", description: "Boutique family winery producing consistently excellent Cabernet." }
        ],
        foodPairings: ["Fresh crayfish", "Roast lamb", "Soft cheeses", "Grilled fish", "Mediterranean cuisine"],
        priceRange: "$18-$300+",
        bestVintages: ["2012", "2015", "2017", "2019", "2021"]
      },
      {
        id: "great-southern",
        name: "Great Southern",
        description: "Western Australia's largest wine region, known for cool-climate varieties including exceptional Riesling and Pinot Noir. Diverse sub-regions with varying microclimates.",
        climate: "Cool to moderate with maritime influence",
        established: "1960s",
        signatureVarieties: ["Riesling", "Pinot Noir", "Chardonnay", "Cabernet Sauvignon"],
        characteristics: ["Cool-climate elegance", "Diverse sub-regions", "Excellent Riesling", "Emerging Pinot Noir"],
        famousWineries: [
          { name: "Howard Park", specialty: "Riesling", established: "1986", description: "Premium producer working across multiple Western Australian regions." },
          { name: "Plantagenet Wines", specialty: "Cabernet Sauvignon", established: "1974", description: "Pioneer of the Great Southern region, known for structured reds." },
          { name: "Forest Hill Vineyard", specialty: "Estate Block Riesling", established: "1965", description: "Historic estate specialising in cool-climate varieties." }
        ],
        foodPairings: ["Seafood", "Poultry", "Asian cuisine", "Fresh cheeses", "Light meats"],
        priceRange: "$16-$100+",
        bestVintages: ["2014", "2016", "2018", "2020", "2021"]
      }
    ]
  },
  {
    state: "Tasmania",
    regions: [
      {
        id: "tasmania",
        name: "Tasmania",
        description: "Australia's coolest wine region, producing exceptional sparkling wines, elegant Pinot Noir, and crisp Chardonnay. The pristine environment and cool climate create wines of remarkable finesse.",
        climate: "Cool maritime with consistent temperatures",
        established: "1950s (modern era 1970s)",
        signatureVarieties: ["Pinot Noir", "Chardonnay", "Sparkling wines", "Sauvignon Blanc"],
        characteristics: ["Cool climate", "Exceptional sparkling wines", "Elegant Pinot Noir", "Pristine environment"],
        famousWineries: [
          { name: "Tamar Ridge", specialty: "Kayena Pinot Noir", established: "1994", description: "Leading Tasmanian producer known for premium cool-climate wines." },
          { name: "Bay of Fires", specialty: "Eddystone Point Pinot Noir", established: "1999", description: "Premium winery focusing on single-vineyard expressions." },
          { name: "Josef Chromy", specialty: "Pepik Pinot Noir", established: "1994", description: "Boutique producer creating elegant wines in the Tamar Valley." },
          { name: "House of Arras", specialty: "Sparkling wines", established: "1988", description: "Specialist sparkling wine producer using traditional methods." }
        ],
        foodPairings: ["Fresh seafood", "Salmon", "Duck", "Soft cheeses", "Fine dining"],
        priceRange: "$20-$200+",
        bestVintages: ["2014", "2016", "2018", "2020", "2021"]
      }
    ]
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
                {/* Region List by State */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-slate dark:text-white mb-6">Australian Wine Regions</h2>
                  <div className="space-y-4">
                    {australianRegionsByState.map((stateGroup) => (
                      <div key={stateGroup.state}>
                        <h3 className="text-lg font-semibold text-grape mb-3">{stateGroup.state}</h3>
                        <div className="space-y-2 ml-2">
                          {stateGroup.regions.map((region) => (
                            <Card
                              key={region.id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedRegion === region.id ? "ring-2 ring-grape" : ""
                              }`}
                              onClick={() => setSelectedRegion(region.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium text-slate dark:text-white text-sm">{region.name}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Est. {region.established}</p>
                                  </div>
                                  <MapPin className="w-4 h-4 text-grape" />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Region Details */}
                <div className="lg:col-span-2">
                  {selectedRegion ? (
                    <div>
                      {australianRegionsByState
                        .flatMap(state => state.regions)
                        .filter(region => region.id === selectedRegion)
                        .map(region => (
                          <div key={region.id}>
                            <div className="mb-6">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-grape">
                                  {australianRegionsByState.find(state => 
                                    state.regions.some(r => r.id === region.id)
                                  )?.state}
                                </Badge>
                              </div>
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
                                        <Badge key={index} variant="outline" className="mr-2 mb-1">
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
                                    <div className="space-y-2 mb-4">
                                      {region.signatureVarieties.map((variety, index) => (
                                        <Badge key={index} className="bg-grape/10 text-grape mr-2 mb-1">
                                          {variety}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                      <p><strong>Price Range:</strong> {region.priceRange}</p>
                                      <p><strong>Best Recent Vintages:</strong> {region.bestVintages.join(', ')}</p>
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
                                  <span>Notable Wineries</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {region.famousWineries.map((winery, index) => (
                                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-slate dark:text-white">{winery.name}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          Est. {winery.established}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-grape font-medium mb-2">{winery.specialty}</p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
                                <CardTitle className="flex items-center space-x-2">
                                  <Wine className="w-5 h-5 text-grape" />
                                  <span>Perfect Food Pairings</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {region.foodPairings.map((food, index) => (
                                    <Badge key={index} variant="outline" className="hover:bg-grape/10 transition-colors">
                                      {food}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                  These pairings complement the typical wine styles from {region.name}, enhancing both the food and wine experience.
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Explore Australian Wine Regions
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Select a wine region from the list to discover its unique characteristics, signature grape varieties, notable wineries, and perfect food pairings.
                      </p>
                      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                        <p>Featuring regions from:</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          {australianRegionsByState.map((state) => (
                            <Badge key={state.state} variant="outline" className="text-xs">
                              {state.state}
                            </Badge>
                          ))}
                        </div>
                      </div>
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