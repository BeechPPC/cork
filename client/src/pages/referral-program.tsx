import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Gift, Users, Star, Crown, Share2, Trophy, Calendar, Sparkles } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ReferralProgram() {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Share the Love
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Referral Program
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Share cork with friends and family who love wine. Earn premium rewards for every successful 
            referral while helping others discover their perfect wine matches.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300">Three simple steps to start earning rewards</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-grape/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-grape" />
                </div>
                <CardTitle className="text-grape">1. Share Your Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Get your unique referral link from your account dashboard and share it with wine-loving friends and family.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-grape/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-grape" />
                </div>
                <CardTitle className="text-grape">2. Friend Signs Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Your friend creates an account using your link and gets an extended 14-day free premium trial.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-grape/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-grape" />
                </div>
                <CardTitle className="text-grape">3. You Both Win</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  When they subscribe to premium, you both receive amazing rewards. It's a win-win for wine lovers!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-16 bg-gradient-to-br from-slate/5 to-gray-50 dark:from-gray-800/50 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate dark:text-white mb-4">Referral Rewards</h2>
            <p className="text-gray-600 dark:text-gray-300">Generous rewards for both you and your friends</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* For You */}
            <Card className="border-grape/20 bg-gradient-to-br from-grape/5 to-purple-50 dark:from-grape/10 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-grape">
                  <Trophy className="w-6 h-6" />
                  <span>Your Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-grape" />
                  <div>
                    <h4 className="font-semibold text-slate dark:text-white">1 Month Free Premium</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">For each successful referral</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Crown className="w-5 h-5 text-grape" />
                  <div>
                    <h4 className="font-semibold text-slate dark:text-white">Exclusive Recommendations</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Premium region wines and rare finds</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-grape" />
                  <div>
                    <h4 className="font-semibold text-slate dark:text-white">Early Access</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">New features and beta testing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Friends */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Users className="w-6 h-6" />
                  <span>Their Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-slate dark:text-white">Extended 14-Day Trial</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Double the standard trial period</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-slate dark:text-white">Welcome Wine Collection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Curated starter recommendations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Gift className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-slate dark:text-white">20% Off First Month</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">When they subscribe to premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bonus Tiers */}
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                <Trophy className="w-6 h-6" />
                <span>Bonus Tiers - The More You Share, The More You Earn!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">5 Referrals</div>
                  <h4 className="font-semibold text-slate dark:text-white mb-1">Wine Connoisseur</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">3 months premium + sommelier session</p>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">10 Referrals</div>
                  <h4 className="font-semibold text-slate dark:text-white mb-1">Wine Ambassador</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">6 months premium + exclusive tastings</p>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">20 Referrals</div>
                  <h4 className="font-semibold text-slate dark:text-white mb-1">Wine Legend</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">1 year premium + winery visits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Program Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-grape mb-2">Eligibility</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Must be an active cork user with verified account</li>
                  <li>• Referred friends must be new to cork (not existing users)</li>
                  <li>• Referred users must be 18+ and meet age verification requirements</li>
                  <li>• One referral reward per unique email address</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Reward Conditions</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Rewards credited when referred user subscribes to premium</li>
                  <li>• Free premium months applied to your next billing cycle</li>
                  <li>• Rewards are non-transferable and have no cash value</li>
                  <li>• Program benefits subject to change with 30 days notice</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Fair Use Policy</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• No spam or unsolicited sharing of referral links</li>
                  <li>• Fraudulent referrals will result in account suspension</li>
                  <li>• Self-referrals or fake accounts are prohibited</li>
                  <li>• cork reserves the right to investigate suspicious activity</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="bg-grape/5 dark:bg-grape/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-grape" />
                <span>Get Started Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ready to start earning rewards? Access your unique referral link and track your progress 
                from your account dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-grape hover:bg-grape/90 text-white">
                  Get My Referral Link
                </Button>
                <Button variant="outline" className="border-grape text-grape hover:bg-grape/10">
                  View My Referrals
                </Button>
              </div>
              <Separator className="my-6" />
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-grape mb-2">Best Places to Share</h4>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Wine-loving friends and family</li>
                    <li>• Social media (Facebook, Instagram)</li>
                    <li>• Wine clubs and tasting groups</li>
                    <li>• Food and wine forums</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Sharing Tips</h4>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Share your personal wine discoveries</li>
                    <li>• Explain how cork has helped you</li>
                    <li>• Mention the extended trial for friends</li>
                    <li>• Be genuine in your recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-grape mb-2">When do I receive my reward?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Rewards are credited within 24 hours after your referred friend subscribes to premium and 
                  their payment is successfully processed.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-grape mb-2">Is there a limit to referrals?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  No limit! You can refer as many friends as you like and earn rewards for each successful referral. 
                  Plus, bonus tiers offer even greater rewards for multiple referrals.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-grape mb-2">Can I refer someone who previously had an account?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Referrals must be completely new to cork. Users who previously had accounts (even if deleted) 
                  are not eligible for referral rewards.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-grape mb-2">What if my friend doesn't subscribe immediately?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  That's fine! As long as they signed up with your referral link, you'll receive the reward 
                  whenever they decide to upgrade to premium, even if it's months later.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
      
      <Footer />
    </div>
  );
}