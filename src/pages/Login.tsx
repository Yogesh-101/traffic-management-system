import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, User, Mail, Lock, AlertTriangle, Car, MapPin, BarChart4, Gauge, Activity, TrafficCone, LogIn, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  
  const { signIn, signUp, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords don't match");
      return;
    }
    
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters");
      return;
    }
    
    await signUp(regEmail, regPassword, regName);
  };

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
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-slate-900 to-traffic-primary flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <motion.div 
          className="absolute top-10 left-1/4 w-96 h-1 bg-traffic-secondary" 
          style={{borderRadius: '50px'}}
          animate={{ 
            x: [0, 100, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-20 left-1/3 w-64 h-1 bg-traffic-warning" 
          style={{borderRadius: '50px'}}
          animate={{ 
            x: [0, -80, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <motion.div 
          className="absolute top-24 left-1/5 h-3 w-3 rounded-full bg-traffic-alert"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div 
          className="absolute bottom-24 right-1/5 h-3 w-3 rounded-full bg-traffic-success"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute top-1/4 left-1/5 w-16 h-16 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-xl"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-20 h-20 backdrop-blur-md bg-white/5 border border-white/10 rounded-full shadow-xl"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 1 
          }}
        />
      </div>
      
      <motion.div 
        className="absolute top-10 left-10 h-16 w-16 rounded-full bg-traffic-alert/20 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <TrafficCone className="h-8 w-8 text-traffic-alert" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-traffic-success/20 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Gauge className="h-8 w-8 text-traffic-success" />
      </motion.div>
      
      <motion.div 
        className="w-full max-w-md z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-traffic-primary to-traffic-secondary flex items-center justify-center shadow-lg relative">
            <Car className="h-8 w-8 text-white" />
            <motion.div 
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-traffic-warning flex items-center justify-center shadow"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Activity className="h-3 w-3 text-white" />
            </motion.div>
          </div>
        </motion.div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div variants={itemVariants}>
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-traffic-primary data-[state=active]:to-traffic-secondary data-[state=active]:text-white">
                <LogIn className="mr-1 h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-traffic-primary data-[state=active]:to-traffic-secondary data-[state=active]:text-white">
                <UserPlus className="mr-1 h-4 w-4" />
                Register
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          <TabsContent value="login">
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm border-t-4 border-t-traffic-secondary">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <BarChart4 className="h-5 w-5 text-traffic-primary" />
                    <span className="text-traffic-primary">Smart</span>
                    <span className="text-traffic-secondary">Flow</span>
                  </CardTitle>
                  <CardDescription className="text-center text-gray-600">
                    Traffic Management Dashboard Access
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4 pt-0">
                    {error && (
                      <motion.div 
                        className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {error}
                      </motion.div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="admin@smartflow.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-slate-300 focus-visible:ring-traffic-secondary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-traffic-secondary hover:text-traffic-primary transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 border-slate-300 focus-visible:ring-traffic-secondary"
                          required
                        />
                      </div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-traffic-primary to-traffic-secondary hover:from-traffic-primary/90 hover:to-traffic-secondary/90 transition-colors shadow-md"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </form>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="border-t border-slate-200 pt-4 text-center">
                    <p className="text-xs text-slate-500">
                      © 2025 SmartFlow Traffic Management System. All rights reserved.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="register">
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm border-t-4 border-t-traffic-warning">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <MapPin className="h-5 w-5 text-traffic-primary" />
                    <span className="text-traffic-primary">Create</span>
                    <span className="text-traffic-secondary">Account</span>
                  </CardTitle>
                  <CardDescription className="text-center text-gray-600">
                    Register to access the traffic management system
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegistration}>
                  <CardContent className="space-y-4 pt-0">
                    {regError && (
                      <motion.div 
                        className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {regError}
                      </motion.div>
                    )}
                    {error && (
                      <motion.div 
                        className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {error}
                      </motion.div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="reg-name" 
                          type="text" 
                          placeholder="John Doe"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="pl-10 border-slate-300 focus-visible:ring-traffic-secondary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="reg-email" 
                          type="email" 
                          placeholder="your.email@example.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="pl-10 border-slate-300 focus-visible:ring-traffic-secondary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="reg-password" 
                          type="password"
                          placeholder="Create a password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="pl-10 border-slate-300 focus-visible:ring-traffic-secondary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="reg-confirm-password" 
                          type="password"
                          placeholder="Confirm your password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="pl-10 border-slate-300 focus-visible:ring-traffic-secondary"
                          required
                        />
                      </div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-traffic-primary to-traffic-secondary hover:from-traffic-primary/90 hover:to-traffic-secondary/90 transition-colors shadow-md"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Register
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </form>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="border-t border-slate-200 pt-4 text-center">
                    <p className="text-xs text-slate-500">
                      © 2025 SmartFlow Traffic Management System. All rights reserved.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Login;
