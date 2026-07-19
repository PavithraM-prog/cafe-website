import React from "react";
import Link from "next/link";
import { Coffee, Phone, Mail, MapPin, Clock } from "lucide-react";
import FindUsSection from "@/components/FindUsSection";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-foreground border-t border-borderColor pt-16 pb-8 transition-all">
      {/* Premium Interactive Location Section */}
      <FindUsSection />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-2xl">
              <Coffee className="h-6 w-6 text-accent" />
              <span className="font-serif">Cozy Beans</span>
            </Link>
            <p className="text-sm text-textMuted leading-relaxed">
              Step into a warm, fragrant space designed for coffee lovers, conversation seekers, and comfort eaters. Every roast is carefully crafted, and every recipe is made from scratch.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-background hover:bg-primary hover:text-white rounded-full text-textMuted shadow-sm transition-all" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-background hover:bg-primary hover:text-white rounded-full text-textMuted shadow-sm transition-all" aria-label="Instagram">
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-background hover:bg-primary hover:text-white rounded-full text-textMuted shadow-sm transition-all" aria-label="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-textMuted hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/menu" className="text-textMuted hover:text-primary transition-colors">Our Menu</Link>
              </li>
              <li>
                <Link href="/table-booking" className="text-textMuted hover:text-primary transition-colors">Book a Table</Link>
              </li>
              <li>
                <Link href="/event-booking" className="text-textMuted hover:text-primary transition-colors">Event Booking</Link>
              </li>
              <li>
                <Link href="/about" className="text-textMuted hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-textMuted hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-bold text-primary mb-4">Contact Info</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-textMuted">AKC, Mogappair, Nerkundram, Chennai, Greater Chennai, Tamil Nadu 600107</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span className="text-textMuted">+1 (555) 789-COZY</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span className="text-textMuted">hello@cozybeans.com</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="text-textMuted text-xs leading-normal">
                  <p>Mon - Fri: 7:00 AM - 8:00 PM</p>
                  <p>Sat - Sun: 8:00 AM - 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          </div>

        <hr className="border-borderColor my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-textMuted space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} Cozy Beans Café. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
