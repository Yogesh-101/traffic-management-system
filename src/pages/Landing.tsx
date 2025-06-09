
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight,
  BarChart4,
  Clock,
  Car,
  MapPin,
  Activity,
  AlertTriangle,
  Gauge,
  Layers,
  UserPlus,
} from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import StatsSection from '@/components/landing/StatsSection';
import CallToAction from '@/components/landing/CallToAction';
import { motion } from 'framer-motion';

const Landing = () => {
  const { session } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-traffic-light to-traffic-muted">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-6 w-6 text-traffic-primary" />
            <span className="text-xl font-bold">
              <span className="text-traffic-primary">Smart</span>
              <span className="text-traffic-secondary">Flow</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium hover:text-traffic-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-sm font-medium hover:text-traffic-primary transition-colors"
            >
              Benefits
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium hover:text-traffic-primary transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#stats"
              className="text-sm font-medium hover:text-traffic-primary transition-colors"
            >
              Statistics
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {session ? (
              <Button asChild>
                <Link to="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-traffic-primary/30 hover:border-traffic-primary/60 transition-all duration-300"
                >
                  <Link to="/login">
                    Login
                    <Activity className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    asChild
                    className="bg-gradient-to-r from-traffic-primary to-traffic-secondary hover:from-traffic-primary/90 hover:to-traffic-secondary/90 transition-all duration-300"
                  >
                    <Link to="/login?tab=register">
                      Register
                      <UserPlus className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <FeatureSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Testimonials */}
        <TestimonialSection />

        {/* CTA Section */}
        <CallToAction />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-traffic-primary" />
                <span className="text-lg font-bold">
                  <span className="text-traffic-primary">Smart</span>
                  <span className="text-traffic-secondary">Flow</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced traffic management and monitoring system using AI and IoT
                technology.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 SmartFlow Traffic Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
