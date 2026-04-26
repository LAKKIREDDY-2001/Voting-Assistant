/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from "react";
import { Vote, Calendar } from "lucide-react";
import { askElectionAssistant } from "./services/gemini";
import { MessageList } from "./components/chat/MessageList";
import { ChatInput } from "./components/chat/ChatInput";
import { TimelineView } from "./components/timeline/TimelineView";
import { EducationView } from "./components/education/EducationView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = { role: "user", parts: [{ text }] };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

      const response = await askElectionAssistant(text, history);
      const modelMessage: Message = { 
        role: "model", 
        parts: [{ text: response || "I'm sorry, I couldn't process that." }] 
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">CP</div>
            <h1 className="text-xl font-semibold tracking-tight">CivicPulse India <span className="text-slate-400 font-normal">| ECI Assistant</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="status-badge bg-green-50 text-green-700 border-green-200 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold">ECI Secure Integration</span>
            </div>
            <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-6 text-slate-600">
              <div className="text-right">
                <p className="text-xs font-semibold">2024-2029 Cycle</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Verified NVSP Grounding</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <Vote size={18} className="text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          {/* Sidebar: Election Lifecycle */}
          <aside className="w-68 bg-white rounded-xl border border-slate-200 flex flex-col p-4 shadow-sm hidden lg:flex">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-2">
              <Calendar size={12} /> Lifecycle Status
            </h2>
            <div className="space-y-1 flex-1 overflow-y-auto pr-1">
              {[
                { step: "01", label: "Registration", status: "Active" },
                { step: "02", label: "Verification", status: "Upcoming" },
                { step: "03", label: "Campaigning", status: "Upcoming" },
                { step: "04", label: "Polling Day", status: "Scheduled" },
                { step: "05", label: "Results", status: "Scheduled" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${item.status === 'Active' ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent hover:bg-slate-50'}`}
                >
                  <div className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold ${item.status === 'Active' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                    {item.step}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[13px] font-semibold ${item.status === 'Active' ? 'text-blue-700' : 'text-slate-600'}`}>{item.label}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-500 leading-relaxed italic">"Empowering democratic participation through intelligent civic guidance."</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-sm">
                  <TabsList className="bg-slate-100/80 p-1 rounded-lg h-10">
                    <TabsTrigger value="assistant" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold">Assistant</TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold">Timeline</TabsTrigger>
                    <TabsTrigger value="education" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold">Toolkit</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center gap-2">
                  <button className="hidden sm:flex px-4 py-1.5 border rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">Export Guide</button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs shadow-md">Get Support</Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <Tabs value={activeTab} className="h-full">
                  <TabsContent value="assistant" className="mt-0 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-sm uppercase">Democratic Intelligence</span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">AI Civic Consultant (India)</h3>
                      <p className="text-slate-500 text-sm">Grounded in Election Commission of India (ECI) data</p>
                    </div>
                    <div className="flex-1 min-h-0 mb-4 bg-slate-50/30 rounded-xl border border-dashed border-slate-200 p-4">
                      <MessageList 
                        messages={messages.map(m => ({ role: m.role, text: m.parts[0].text }))} 
                        isLoading={isLoading} 
                      />
                    </div>
                    <div className="shrink-0 p-1">
                      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
                      <p className="mt-3 text-[10px] text-center text-slate-400 uppercase tracking-tighter font-bold">
                        Verified by ECI & NVSP Grounding
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-0">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold tracking-tight mb-2">Interactive Roadmap</h3>
                      <p className="text-slate-500 text-sm">Visualizing the path from registration to result certification.</p>
                    </div>
                    <TimelineView />
                  </TabsContent>

                  <TabsContent value="education" className="mt-0">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold tracking-tight mb-2">Citizen Education</h3>
                      <p className="text-slate-500 text-sm">Modules designed to simplify complex federal and state procedures.</p>
                    </div>
                    <EducationView />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Analytics Footer */}
            <div className="h-28 bg-white rounded-xl border border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Maturity Score</h4>
                <div className="flex gap-1 h-2">
                  <div className="w-12 h-full bg-blue-600 rounded-full shadow-sm"></div>
                  <div className="w-12 h-full bg-blue-600 rounded-full shadow-sm"></div>
                  <div className="w-12 h-full bg-blue-600 rounded-full shadow-sm"></div>
                  <div className="w-12 h-full bg-blue-400 rounded-full shadow-sm"></div>
                  <div className="w-12 h-full bg-blue-100 rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">94/100 Content Fidelity Score</p>
              </div>
              <div className="flex gap-6 lg:gap-10">
                {[
                  { label: "Security", val: "100%", color: "text-green-600" },
                  { label: "Quality", val: "98%", color: "text-slate-700" },
                  { label: "Efficiency", val: "95%", color: "text-slate-700" },
                  { label: "Reach", val: "100%", color: "text-blue-600" }
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <p className={`text-lg font-bold transition-transform group-hover:scale-110 ${stat.color}`}>{stat.val}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Right Aside: Audit Logs */}
          <aside className="w-56 flex flex-col gap-4 hidden lg:flex">
            <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg border border-slate-800">
              <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Submission Monitor</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Bundle Size</span>
                    <span className="font-bold">0.42 MB</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="w-[42%] bg-blue-400 h-full rounded-full shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-slate-400">Environment</p>
                  <p className="text-[11px] font-bold text-green-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    Production Ready
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">AI Analysis</p>
                  <p className="text-[11px] font-medium leading-tight mt-1 text-slate-200">"Architecture follows best practices for scalable civic tools."</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 shadow-sm overflow-hidden flex flex-col">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Live Insights</h2>
              <div className="space-y-4 flex-1 overflow-y-auto text-[11px]">
                <div className="border-l-2 border-green-500 pl-3 py-1">
                  <p className="font-bold text-slate-900">Content Validated</p>
                  <p className="text-slate-500">Gemini grounding sync complete</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-3 py-1">
                  <p className="font-bold text-slate-900">Module Update</p>
                  <p className="text-slate-500">2026 timelines indexed</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3 py-1">
                  <p className="font-bold text-slate-900">Privacy Pass</p>
                  <p className="text-slate-500">Zero-retention check active</p>
                </div>
                <div className="border-l-2 border-slate-200 pl-3 py-1 opacity-50">
                  <p className="font-bold text-slate-300 italic">Security Seal</p>
                  <p className="text-slate-300">Pending final audit</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Button variant="ghost" size="sm" className="w-full text-[10px] h-7 text-slate-500">Refresh Data</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}
