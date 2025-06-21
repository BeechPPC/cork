import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, HelpCircle, Shield, CreditCard, User, Wine, Database } from "lucide-react";
import Header from "@/components/header";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ComponentType<any>;
}

const faqData: FAQItem[] = [
  // App Usage
  {
    id: "1",
    category: "App Usage",
    question: "How do I get wine recommendations from cork?",
    answer: "Simply describe what you're looking for in the search box on your dashboard. For example: 'I want a bold red wine under $30 for a BBQ' or 'light white wine for seafood'. Our AI will analyse your request and suggest Australian wines that match your preferences.",
    icon: Wine
  },
  {
    id: "2",
    category: "App Usage",
    question: "What's the difference between Free and Premium plans?",
    answer: "Free users can save up to 3 wines and upload 2 wine photos for analysis. Premium users get unlimited saves and uploads, plus exclusive features like AI meal photo analysis, voice-to-text search, advanced cellar analytics, and detailed food pairing suggestions.",
    icon: User
  },
  {
    id: "3",
    category: "App Usage",
    question: "How does the wine photo analysis work?",
    answer: "Upload a clear photo of your wine bottle or label, and our AI will identify the wine, estimate its current value, suggest optimal drinking windows, and provide detailed tasting notes. This feature uses advanced image recognition trained on thousands of wine labels.",
    icon: HelpCircle
  },
  {
    id: "4",
    category: "App Usage",
    question: "Can I use cork if I'm new to wine?",
    answer: "Absolutely! cork is designed for all experience levels. When you first sign up, we'll ask about your wine experience and preferences to personalise recommendations. Our AI explains wine terms in simple language and suggests approachable wines for beginners.",
    icon: Wine
  },
  {
    id: "5",
    category: "App Usage",
    question: "How accurate are the wine recommendations?",
    answer: "Our recommendations are powered by GPT-4 and trained on extensive wine data, focusing on Australian wines. We consider your preferences, occasion, budget, and food pairings. While taste is subjective, our users report high satisfaction with our suggestions.",
    icon: HelpCircle
  },

  // Data Usage & Privacy
  {
    id: "6",
    category: "Data & Privacy",
    question: "What personal information does cork collect?",
    answer: "We collect your email, age verification (18+), wine preferences, and search history to personalise recommendations. We also store wines you save and photos you upload for analysis. All data is encrypted and stored securely in Australia.",
    icon: Database
  },
  {
    id: "7",
    category: "Data & Privacy",
    question: "Do you share my data with third parties?",
    answer: "No, we never sell or share your personal data with third parties. We use Stripe for payment processing and OpenAI for AI features, but these services only receive the minimum data necessary to function and are bound by strict privacy agreements.",
    icon: Shield
  },
  {
    id: "8",
    category: "Data & Privacy",
    question: "Can I delete my account and data?",
    answer: "Yes, you can delete your account anytime from your profile settings. This will permanently remove all your personal data, saved wines, upload history, and preferences from our systems within 30 days.",
    icon: Database
  },
  {
    id: "9",
    category: "Data & Privacy",
    question: "How do you use my wine preferences?",
    answer: "Your preferences help us suggest wines you'll enjoy. We analyse your saved wines, search patterns, and stated preferences to improve recommendations over time. This data never leaves cork and is only used to enhance your experience.",
    icon: Wine
  },
  {
    id: "10",
    category: "Data & Privacy",
    question: "Is my payment information secure?",
    answer: "Yes, all payments are processed by Stripe, a leading payment processor used by companies like Uber and Shopify. cork never stores your credit card details. Stripe is PCI DSS compliant and uses bank-level security.",
    icon: Shield
  },

  // Subscription Management
  {
    id: "11",
    category: "Subscription",
    question: "How do I upgrade to Premium?",
    answer: "Click 'Upgrade to Premium' on your dashboard or visit the Pricing page. Choose between monthly ($4.99) or yearly ($49.99) plans. All new Premium subscriptions include a 7-day free trial. You can cancel anytime during the trial without charges.",
    icon: CreditCard
  },
  {
    id: "12",
    category: "Subscription",
    question: "How do I cancel or downgrade my subscription?",
    answer: "Go to your Account Settings and click 'Manage Subscription'. You can cancel immediately or at the end of your billing period. When you downgrade, you'll retain Premium features until your current period ends, then revert to Free plan limits.",
    icon: CreditCard
  },
  {
    id: "13",
    category: "Subscription",
    question: "What happens to my data if I downgrade?",
    answer: "Your saved wines and upload history remain intact when you downgrade. However, you'll only be able to access the most recent 3 saved wines and 2 uploads. Premium features like meal analysis and advanced analytics will be disabled.",
    icon: Database
  },
  {
    id: "14",
    category: "Subscription",
    question: "Can I get a refund?",
    answer: "We offer full refunds within 7 days of purchase if you're not satisfied. For subscription cancellations, we'll refund the unused portion on a case-by-case basis. Contact us at hello@cork.wine to discuss your specific situation.",
    icon: CreditCard
  },

  // Technical Support
  {
    id: "16",
    category: "Support",
    question: "I'm having trouble uploading wine photos. What should I do?",
    answer: "Ensure your photo is clear, well-lit, and shows the wine label prominently. Supported formats are JPG, PNG, and HEIC up to 10MB. If issues persist, try a different browser or device. Contact support if problems continue.",
    icon: HelpCircle
  },
  {
    id: "17",
    category: "Support",
    question: "Why can't I save more wines?",
    answer: "Free users can save up to 3 wines. If you've reached this limit, you'll need to remove existing saved wines or upgrade to Premium for unlimited saves. Premium users can save as many wines as they'd like.",
    icon: Wine
  },
  {
    id: "18",
    category: "Support",
    question: "How do I contact cork support?",
    answer: "Visit our Contact page or email hello@cork.wine. We respond to all enquiries within 24 hours during business days (Monday-Friday, Australian Eastern Time). For urgent payment issues, please mention 'urgent' in your subject line.",
    icon: HelpCircle
  }
];

const categories = ["All", "App Usage", "Data & Privacy", "Subscription", "Support"];

const categoryIcons: Record<string, React.ComponentType<any>> = {
  "App Usage": Wine,
  "Data & Privacy": Shield,
  "Subscription": CreditCard,
  "Support": HelpCircle
};

export default function HelpCentre() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Help Centre
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about using cork, managing your account, and getting the most from our wine recommendations.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg focus:ring-grape focus:border-grape"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category] || HelpCircle;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-grape text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {category !== "All" && <IconComponent className="w-4 h-4" />}
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or browse different categories.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => {
                const isExpanded = expandedItems.includes(faq.id);
                const IconComponent = faq.icon;
                
                return (
                  <Card key={faq.id} className="overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-grape/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-grape" />
                          </div>
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {faq.category}
                            </Badge>
                            <h3 className="text-lg font-semibold text-slate dark:text-white">
                              {faq.question}
                            </h3>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <CardContent className="px-6 pb-6 pt-0">
                        <div className="ml-14">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-poppins font-bold text-slate dark:text-white mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-grape text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Contact Support
            </a>
            <a
              href="mailto:hello@cork.wine"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}