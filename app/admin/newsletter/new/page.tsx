"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Send, Eye, Users, Clock, Calendar, Image as ImageIcon, Link as LinkIcon, Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, FileText } from "lucide-react";

export default function CreateCampaignPage() {
  const [schedule, setSchedule] = useState("now");

  return (
    <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/newsletter" className="w-10 h-10 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">Create Campaign</h1>
            <span className="text-sm font-medium text-neutral-500 mt-1">Design and schedule your email newsletter.</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-neutral-600 dark:text-neutral-300 rounded-xl px-6 py-3 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-neutral-100 dark:bg-[#222] text-[#212529] dark:text-white rounded-xl px-6 py-3 text-sm font-bold hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
        
        {/* LEFT COLUMN (2/3): Content Builder */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Email Details */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Email Details</h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Campaign Name (Internal)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Black Friday 2023 - Early Access" 
                  className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none"
                />
              </div>

              <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Email Subject Line</label>
                <input 
                  type="text" 
                  placeholder="The first thing your subscribers will see..." 
                  className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Preview Text</label>
                <input 
                  type="text" 
                  placeholder="Appears next to the subject line in most inboxes..." 
                  className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Email Builder Mockup */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-[#1a1a1a]/50">
              <h2 className="text-lg font-black text-[#212529] dark:text-white">Email Content</h2>
              
              <div className="flex items-center gap-1 bg-white dark:bg-[#222] p-1 rounded-lg border border-black/5 dark:border-white/5 shadow-sm">
                <button className="p-2 text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="p-2 text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                <button className="p-2 text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1"></div>
                <button className="p-2 text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                <button className="p-2 text-[#212529] dark:text-white bg-neutral-100 dark:bg-white/10 rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                <button className="p-2 text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1"></div>
                <button className="p-2 text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded transition-colors"><List className="w-4 h-4" /></button>
                <button className="p-2 text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="flex-1 bg-neutral-100 dark:bg-[#1a1a1a] p-8 overflow-y-auto flex justify-center">
              {/* The "Email Canvas" */}
              <div className="w-full max-w-[600px] bg-white dark:bg-[#111] shadow-lg rounded-xl overflow-hidden flex flex-col relative border border-black/5 dark:border-white/5">
                
                {/* Email Header */}
                <div className="p-8 text-center border-b border-black/5 dark:border-white/5">
                  <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tighter">TRAILFORGE</h1>
                </div>

                {/* Email Body */}
                <div className="p-8 flex flex-col gap-6">
                  
                  {/* Image Placeholder */}
                  <div className="w-full h-48 bg-neutral-100 dark:bg-[#222] rounded-xl flex items-center justify-center border-2 border-dashed border-black/10 dark:border-white/10 group cursor-pointer hover:border-[#F77F00] transition-colors">
                    <div className="flex flex-col items-center text-neutral-400 group-hover:text-[#F77F00] transition-colors">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm font-bold">Upload Hero Image</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <textarea 
                      className="w-full min-h-[150px] bg-transparent text-center text-[#212529] dark:text-white text-lg font-medium outline-none resize-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
                      placeholder="Write your email content here..."
                      defaultValue="Hey Adventurer! &#10;&#10;Winter is fast approaching, and we want to make sure you are geared up and ready to conquer the frost. &#10;&#10;For the next 48 hours, all our premium Arctic Pro jackets are 20% off. Don't let the cold stop your expedition."
                    ></textarea>
                  </div>

                  {/* Button Placeholder */}
                  <div className="flex justify-center mt-4">
                    <button className="bg-[#F77F00] text-white px-8 py-4 rounded-xl text-sm font-black tracking-widest uppercase hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                      Shop The Sale
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3): Audience & Sending */}
        <div className="flex flex-col gap-8">
          
          {/* Target Audience */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Target Audience</h2>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Send to segment</label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <select className="w-full pl-11 pr-10 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold text-[#212529] dark:text-white appearance-none cursor-pointer focus:border-[#F77F00] outline-none">
                    <option>All Subscribers (12,450)</option>
                    <option>VIP Customers (342)</option>
                    <option>New Signups (Last 30 Days)</option>
                    <option>Inactive Customers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Schedule */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Delivery</h2>
            
            <div className="flex flex-col gap-4 mb-6">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${schedule === 'now' ? 'border-[#F77F00] bg-orange-50/50 dark:bg-orange-500/5' : 'border-black/5 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]'}`}>
                <input type="radio" name="schedule" checked={schedule === 'now'} onChange={() => setSchedule('now')} className="w-4 h-4 accent-[#F77F00]" />
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${schedule === 'now' ? 'text-[#F77F00]' : 'text-[#212529] dark:text-white'}`}>Send Immediately</span>
                  <span className="text-xs font-medium text-neutral-500 mt-0.5">Start sending as soon as you confirm.</span>
                </div>
              </label>
              
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${schedule === 'later' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5' : 'border-black/5 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]'}`}>
                <input type="radio" name="schedule" checked={schedule === 'later'} onChange={() => setSchedule('later')} className="w-4 h-4 accent-blue-500" />
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${schedule === 'later' ? 'text-blue-500' : 'text-[#212529] dark:text-white'}`}>Schedule for Later</span>
                  <span className="text-xs font-medium text-neutral-500 mt-0.5">Pick a specific date and time to send.</span>
                </div>
              </label>
            </div>

            {schedule === 'later' && (
              <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="flex flex-col gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Send Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="date" className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold focus:border-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Send Time</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="time" className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold focus:border-blue-500 outline-none" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Box */}
          <div className={`rounded-[2rem] p-8 shadow-lg relative overflow-hidden transition-colors ${schedule === 'now' ? 'bg-[#F77F00]' : 'bg-blue-500'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
            
            <h2 className="text-lg font-black text-white mb-6 relative z-10">Confirm Campaign</h2>
            
            <button className="w-full bg-white text-[#212529] font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors shadow-xl relative z-10">
              {schedule === 'now' ? (
                <><Send className="w-5 h-5 text-[#F77F00]" /> Send Campaign Now</>
              ) : (
                <><Clock className="w-5 h-5 text-blue-500" /> Schedule Campaign</>
              )}
            </button>
            <p className="text-center text-xs font-medium text-white/80 mt-4 relative z-10">
              {schedule === 'now' ? 'This action cannot be undone.' : 'Email will be queued.'}
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
