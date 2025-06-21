import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Database, Lock, UserCheck, AlertTriangle, Mail, Phone } from "lucide-react";
import Header from "@/components/header";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Privacy & Security
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information 
            in accordance with Australian privacy laws and regulations.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Last updated: 21 June 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Age Verification Notice */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="w-5 h-5" />
                <span>Age Verification Required</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 dark:text-amber-200">
                cork is an alcohol-related service. By using our platform, you confirm that you are at least 18 years of age. 
                We are required under Australian law to verify age for alcohol-related content and services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-grape" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-grape mb-2">Personal Information</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 ml-4">
                  <li>• Name and email address (when you create an account)</li>
                  <li>• Age verification data (required for alcohol-related services)</li>
                  <li>• Wine preferences and taste profile</li>
                  <li>• Location (for region-specific recommendations)</li>
                  <li>• Payment information (processed securely through Stripe)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Usage Information</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 ml-4">
                  <li>• Wine searches and recommendations requested</li>
                  <li>• Images uploaded for wine analysis</li>
                  <li>• Saved wines and cellar information</li>
                  <li>• App usage patterns and features accessed</li>
                  <li>• Device information and IP address</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-grape" />
                <span>How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Personalised Recommendations:</strong> Provide tailored wine suggestions based on your preferences</li>
                <li>• <strong>Service Delivery:</strong> Process wine image analysis and meal pairing requests</li>
                <li>• <strong>Account Management:</strong> Maintain your profile, subscription, and saved wines</li>
                <li>• <strong>Age Verification:</strong> Ensure compliance with Australian alcohol regulations</li>
                <li>• <strong>Communication:</strong> Send service updates, newsletters, and support responses</li>
                <li>• <strong>Improvement:</strong> Analyse usage patterns to enhance our recommendations and features</li>
                <li>• <strong>Legal Compliance:</strong> Meet obligations under Australian privacy and alcohol laws</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-grape" />
                <span>Data Security & Protection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                <li>• <strong>Secure Hosting:</strong> Data stored on secure, Australian-based servers</li>
                <li>• <strong>Payment Security:</strong> PCI-compliant payment processing through Stripe</li>
                <li>• <strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
                <li>• <strong>Regular Audits:</strong> Security reviews and vulnerability assessments</li>
              </ul>
            </CardContent>
          </Card>

          {/* Australian Privacy Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-grape" />
                <span>Australian Privacy Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                cork complies with the Australian Privacy Principles (APPs) under the Privacy Act 1988:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-grape mb-2">Your Rights</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Access your personal information</li>
                    <li>• Request corrections to your data</li>
                    <li>• Request deletion of your account</li>
                    <li>• Opt-out of marketing communications</li>
                    <li>• Complain about privacy breaches</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-grape mb-2">Data Retention</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Account data: Until account deletion</li>
                    <li>• Wine recommendations: 2 years</li>
                    <li>• Payment records: 7 years (tax law)</li>
                    <li>• Age verification: 3 years</li>
                    <li>• Marketing data: Until opt-out</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-grape" />
                <span>Third-Party Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We work with trusted third-party services to provide our platform:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-grape">OpenAI</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Powers our AI wine recommendations and image analysis. Data is processed according to OpenAI's privacy policy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape">Stripe</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Handles payment processing for premium subscriptions. PCI-compliant and secure.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape">Replit</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Provides authentication services and platform hosting.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-grape">SendGrid</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Delivers transactional emails and newsletters with your consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies & Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Essential Cookies:</strong> Required for basic functionality and security</li>
                <li>• <strong>Preference Cookies:</strong> Remember your settings and wine preferences</li>
                <li>• <strong>Analytics Cookies:</strong> Help us understand how you use the platform</li>
                <li>• <strong>Marketing Cookies:</strong> Personalise content and recommendations</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                You can manage cookie preferences in your browser settings.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                cork is not intended for individuals under 18 years of age. We do not knowingly collect 
                personal information from children under 18. If we become aware that we have collected 
                personal information from a child under 18, we will take steps to delete such information 
                immediately. As an alcohol-related service, age verification is mandatory under Australian law.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or applicable laws. We will notify you of any material changes by email or through the 
                platform. Your continued use of cork after such notification constitutes acceptance of 
                the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-grape/5 dark:bg-grape/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-grape" />
                <span>Contact Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Email:</strong> privacy@cork.wine</p>
                <p><strong>Privacy Officer:</strong> Available through our contact form</p>
                <p><strong>Postal Address:</strong> Available upon request</p>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you're not satisfied with our response, you can lodge a complaint with the 
                Office of the Australian Information Commissioner (OAIC) at oaic.gov.au
              </p>
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
}