import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Wine } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Link } from "wouter";

export default function Pricing() {
  const { user } = useAuth();
  const isPremium = user?.subscriptionPlan === 'premium';

  const handleUpgrade = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you're ready for unlimited wine discoveries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white border border-gray-200 relative">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-poppins font-bold text-slate mb-2">Free</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-poppins font-bold text-slate">$0</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600 mt-2">Perfect for wine curious beginners</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">AI wine recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Save up to <strong>3 wines</strong> in cellar</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Upload & analyze <strong>3 wines</strong></span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Basic support</span>
                  </li>
                </ul>

                <Button 
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  disabled={!isPremium}
                >
                  {!isPremium ? 'Current Plan' : 'Downgrade to Free'}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-gradient-to-br from-purple-700 via-grape to-purple-900 text-white relative transform scale-105 shadow-xl border-0">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-purple-900 px-4 py-2 text-sm font-bold shadow-lg">
                  MOST POPULAR
                </Badge>
              </div>
              
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-2xl font-poppins font-bold text-white">Premium</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-poppins font-bold text-white">$4.99</span>
                    <span className="text-white ml-2 font-medium">/month</span>
                  </div>
                  <div className="text-sm text-white mt-1 font-medium">
                    or $49.99/year (save 17%)
                  </div>
                  <p className="text-white mt-2 font-medium">For serious wine enthusiasts</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium">Everything in Free, plus:</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium"><strong>Unlimited</strong> wine saves in cellar</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium"><strong>Unlimited</strong> wine uploads & analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium">Food pairing recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium">AI meal & menu photo analysis</span>
                  </li>

                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium">Advanced cellar analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium">Voice-to-text wine search</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span className="text-white font-medium">All future features</span>
                  </li>
                </ul>

                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-wine text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition-all transform hover:scale-105 shadow-lg"
                  disabled={isPremium}
                >
                  {isPremium ? 'Current Plan' : 'Upgrade to Premium'}
                </Button>
                
                <p className="text-center text-purple-200 text-sm mt-4">Cancel anytime • 7-day free trial</p>
              </CardContent>
            </Card>
          </div>

          {/* Features Comparison */}
          <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-poppins font-bold text-slate mb-6 text-center">Compare Plans</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-slate font-semibold">Feature</th>
                    <th className="text-center py-3 text-slate font-semibold">Free</th>
                    <th className="text-center py-3 text-slate font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">Wine recommendations</td>
                    <td className="py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">Saved wines in cellar</td>
                    <td className="py-4 text-center text-gray-600">3</td>
                    <td className="py-4 text-center text-grape font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">Wine uploads & analysis</td>
                    <td className="py-4 text-center text-gray-600">3/month</td>
                    <td className="py-4 text-center text-grape font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">Food pairing suggestions</td>
                    <td className="py-4 text-center">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">AI meal & menu photo analysis</td>
                    <td className="py-4 text-center">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">Cellar analytics dashboard</td>
                    <td className="py-4 text-center">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">Priority support</td>
                    <td className="py-4 text-center">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-700">New features</td>
                    <td className="py-4 text-center">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-poppins font-bold text-slate mb-6">Frequently Asked Questions</h3>
            <div className="text-left max-w-3xl mx-auto space-y-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-slate mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access to Premium features until the end of your billing period.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-slate mb-2">Is there a free trial?</h4>
                <p className="text-gray-600 text-sm">Yes, Premium comes with a 7-day free trial so you can explore all features risk-free.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-slate mb-2">What happens to my data if I downgrade?</h4>
                <p className="text-gray-600 text-sm">Your saved wines and uploaded analyses are preserved, but you'll be limited to the Free plan restrictions for new activities.</p>
              </div>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-12 text-center">
            <Link href="/dashboard">
              <Button variant="outline" className="border-grape text-grape hover:bg-grape hover:text-white">
                <Wine className="w-4 h-4 mr-2" />
                Back to Wine Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
