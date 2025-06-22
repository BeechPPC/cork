import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, AlertTriangle, Clock, Car, Users, Phone, Shield, Activity } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ResponsibleDrinking() {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Health & Safety
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Responsible Drinking
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Wine is meant to be enjoyed responsibly. Learn about safe drinking practices, Australian guidelines, 
            and how to appreciate wine as part of a healthy lifestyle.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Australian Drinking Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-grape" />
                <span>Australian Alcohol Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The National Health and Medical Research Council (NHMRC) provides evidence-based guidelines 
                for safe alcohol consumption in Australia:
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Recommended Limits</h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>• <strong>Healthy adults:</strong> No more than 10 standard drinks per week</li>
                  <li>• <strong>Daily maximum:</strong> No more than 4 standard drinks on any day</li>
                  <li>• <strong>Alcohol-free days:</strong> At least 2 days per week without alcohol</li>
                  <li>• <strong>Pregnancy:</strong> No safe level - avoid alcohol completely</li>
                  <li>• <strong>Under 18:</strong> Alcohol is not recommended for anyone under 18</li>
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-grape mb-2">What is a Standard Drink?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  A standard drink contains 10 grams of pure alcohol. For wine:
                </p>
                <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1 ml-4">
                  <li>• 100ml of wine (13.5% alcohol) = 1 standard drink</li>
                  <li>• 150ml glass of wine (12% alcohol) = 1.4 standard drinks</li>
                  <li>• 750ml bottle of wine (13.5% alcohol) = 7.5 standard drinks</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Health Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-grape" />
                <span>Health & Wellbeing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-grape mb-2">Potential Benefits</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    Moderate wine consumption may offer some benefits when part of a balanced lifestyle:
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Social enjoyment and cultural appreciation</li>
                    <li>• Antioxidants (particularly in red wine)</li>
                    <li>• Relaxation and stress relief in moderation</li>
                    <li>• Enhanced dining experiences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-grape mb-2">Health Risks</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    Excessive alcohol consumption can lead to serious health problems:
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Liver disease and cardiovascular problems</li>
                    <li>• Increased cancer risk</li>
                    <li>• Mental health issues</li>
                    <li>• Dependency and addiction</li>
                    <li>• Impaired judgement and accidents</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety First */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="w-5 h-5" />
                <span>Critical Safety Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Never Drink and Drive
                  </h4>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    There is no safe level of alcohol when driving. Even small amounts can impair your ability 
                    to drive safely. Always plan alternative transport.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Pregnancy & Breastfeeding</h4>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    No amount of alcohol is safe during pregnancy or breastfeeding. Alcohol can cause 
                    serious harm to developing babies.
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Medication Interactions</h4>
                <p className="text-red-800 dark:text-red-200 text-sm">
                  Alcohol can interact dangerously with many medications. Always consult your doctor 
                  or pharmacist about alcohol consumption when taking medication.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Responsible Wine Enjoyment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-grape" />
                <span>Enjoying Wine Responsibly</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Wine appreciation is about quality, not quantity. Here's how to enjoy wine responsibly:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-grape mb-2">Before Drinking</h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Eat a proper meal before drinking</li>
                    <li>• Plan your transport home</li>
                    <li>• Set limits for yourself</li>
                    <li>• Choose quality over quantity</li>
                    <li>• Drink plenty of water</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">While Drinking</h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Sip slowly and savour the wine</li>
                    <li>• Alternate with water or non-alcoholic drinks</li>
                    <li>• Don't drink on an empty stomach</li>
                    <li>• Know your limits and stick to them</li>
                    <li>• Avoid drinking games or pressure</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recognising Problems */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-grape" />
                <span>Recognising Alcohol Problems</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                It's important to recognise when alcohol consumption becomes problematic:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-grape mb-2">Warning Signs</h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Drinking more than intended regularly</li>
                    <li>• Feeling unable to control drinking</li>
                    <li>• Drinking to cope with stress or emotions</li>
                    <li>• Neglecting responsibilities due to drinking</li>
                    <li>• Relationship problems caused by drinking</li>
                    <li>• Drinking despite health problems</li>
                    <li>• Needing more alcohol to feel the same effects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">When to Seek Help</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    If you're concerned about your drinking or someone else's, it's important to seek help early. 
                    Many effective treatments and support services are available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-grape" />
                <span>Special Considerations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-grape mb-2">Age-Related Factors</h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• <strong>Young adults (18-25):</strong> Higher risk of binge drinking</li>
                    <li>• <strong>Older adults (65+):</strong> Increased sensitivity to alcohol</li>
                    <li>• <strong>Medication interactions:</strong> More common with age</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Health Conditions</h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• <strong>Liver disease:</strong> Avoid alcohol completely</li>
                    <li>• <strong>Heart conditions:</strong> Consult your doctor</li>
                    <li>• <strong>Mental health:</strong> Alcohol can worsen symptoms</li>
                    <li>• <strong>Diabetes:</strong> Monitor blood sugar carefully</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cork's Commitment */}
          <Card>
            <CardHeader>
              <CardTitle>cork's Commitment to Responsible Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                As a wine recommendation platform, cork is committed to promoting responsible alcohol consumption:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Quality Focus:</strong> We emphasise wine appreciation and quality over quantity</li>
                <li>• <strong>Educational Content:</strong> Providing information about responsible drinking practices</li>
                <li>• <strong>Age Verification:</strong> Ensuring all users are 18+ before accessing our services</li>
                <li>• <strong>Moderation Messaging:</strong> Promoting wine as part of a balanced lifestyle</li>
                <li>• <strong>No Excessive Consumption:</strong> Our recommendations focus on enjoyment, not intoxication</li>
                <li>• <strong>Support Resources:</strong> Connecting users with help when needed</li>
              </ul>
            </CardContent>
          </Card>

          {/* Support & Resources */}
          <Card className="bg-grape/5 dark:bg-grape/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-grape" />
                <span>Support & Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you need support with alcohol-related concerns, help is available:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-grape mb-2">National Support Services</h4>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p><strong>National Alcohol and Other Drug Hotline:</strong> 1800 250 015 (24/7)</p>
                    <p><strong>Lifeline Crisis Support:</strong> 13 11 14 (24/7)</p>
                    <p><strong>Beyond Blue:</strong> 1300 22 4636</p>
                    <p><strong>Alcoholics Anonymous Australia:</strong> aa.org.au</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Online Resources</h4>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p><strong>DrinkWise Australia:</strong> drinkwise.org.au</p>
                    <p><strong>Hello Sunday Morning:</strong> hellosundaymorning.org</p>
                    <p><strong>Your Room (NSW):</strong> yourroom.health.nsw.gov.au</p>
                    <p><strong>Australian Guidelines:</strong> nhmrc.gov.au/health-advice/alcohol</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Professional Help</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Speak to your GP, contact a local community health centre, or call the services above 
                    for confidential advice and support. Early intervention is most effective.
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remember: Seeking help is a sign of strength, not weakness. Support is available, 
                and recovery is possible with the right help and commitment.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>
      
      <Footer />
    </div>
  );
}