
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const stats = [
  {
    value: 32,
    suffix: "%",
    label: "Reduction in traffic congestion",
    description: "In cities using SmartFlow"
  },
  {
    value: 24.5,
    suffix: "k",
    label: "Traffic signals optimized",
    description: "Across 40+ urban areas"
  },
  {
    value: 18,
    suffix: " min",
    label: "Average commute time saved",
    description: "Per city resident daily"
  },
  {
    value: 94,
    suffix: "%",
    label: "User satisfaction rate",
    description: "Among municipal administrators"
  }
];

const AnimatedCounter = ({ value, suffix }: { value: number, suffix: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const counter = Math.floor(value);
    
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.floor(counter * progress);
      
      if (currentCount >= counter) {
        setCount(counter);
        clearInterval(timer);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <span className="flex items-center justify-center">
      <span ref={nodeRef}>{value % 1 === 0 ? count : count.toFixed(1)}</span>
      <span>{suffix}</span>
    </span>
  );
};

const StatsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <section id="stats" className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <motion.div 
          className="absolute top-1/3 left-1/5 w-40 h-40 rounded-full bg-traffic-primary"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-traffic-secondary"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/3 w-24 h-24 rounded-full bg-traffic-success"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-traffic-primary to-traffic-secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Proven Results
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            SmartFlow has demonstrated measurable improvements in traffic management efficiency across multiple cities.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="border-0 bg-gradient-to-br from-card/80 to-muted/30 backdrop-blur-sm hover:shadow-xl transition-all duration-500 h-full relative overflow-hidden group">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-traffic-primary/10 to-traffic-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                
                <motion.div 
                  className="absolute -top-10 -right-10 w-20 h-20 bg-traffic-primary/10 rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                />
                
                <CardContent className="p-6 text-center space-y-2 relative z-10">
                  <motion.p 
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-traffic-primary to-traffic-secondary"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      delay: 0.1 + index * 0.1 
                    }}
                    viewport={{ once: true }}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </motion.p>
                  <motion.p 
                    className="font-medium"
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {stat.label}
                  </motion.p>
                  <motion.p 
                    className="text-sm text-muted-foreground"
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {stat.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
