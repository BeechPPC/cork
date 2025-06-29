import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaThreads } from 'react-icons/fa6';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        // Handle error response
        console.error('Email signup failed:', data.message);
        alert(data.message || 'Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up for waitlist:', error);
      alert('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: 'https://facebook.com/usecork',
      color: 'hover:text-blue-400',
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://instagram.com/getcork.app',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Threads',
      icon: FaThreads,
      url: 'https://threads.net/@getcork.app',
      color: 'hover:text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-wine/30 to-grape/30 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
          <CardContent className="p-12">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">Coming Soon</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold mb-6 leading-tight">
                <span className="text-white">cork</span>
                <br />
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  is coming soon
                </span>
              </h1>
            </div>

            {/* Main text */}
            <p className="text-xl lg:text-2xl mb-12 text-gray-200 font-light leading-relaxed">
              cork is launching soon, join our waitlist to be the first to know
              when it launches
            </p>

            {/* Email signup form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="mb-12">
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-white/40 focus:ring-white/20"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-2 rounded-lg font-semibold shadow-lg hover:shadow-red-500/25 transition-all transform hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Joining...</span>
                      </div>
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mb-12">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6">
                  <p className="text-green-300 font-medium">
                    🎉 Thanks for joining our waitlist! We'll notify you when
                    cork launches.
                  </p>
                </div>
              </div>
            )}

            {/* Social media links */}
            <div className="border-t border-white/20 pt-8">
              <p className="text-gray-300 mb-6 font-medium">
                Follow us for updates
              </p>
              <div className="flex justify-center space-x-6">
                {socialLinks.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-300 hover:text-white transition-colors duration-200 ${social.color} p-2 rounded-lg hover:bg-white/10 flex items-center space-x-2`}
                    aria-label={`Follow us on ${social.name}`}
                    onClick={() =>
                      console.log(`Clicked ${social.name} link: ${social.url}`)
                    }
                  >
                    <social.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
