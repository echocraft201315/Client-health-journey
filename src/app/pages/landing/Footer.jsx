import { Button } from "@/app/components/ui/button";
import { Heart, Mail, Phone, MapPin, Shield, FileText, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-text-hero text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Client Health Tracker</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              HIPAA-compliant AI-powered nutrition coaching platform designed 
              for healthcare providers and wellness coaches.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-primary-glow" />
              <span className="text-gray-300">HIPAA Compliant & SOC 2 Certified</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Product</h3>
            <nav className="space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Features
              </a>
              <a href="#templates" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Templates
              </a>
              <a href="#integrations" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Integrations
              </a>
              <a href="#api" className="block text-gray-300 hover:text-primary-glow transition-colors">
                API Documentation
              </a>
              <a href="#security" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Security & Compliance
              </a>
            </nav>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Support</h3>
            <nav className="space-y-3">
              <a href="#help" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Help Center
              </a>
              <a href="#training" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Training Resources
              </a>
              <a href="#community" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Community
              </a>
              <a href="#status" className="block text-gray-300 hover:text-primary-glow transition-colors">
                System Status
              </a>
              <a href="#contact" className="block text-gray-300 hover:text-primary-glow transition-colors">
                Contact Support
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-glow" />
                <a href="mailto:support@reply.practicenaturals.com" className="text-gray-300 hover:text-primary-glow transition-colors">
                  support@reply.practicenaturals.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-glow" />
                <a href="tel:580-203-0778" className="text-gray-300 hover:text-primary-glow transition-colors">
                  580-203-0778
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-glow" />
                <span className="text-gray-300">Austin, TX</span>
              </div>
            </div>
            
            {/* CTA */}
            <div className="pt-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={() => window.open('https://go.clienthealthtracker.com/widget/booking/Fwe2aulhdV6W58wEhmQZ', '_blank')}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-gray-300 hover:text-primary-glow transition-colors flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Privacy Policy</span>
              </a>
              <a href="#terms" className="text-gray-300 hover:text-primary-glow transition-colors flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Terms of Service</span>
              </a>
              <a href="#hipaa" className="text-gray-300 hover:text-primary-glow transition-colors flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliance</span>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2024 Client Health Tracker. All rights reserved.
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span className="text-gray-300">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span className="text-gray-300">SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-5 h-5 text-accent1" />
                  <span className="text-gray-300">Growing Community</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                Made with ❤️ for healthcare professionals
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;