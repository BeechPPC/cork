import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, MapPin, Clock, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaThreads } from "react-icons/fa6";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you within 24 hours.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields",
        description: "Please fill in your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-grape/10 to-purple-100 dark:from-purple-900/20 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-grape/10 text-grape border-grape/20">
            Get in Touch
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-poppins font-bold text-slate dark:text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions about cork? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate dark:text-white">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-grape/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-grape" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">hello@cork.wine</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-grape/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-grape" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate dark:text-white">Live Chat</h3>
                      <p className="text-gray-600 dark:text-gray-300">Available soon</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Coming with our launch</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-grape/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-grape" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate dark:text-white">Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">Melbourne, Australia</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Proudly Australian-made</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-grape/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-grape" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate dark:text-white">Response Time</h3>
                      <p className="text-gray-600 dark:text-gray-300">Within 24 hours</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Monday to Friday, AEST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate dark:text-white">Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a 
                      href="https://facebook.com/corkwine" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-grape hover:bg-grape/10 transition-all"
                      aria-label="Follow cork on Facebook"
                    >
                      <FaFacebook className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://instagram.com/corkwine" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-grape hover:bg-grape/10 transition-all"
                      aria-label="Follow cork on Instagram"
                    >
                      <FaInstagram className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://threads.net/@corkwine" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-grape hover:bg-grape/10 transition-all"
                      aria-label="Follow cork on Threads"
                    >
                      <FaThreads className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://linkedin.com/company/corkwine" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-grape hover:bg-grape/10 transition-all"
                      aria-label="Follow cork on LinkedIn"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Follow us for wine tips, Australian wine insights, and product updates.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate dark:text-white">Send us a Message</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate dark:text-white mb-2">
                          Name *
                        </label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your full name"
                          className="focus:ring-grape focus:border-grape"
                          disabled={contactMutation.isPending}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate dark:text-white mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          className="focus:ring-grape focus:border-grape"
                          disabled={contactMutation.isPending}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate dark:text-white mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="What's this about?"
                        className="focus:ring-grape focus:border-grape"
                        disabled={contactMutation.isPending}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate dark:text-white mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        className="focus:ring-grape focus:border-grape resize-none"
                        disabled={contactMutation.isPending}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-grape hover:bg-purple-700 text-white font-medium py-3"
                    >
                      {contactMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By sending this message, you agree to our Privacy Policy. We'll only use your information to respond to your enquiry.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold text-slate dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Quick answers to common questions about cork.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate dark:text-white mb-2">When does cork launch?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We're putting the finishing touches on cork and will be launching soon. Sign up for our email list to be notified the moment we go live.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate dark:text-white mb-2">Is cork only for Australian wines?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  While we specialise in Australian wines and have deep expertise in Australian regions, cork can recommend wines from around the world based on your preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate dark:text-white mb-2">How much does cork cost?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  cork offers both free and premium plans. Free users get basic recommendations, while Premium unlocks unlimited access, advanced features, and personalised insights for $4.99/month.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate dark:text-white mb-2">Do I need to be 18+ to use cork?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes, cork is an alcohol-related service and you must be 18 or older to create an account and use our platform. Age verification is required during signup.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}