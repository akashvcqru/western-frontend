import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Zap, 
  ArrowRight, 
  Maximize2, 
  Lock, 
  Box, 
  Settings,
  Hammer,
  Layout,
  Sparkles
} from "lucide-react";
import { AppRoutes } from "@/constants/routes";

export default function ModularPartitionPage() {

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <Image 
          src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2000&auto=format&fit=crop"
          alt="Modular Partition Solutions"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        
        <div className="relative z-10 text-center space-y-8 max-w-5xl px-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">Service Excellence</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            Modular <span className="text-primary">Partitions.</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed font-normal">
            Smart, reconfigurable wall systems that adapt to your evolving business needs with zero downtime.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 lg:py-24 bg-neutral-50/50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-stretch">
            <div className="space-y-8">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Design Philosophy</span>
                <h2 className="text-2xl lg:text-4xl font-bold text-secondary tracking-tight leading-tight">
                  Agile <span className="text-primary">Structures.</span>
                </h2>
              </div>
              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                Our modular partition systems are designed for the modern, fast-paced business world where flexibility is the ultimate competitive advantage.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: Zap, title: "Rapid Installation", desc: "Prefabricated components for clean and quick on-site assembly." },
                  { icon: Maximize2, title: "Scalability", desc: "Easily demount and reconfigure as your team grows or changes." },
                  { icon: Lock, title: "Acoustic Privacy", desc: "High-performance sound insulation for focused work environments." },
                  { icon: Box, title: "Integrated Utilities", desc: "Internal raceways for seamless electrical and data cabling." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-[24px] bg-white border border-neutral-200 shadow-xl shadow-neutral-900/[0.03] hover:border-primary/40 hover:shadow-2xl hover:shadow-neutral-900/[0.06] transition-all duration-500 group">
                    <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-primary border border-neutral-200 group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-4">
                      <item.icon size={22} />
                    </div>
                    <h4 className="font-bold text-secondary text-lg mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-[13px] text-neutral-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full min-h-[600px] rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200">
              <Image 
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
                alt="Modular Partition Design"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Execution Strategy</span>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight">Our <span className="text-primary">Workflow.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 relative">
            {[
              { icon: Layout, step: "01", title: "Space Mapping", desc: "Planning the optimal layout for your modular walls." },
              { icon: Settings, step: "02", title: "Manufacturing", desc: "Precision fabrication of partition panels and frames." },
              { icon: Hammer, step: "03", title: "Seamless Setup", desc: "Quick and dust-free installation by our expert team." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-500 group relative z-10 shadow-2xl shadow-black/20">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8">
                  <item.icon size={28} />
                </div>
                <div className="space-y-4">
                  <span className="text-primary font-black text-sm tracking-widest">{item.step}</span>
                  <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="bg-neutral-50 rounded-[64px] p-12 lg:p-24 flex flex-col items-center text-center space-y-10 border border-neutral-100 shadow-premium">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Start Your Transformation</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-secondary tracking-tight">Need a flexible <span className="text-primary">layout?</span></h2>
              <p className="text-gray-500 text-base lg:text-lg font-normal max-w-xl mx-auto">
                Explore how our modular systems can optimize your space today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
               <Link 
                href={AppRoutes.Public.Contact}
                className="px-12 py-6 bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-secondary transition-all duration-500 shadow-2xl shadow-primary/20 flex items-center gap-4"
               >
                 Get A Free Quote
                 <ArrowRight size={16} />
               </Link>
               <Link 
                href="tel:+911242305657"
                className="px-12 py-6 bg-white text-secondary border-2 border-secondary/10 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:border-primary transition-all duration-500 flex items-center gap-4"
               >
                 Call Us Now
               </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
