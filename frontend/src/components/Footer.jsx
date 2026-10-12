import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#20212B] dark:bg-black border-t border-[#534145] mt-auto text-[#FED7A5]/70 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2D4354] dark:bg-[#FED7A5] flex items-center justify-center text-white dark:text-[#20212B]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold text-[#FED7A5]">EduNexus</span>
            </div>
            <p className="text-xs text-[#FED7A5]/70 leading-relaxed">
              EduNexus Smart Campus Admissions — Simplifying the admission journey for students and parents.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#FED7A5] text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#FED7A5] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FED7A5] transition">
                  About EduNexus
                </Link>
              </li>
              <li>
                <Link to="/admissions-info" className="hover:text-[#FED7A5] transition">
                  Admissions Guidelines
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#FED7A5] transition">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="font-semibold text-[#FED7A5] text-sm mb-3">Student Portal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-[#FED7A5] transition">
                  Application Tracking
                </Link>
              </li>
              <li>
                <Link to="/new-application" className="hover:text-[#FED7A5] transition">
                  Submit New Application
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-[#FED7A5] transition">
                  Campus AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FED7A5] transition">
                  Helpdesk & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Admissions Office Contact */}
          <div>
            <h4 className="font-semibold text-[#FED7A5] text-sm mb-3">Admissions Desk</h4>
            <div className="space-y-2.5 text-xs text-[#FED7A5]/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FED7A5] shrink-0" />
                <span>EduNexus Academic Complex, Main Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FED7A5] shrink-0" />
                <span>+92 (051) 111-222-333</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FED7A5] shrink-0" />
                <span>admissions@edunexus.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#534145] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FED7A5]/60 gap-2">
          <p>© {new Date().getFullYear()} EduNexus Smart Campus Admissions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
