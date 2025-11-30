"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Calendar, Award, BookOpen, UserCheck, Zap, ArrowRight } from "lucide-react";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="relative border-b border-cyan-500/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Career Pods Logo" className="w-10 h-10 rounded-lg" />
              <h1 className="text-2xl font-bold gradient-text">Career Pods</h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="ghost" className="text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10" onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
              <Button className="gradient-brand btn-glow" onClick={() => setShowOnboarding(true)}>
                Get Started
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10" onClick={() => window.location.href = '/admin'}>
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-20">
        {/* Background decorations */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30">
            <Zap className="w-4 h-4 mr-2" /> Welcome to the Future of Career Exploration
          </Badge>
          
          <h2 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Explore Careers</span>
            <br />
            <span className="text-slate-300">Together, Grow Stronger</span>
          </h2>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join curated pods of students exploring career paths together. Get expert mentorship, discover opportunities, and build meaningful connections.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="gradient-brand btn-glow h-12 px-8 text-lg font-semibold"
              onClick={() => setShowOnboarding(true)}
            >
              Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 px-8 text-lg border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 border-t border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h3>
            <p className="text-lg text-slate-400">
              Everything you need to succeed in your career exploration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "AI-Powered Matching", desc: "Smart algorithm pairs you with compatible students based on interests, goals, and learning style." },
              { icon: Calendar, title: "Structured Meetings", desc: "Regular facilitated discussions with industry professionals and peer learning sessions." },
              { icon: Target, title: "Goal Tracking", desc: "Monitor your progress, achievements, and career milestones throughout your journey." },
              { icon: UserCheck, title: "Expert Mentors", desc: "Connect with experienced professionals and alumni from President University." },
              { icon: Award, title: "Achievements", desc: "Earn badges and recognition for your contributions and professional growth." },
              { icon: BookOpen, title: "Resources Hub", desc: "Access curated career guides, industry insights, and learning materials." }
            ].map((feature, i) => (
              <Card key={i} className="glass-alt card-hover card-border bg-slate-900/30 border-slate-700/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-sm">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-slate-100">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-4 border-t border-cyan-500/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h3>
            <p className="text-lg text-slate-400">Get started in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Complete Your Profile", desc: "Share your major, interests, goals, and learning preferences" },
              { num: "02", title: "Get Matched", desc: "Our AI matches you with your perfect pod of fellow students" },
              { num: "03", title: "Start Exploring", desc: "Join meetings, connect with mentors, and grow together" }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="glass card-hover card-border bg-slate-900/40 p-8 rounded-xl border-slate-700/50">
                  <div className="text-5xl font-bold gradient-text opacity-20 mb-4">{step.num}</div>
                  <h4 className="text-xl font-semibold text-slate-100 mb-3">{step.title}</h4>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-cyan-500/50" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 gradient-brand opacity-5 rounded-2xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h3 className="text-4xl font-bold mb-6">
            <span className="gradient-text">Ready to Transform Your Career?</span>
          </h3>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of President University students who are discovering their paths and building lasting professional relationships.
          </p>
          <Button 
            size="lg" 
            className="gradient-brand btn-glow h-12 px-10 text-lg font-semibold"
            onClick={() => setShowOnboarding(true)}
          >
            Start Your Journey Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 bg-slate-900/50 backdrop-blur py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center glow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">Career Pods</span>
              </div>
              <p className="text-slate-400 text-sm">
                Empowering President University students to explore and build careers together.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-cyan-300">Features</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="hover:text-cyan-400 cursor-pointer">AI Matching</li>
                <li className="hover:text-cyan-400 cursor-pointer">Pod Meetings</li>
                <li className="hover:text-cyan-400 cursor-pointer">Progress Tracking</li>
                <li className="hover:text-cyan-400 cursor-pointer">Mentorship</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-cyan-300">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="hover:text-cyan-400 cursor-pointer">Career Guide</li>
                <li className="hover:text-cyan-400 cursor-pointer">Industry Insights</li>
                <li className="hover:text-cyan-400 cursor-pointer">Alumni Stories</li>
                <li className="hover:text-cyan-400 cursor-pointer">FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-cyan-300">Contact</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>dwiky.candra@student.president.ac.id</li>
                <li>President University</li>
                <li>Jababeka, Cikarang</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2025 Career Pods - President University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}