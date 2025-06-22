import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserCheck, Shield, Scale, AlertTriangle, Heart, FileText, Users } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AgeVerification() {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Responsible Service
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Age Verification Information
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Understanding why cork requires age verification and how we promote responsible alcohol consumption 
            in accordance with Australian law and industry best practices.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Why We Verify Age */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-grape" />
                <span>Why We Require Age Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                cork is an alcohol-related service that provides wine recommendations, analysis, and educational content. 
                As such, we are required by Australian law to ensure that our users are of legal drinking age before 
                accessing our platform.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">Legal Requirement</h3>
                </div>
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  The legal drinking age in Australia is 18 years. Any platform providing alcohol-related content, 
                  recommendations, or services must verify that users meet this age requirement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-grape" />
                <span>Australian Legal Framework</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Age verification for alcohol-related services is governed by several Australian laws and regulations:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-grape mb-2">Liquor Control Acts</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Each Australian state and territory has liquor control legislation that prohibits the supply of 
                    alcohol or alcohol-related services to persons under 18 years of age.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-grape mb-2">Competition and Consumer Act 2010</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Requires businesses to ensure their services comply with consumer protection laws, 
                    including age-appropriate service delivery.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-grape mb-2">Online Safety Act 2021</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Establishes requirements for online platforms to protect minors from age-inappropriate content, 
                    including alcohol-related material.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-grape" />
                <span>Industry Best Practices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Beyond legal requirements, age verification aligns with industry standards for responsible service:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-grape mb-2">DrinkWise Australia</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Promotes responsible drinking culture and supports age verification for all alcohol-related platforms 
                    to prevent underage access.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Australian Wine Industry</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Wine Australia and industry bodies advocate for responsible marketing and age-appropriate 
                    access to wine information and services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Digital Platform Standards</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Leading alcohol-related platforms implement robust age verification to demonstrate 
                    commitment to responsible service and legal compliance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Consumer Protection</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Age verification protects minors from alcohol marketing and content that may 
                    influence underage drinking behaviours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Our Commitment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-grape" />
                <span>Our Commitment to Responsible Service</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                cork is committed to promoting responsible alcohol consumption and supporting Australian 
                drinking guidelines:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Age Verification:</strong> Ensuring all users are 18+ before accessing our services</li>
                <li>• <strong>Educational Content:</strong> Providing information about responsible drinking practices</li>
                <li>• <strong>Moderation Messaging:</strong> Promoting wine appreciation within healthy consumption limits</li>
                <li>• <strong>No Excessive Consumption:</strong> Our recommendations focus on quality and enjoyment, not quantity</li>
                <li>• <strong>Australian Guidelines:</strong> Aligning with National Health and Medical Research Council guidelines</li>
                <li>• <strong>Community Standards:</strong> Supporting DrinkWise and responsible drinking initiatives</li>
              </ul>
            </CardContent>
          </Card>

          {/* What We Verify */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-grape" />
                <span>What Age Verification Involves</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our age verification process is designed to be simple while ensuring compliance:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-grape mb-2">During Registration</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Users confirm their date of birth and certify they are 18 years or older. 
                    This information is stored securely and used only for age verification purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Ongoing Compliance</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Our platform includes age-appropriate content warnings and responsible drinking 
                    reminders throughout the user experience.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Privacy Protection</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Age verification data is handled in accordance with Australian privacy laws and 
                    our comprehensive privacy policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support for Responsible Drinking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-grape" />
                <span>Supporting Responsible Drinking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Age verification is just one part of our broader commitment to responsible alcohol service:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-grape mb-2">Educational Resources</h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Wine appreciation and tasting techniques</li>
                    <li>• Understanding alcohol content and serving sizes</li>
                    <li>• Food pairing for enhanced enjoyment</li>
                    <li>• Australian drinking guidelines</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Responsible Messaging</h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Quality over quantity philosophy</li>
                    <li>• Drink driving prevention reminders</li>
                    <li>• Moderation and health considerations</li>
                    <li>• Links to support resources when needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources & Support */}
          <Card className="bg-grape/5 dark:bg-grape/10">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For more information about responsible drinking and support resources:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>DrinkWise Australia:</strong> drinkwise.org.au</p>
                <p><strong>Australian Guidelines:</strong> nhmrc.gov.au/health-advice/alcohol</p>
                <p><strong>Alcohol Support:</strong> 1800 250 015 (National Alcohol and Other Drug Hotline)</p>
                <p><strong>Lifeline:</strong> 13 11 14 (24/7 crisis support)</p>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you have questions about our age verification process or responsible service policies, 
                please contact us through our support channels.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>
      
      <Footer />
    </div>
  );
}