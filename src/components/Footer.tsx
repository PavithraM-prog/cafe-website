import React from "react";
import Link from "next/link";
import { Coffee, Phone, Mail, MapPin, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C100E] text-[#FFF8E7] pt-20 pb-10 transition-all border-t border-[#2C1A17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-2 text-[#D9A441] font-bold text-2xl hover:scale-[1.01] transition-transform duration-200">
              <Coffee className="h-6 w-6" />
              <span className="font-serif tracking-tight">Cozy Beans</span>
            </Link>
            <p className="text-sm text-[#E6DDD0]/70 leading-relaxed font-light">
              Step into a warm, fragrant space designed for coffee lovers, conversation seekers, and comfort eaters. Every roast is carefully crafted, and every recipe is made from scratch.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2.5 bg-white/5 hover:bg-[#D9A441] hover:text-[#1C100E] rounded-full text-[#FFF8E7]/80 hover:scale-110 active:scale-95 transition-all shadow-sm duration-300" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a href="#" className="p-2.5 bg-white/5 hover:bg-[#D9A441] hover:text-[#1C100E] rounded-full text-[#FFF8E7]/80 hover:scale-110 active:scale-95 transition-all shadow-sm duration-300" aria-label="Instagram">
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="p-2.5 bg-white/5 hover:bg-[#D9A441] hover:text-[#1C100E] rounded-full text-[#FFF8E7]/80 hover:scale-110 active:scale-95 transition-all shadow-sm duration-300" aria-label="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#D9A441] mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-[#E6DDD0]/75 hover:text-[#D9A441] transition-colors font-medium">Home</Link>
              </li>
              <li>
                <Link href="/menu" className="text-[#E6DDD0]/75 hover:text-[#D9A441] transition-colors font-medium">Our Menu</Link>
              </li>
              <li>
                <Link href="/reservations" className="text-[#E6DDD0]/75 hover:text-[#D9A441] transition-colors font-medium">Book a Table</Link>
              </li>
              <li>
                <Link href="/login" className="text-[#E6DDD0]/75 hover:text-[#D9A441] transition-colors font-medium">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#D9A441] mb-5">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#D9A441] shrink-0 mt-0.5" />
                <span className="text-[#E6DDD0]/75 font-light">123 Aroma Lane, Coffee District, CA 90210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#D9A441] shrink-0" />
                <span className="text-[#E6DDD0]/75 font-light">+91 7981859163</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#D9A441] shrink-0" />
                <span className="text-[#E6DDD0]/75 font-light">hello@cozybeans.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-[#D9A441] shrink-0 mt-0.5" />
                <div className="text-[#E6DDD0]/75 text-xs leading-relaxed font-light">
                  <p>Mon - Fri: 7:00 AM - 8:00 PM</p>
                  <p>Sat - Sun: 8:00 AM - 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Location */}
          <div className="flex flex-col">
            <h3 className="font-serif text-lg font-bold text-[#D9A441] mb-5">Find Us</h3>
            <div className="w-full h-40 rounded-2xl overflow-hidden border border-[#2C1A17] shadow-lg relative bg-[#1B100E]">
              {/* Mock Google Map visual design */}
              <div className="absolute inset-0 bg-[#251714] flex flex-col items-center justify-center p-4 text-center">
                <MapPin className="h-8 w-8 text-[#D9A441] animate-bounce mb-2" />
                <span className="font-bold text-xs text-[#FFF8E7]">Cozy Beans Café Location</span>
                <span className="text-[10px] text-[#E6DDD0]/60 mt-1">Click to open on Google Maps</span>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Open Map"
              ></a>
            </div>
          </div>
        </div>

        <hr className="border-[#2C1A17] my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#E6DDD0]/50 space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} Cozy Beans Café. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#D9A441] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D9A441] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
