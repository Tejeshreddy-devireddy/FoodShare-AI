'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('donor');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-950/40 hover:bg-zinc-900/60 border border-zinc-900 px-3.5 py-2 rounded-xl backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight text-white mb-6 group">
          <img src="/logo.png" className="w-12 h-12 rounded-xl border border-zinc-800 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300 object-cover" alt="FoodShare AI Logo" />
          <span>FoodShare <span className="text-emerald-400 font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">AI</span></span>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Contact Our Team</h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
          Have questions about integration, logistics, or custom NGO setups? Drop us a message.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="relative rounded-3xl border border-zinc-900 bg-zinc-950/40 p-8 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Subtle Ambient Light inside the card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          {isSubmitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 mb-2 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto">
                Thank you for reaching out, <span className="text-white font-semibold">{name}</span>. A FoodShare coordinator will contact you at <span className="text-white font-semibold">{email}</span> within 24 hours.
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl px-6 py-2.5 text-xs shadow-md transition-all"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-semibold text-zinc-400">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-400">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label htmlFor="role" className="block text-xs font-semibold text-zinc-400">
                  Your Role / Interest
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                >
                  <option value="donor">Food Donor / Business</option>
                  <option value="ngo">NGO / Food Bank / Shelter</option>
                  <option value="volunteer">Individual Volunteer</option>
                  <option value="partner">Corporate Partner / Sponsor</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              {/* Subject Field */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-xs font-semibold text-zinc-400">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-semibold text-zinc-400">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message details here..."
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all active:scale-98 disabled:opacity-55 btn-shine"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
