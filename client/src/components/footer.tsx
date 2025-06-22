import { FaFacebook, FaInstagram, FaLinkedin, FaThreads } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-slate dark:bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/corkwine" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow cork on Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a 
                href="https://instagram.com/corkwine" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow cork on Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a 
                href="https://threads.net/@corkwine" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow cork on Threads"
              >
                <FaThreads className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com/company/corkwine" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow cork on LinkedIn"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="/referral-program" className="hover:text-white transition-colors">Referral Program</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
              <li><a href="/help-centre" className="hover:text-white transition-colors">Help Centre</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/wine-education" className="hover:text-white transition-colors">Wine Education</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/age-verification" className="hover:text-white transition-colors">Age Verification</a></li>
              <li><a href="/responsible-drinking" className="hover:text-white transition-colors">Responsible Drinking</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © 2025 cork. All rights reserved. Drink responsibly.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 md:mt-0">
            Must be 18+ to use this service
          </p>
        </div>
      </div>
    </footer>
  );
}