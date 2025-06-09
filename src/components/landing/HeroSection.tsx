import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart4 } from 'lucide-react';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [controls]);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Floating 3D shapes keyframe variants
  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative py-24 overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-b from-traffic-primary/10 to-transparent"
    >
      {/* Decorative floating background shapes */}
      <motion.div
        className="absolute top-20 left-12 w-20 h-20 rounded-2xl bg-traffic-secondary/30 blur-lg"
        variants={floatingVariants}
        animate="float"
      />
      <motion.div
        className="absolute bottom-32 right-24 w-36 h-36 rounded-full bg-traffic-primary/25 blur-xl"
        variants={floatingVariants}
        animate="float"
        transition={{ duration: 7, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-10 w-48 h-48 rounded-lg bg-traffic-warning/20 blur-2xl"
        style={{ translateX: '-50%' }}
        variants={floatingVariants}
        animate="float"
        transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main content container */}
      <div className="container relative z-10 max-w-4xl text-center mx-auto px-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-traffic-primary to-traffic-secondary text-white font-medium shadow-lg hover:scale-105 transition-transform duration-300 cursor-default select-none">
            <BarChart4 className="w-5 h-5" />
            Intelligent Traffic Management System
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-traffic-primary to-traffic-secondary"
            >
              Smart Traffic Management
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Optimize traffic flow, reduce congestion, and improve urban mobility with our AI-powered traffic management system.
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 rounded-xl shadow-2xl overflow-hidden border border-traffic-primary/30"
        >
          <div className="relative aspect-video">
            <img
              src="https://images.unsplash.com/photo-1566132127697-4524fea60007?auto=format&fit=crop&q=80&w=1600&h=900"
              alt="Traffic Management Dashboard"
              className="object-cover w-full h-full"
              loading="lazy"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes gradient-slide {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-gradient-slide {
            animation: gradient-slide 5s ease infinite;
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
