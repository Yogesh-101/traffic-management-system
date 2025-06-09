import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const benefits = [
  "Reduce traffic congestion by up to 30%",
  "Decrease commute times for residents",
  "Lower emissions from idling vehicles",
  "Improve emergency response times",
  "Data-driven infrastructure planning",
  "24/7 monitoring and alerts"
];

const CallToAction = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <section id="benefits" className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-traffic-primary/5 to-background"></div>
        <motion.div 
          className="absolute -top-10 -right-10 w-60 h-60 rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 70%)"
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(30,58,138,0.1) 0%, rgba(30,58,138,0) 70%)"
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* 3D floating elements */}
        <motion.div 
          className="absolute top-1/4 left-1/5 w-16 h-16 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-xl"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-20 h-20 backdrop-blur-md bg-white/5 border border-white/10 rounded-full shadow-xl"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      <div className="container" ref={containerRef}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-traffic-primary to-traffic-secondary"
              variants={itemVariants}
            >
              Ready to Transform Your City's Traffic Management?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg mb-8"
              variants={itemVariants}
            >
              Join the growing number of cities using SmartFlow to create more efficient, sustainable urban transportation systems.
            </motion.p>
            
            <motion.div 
              className="space-y-4 mb-8"
              variants={containerVariants}
            >
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <CheckCircle className="h-5 w-5 text-traffic-success mr-2 mt-0.5" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={containerVariants}
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" asChild className="bg-gradient-to-r from-traffic-primary to-traffic-secondary hover:from-traffic-primary/90 hover:to-traffic-secondary/90 transition-all duration-300">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              className="absolute -inset-0.5 bg-gradient-to-r from-traffic-primary to-traffic-secondary rounded-xl blur-sm opacity-30"
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="relative bg-background rounded-xl overflow-hidden border shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573074617613-fc8ef27eaa2f?auto=format&fit=crop&q=80&w=1000&h=800" 
                  alt="Smart City Traffic Management" 
                  className="w-full h-auto object-cover"
                />
                
                {/* 3D Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-traffic-primary/30 to-transparent mix-blend-overlay"></div>
                
                <motion.div 
                  className="absolute top-4 right-4 w-16 h-16 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 3, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-8 h-8 rounded-full bg-traffic-success/60 animate-pulse"></div>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-8 left-8 w-24 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
                  animate={{ 
                    x: [0, 10, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-4 bg-traffic-primary rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-3 bg-traffic-secondary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-5 bg-traffic-primary rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="w-1.5 h-2 bg-traffic-secondary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <div className="w-1.5 h-3 bg-traffic-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* 3D floating orbs */}
            <motion.div 
              className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-traffic-primary opacity-20"
              animate={{ 
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-traffic-secondary opacity-20"
              animate={{ 
                y: [0, 15, 0],
                x: [0, -10, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
