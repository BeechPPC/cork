import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaThreads,
} from 'react-icons/fa6';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-slate dark:bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-poppins font-bold text-grape dark:text-purple-400 mb-4">
              cork
            </h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-6">
              AI-powered wine recommendations with a focus on Australian wines.
              Discover your perfect match for any occasion.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/usecork"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow cork on Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/getcork.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow cork on Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://threads.net/@getcork.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow cork on Threads"
              >
                <FaThreads className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/"
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
            <h4 className="font-semibold mb-4 text-white">
              Shop (Coming Soon)
            </h4>
            <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Wine
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Apparel
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shop All
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
              <li>
                <Link href="/help-centre">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Help Centre
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Contact Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/wine-education">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Wine Education
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Referral Program(Coming Soon)
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
              <li>
                <Link href="/privacy-policy">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/age-verification">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Age Verification
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/responsible-drinking">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Responsible Drinking
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
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
