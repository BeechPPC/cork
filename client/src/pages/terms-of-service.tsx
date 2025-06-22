import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Scale, AlertTriangle, CreditCard, Shield, Users, Mail, FileText } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Legal Terms
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using cork. By accessing or using our service, 
            you agree to be bound by these terms and conditions.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Last updated: 21 June 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Age Verification & Alcohol Warning */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="w-5 h-5" />
                <span>Important: Age Verification & Alcohol Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-red-800 dark:text-red-200">
                <strong>You must be 18 years or older to use cork.</strong> This service provides alcohol-related content and recommendations. 
                By using cork, you confirm that you meet the legal drinking age in Australia.
              </p>
              <p className="text-red-800 dark:text-red-200">
                <strong>Drink Responsibly:</strong> Cork promotes responsible alcohol consumption. Please drink in moderation and never drink and drive.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-grape" />
                <span>Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing and using cork ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                These Terms of Service govern your use of the cork wine recommendation platform, including all content, services, and products available through the platform.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                If you do not agree to abide by the above, please do not use this service. We reserve the right to update these terms at any time without prior notice.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                cork provides AI-powered wine recommendations and analysis services, including:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                <li>• Wine recommendation services based on user preferences</li>
                <li>• Wine bottle image analysis and identification</li>
                <li>• Meal and menu pairing suggestions</li>
                <li>• Digital wine cellar management</li>
                <li>• Educational content about Australian wines</li>
                <li>• Premium subscription features including unlimited access and advanced analytics</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Our service is designed for personal, non-commercial use by individuals of legal drinking age in Australia.
              </p>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-grape" />
                <span>Account Registration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• You must provide accurate and complete registration information</li>
                <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>• You must be at least 18 years old to create an account</li>
                <li>• One account per person; sharing accounts is prohibited</li>
                <li>• You are responsible for all activities that occur under your account</li>
                <li>• You must notify us immediately of any unauthorised use of your account</li>
                <li>• We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </CardContent>
          </Card>

          {/* Subscription Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-grape" />
                <span>Subscription & Payment Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-grape mb-2">Free Tier</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Free users receive limited access including 3 saved wines and 3 wine uploads per account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Premium Subscription</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Monthly plan: AUD $4.99 per month</li>
                  <li>• Annual plan: AUD $49.99 per year</li>
                  <li>• 7-day free trial for new premium subscribers</li>
                  <li>• Automatic renewal unless cancelled</li>
                  <li>• Unlimited wine saves, uploads, and premium features</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Payment Processing</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• All payments processed securely through Stripe</li>
                  <li>• Payments are non-refundable except as required by Australian Consumer Law</li>
                  <li>• Prices include GST where applicable</li>
                  <li>• Subscription fees are charged in advance</li>
                  <li>• Failed payments may result in service suspension</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Cancellation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period. 
                  No refunds are provided for partial billing periods except as required by law.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle>Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You agree not to:</p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Use the service for any unlawful purpose or in violation of any laws</li>
                <li>• Share your account credentials or allow unauthorised access</li>
                <li>• Upload inappropriate, offensive, or copyrighted content</li>
                <li>• Attempt to reverse engineer, hack, or compromise the service</li>
                <li>• Use automated systems or bots to access the service</li>
                <li>• Resell or redistribute our content or services</li>
                <li>• Promote excessive alcohol consumption or irresponsible drinking</li>
                <li>• Provide false age verification information</li>
                <li>• Interfere with other users' use of the service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Content & Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-grape" />
                <span>Content & Intellectual Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-grape mb-2">Our Content</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  All content provided by cork, including wine recommendations, educational materials, and analysis, 
                  is owned by cork and protected by intellectual property laws. You may not reproduce, distribute, 
                  or create derivative works without written permission.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">User Content</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  You retain ownership of wine images and content you upload. By uploading content, you grant cork 
                  a non-exclusive license to use, store, and process your content to provide our services. 
                  You represent that you have the right to upload and use any content you submit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Copyright Policy</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We respect intellectual property rights. If you believe your copyright has been infringed, 
                  please contact us with details of the alleged infringement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Data Collection & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By using cork, you acknowledge and agree to our data collection and processing practices:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• We collect personal information including name, email, age verification, and wine preferences</li>
                <li>• Wine images and searches are processed to provide recommendations and analysis</li>
                <li>• Payment information is securely processed through third-party providers</li>
                <li>• Usage data helps improve our services and personalise recommendations</li>
                <li>• We comply with Australian Privacy Principles under the Privacy Act 1988</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                For complete details on data collection, use, and your privacy rights, please review our 
                <a href="/privacy-policy" className="text-grape hover:underline ml-1">Privacy Policy</a>.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers & Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-grape" />
                <span>Disclaimers & Limitations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-grape mb-2">Service Availability</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We strive to maintain service availability but cannot guarantee uninterrupted access. 
                  We reserve the right to modify, suspend, or discontinue services with reasonable notice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Wine Recommendations & AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Our wine recommendations are for informational and entertainment purposes only. They are generated 
                  by artificial intelligence and based on algorithmic analysis of your preferences and wine data. 
                  Wine taste is highly subjective and personal. We make no warranties about the accuracy, completeness, 
                  or suitability of recommendations. We are not responsible for purchases, disappointment, or financial 
                  loss resulting from wines purchased based on our recommendations. Always consider your own preferences 
                  and budget when making wine purchases.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Wine Image Analysis & Valuation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Wine image analysis, identification, and valuation estimates are provided for entertainment, 
                  educational, and general informational purposes only. Our AI system may misidentify wines, 
                  incorrectly estimate vintages, or provide inaccurate valuations. Factors affecting wine value 
                  include storage conditions, provenance, market fluctuations, and authenticity - none of which 
                  can be determined from photographs alone. Never rely on our analysis for insurance, investment, 
                  or sales decisions. Always consult certified wine appraisers, sommeliers, or auction houses for 
                  professional wine valuation and authentication.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Alcohol Consumption & Health</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Cork promotes responsible alcohol consumption in accordance with Australian guidelines. 
                  We are not liable for any health issues, injuries, accidents, property damage, or consequences 
                  resulting from alcohol consumption, including but not limited to: alcohol poisoning, addiction, 
                  impaired driving, accidents, or health complications. Alcohol affects individuals differently 
                  based on factors including weight, medications, health conditions, and tolerance. 
                  Please drink responsibly, never drink and drive, and consult healthcare professionals 
                  if you have concerns about alcohol consumption or potential interactions with medications.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Professional Advice Disclaimer</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Cork does not provide professional wine investment, sommelier, or health advice. 
                  Our content should not be considered professional recommendations. For investment decisions, 
                  consult financial advisors. For wine service and pairing expertise, consult certified sommeliers. 
                  For health concerns related to alcohol, consult medical professionals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-grape mb-2">Contact for Additional Information</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  If you require more detailed information about our disclaimers, limitations, or liability terms, 
                  please contact us through our support channels. We are happy to provide additional clarification 
                  on any aspect of these terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Liability Limitation */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To the maximum extent permitted by Australian law:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Cork's liability is limited to the amount paid for services in the 12 months prior to the claim</li>
                <li>• We exclude liability for indirect, consequential, or special damages</li>
                <li>• We are not liable for third-party content, services, or websites</li>
                <li>• Our liability does not extend to personal injury or property damage from alcohol consumption</li>
                <li>• Nothing in these terms excludes rights under Australian Consumer Law that cannot be excluded</li>
              </ul>
            </CardContent>
          </Card>

          {/* Australian Consumer Law */}
          <Card>
            <CardHeader>
              <CardTitle>Australian Consumer Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Our services come with guarantees that cannot be excluded under Australian Consumer Law. 
                You are entitled to a replacement or refund for a major failure and compensation for any other 
                reasonably foreseeable loss or damage. You are also entitled to have services repaired or 
                replaced if they fail to be of acceptable quality and the failure does not amount to a major failure.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Either party may terminate this agreement:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• You may delete your account at any time through account settings</li>
                <li>• We may suspend or terminate accounts for violation of these terms</li>
                <li>• We may discontinue services with 30 days' notice</li>
                <li>• Upon termination, your right to use the service ceases immediately</li>
                <li>• Terminated accounts may have data deleted after a reasonable retention period</li>
                <li>• Subscription fees are non-refundable except as required by law</li>
              </ul>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law & Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                These terms are governed by the laws of Australia. Any disputes will be resolved in the courts of Australia.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We encourage resolving disputes through direct communication before pursuing legal action. 
                For complaints, please contact us through our support channels.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify these Terms of Service at any time. Material changes will be 
                communicated through email or platform notifications at least 30 days in advance. 
                Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-grape/5 dark:bg-grape/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-grape" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Email:</strong> legal@cork.wine</p>
                <p><strong>Support:</strong> Available through our contact form</p>
                <p><strong>Business Address:</strong> Available upon request</p>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                cork - AI-Powered Wine Recommendations<br />
                ABN: [To be provided upon business registration]<br />
                Registered in Australia
              </p>
            </CardContent>
          </Card>

        </div>
      </section>
      
      <Footer />
    </div>
  );
}