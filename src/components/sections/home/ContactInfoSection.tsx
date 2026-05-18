"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import siteContent from "@/data/site-content.json";

export default function ContactInfoSection() {
  const { common } = siteContent;

  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
         <Image 
           src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
           alt="bg"
           fill
           className="object-cover opacity-10 grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-24 lg:gap-16">
          <div className="space-y-10 group">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <MapPin size={28} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Headquarters</h3>
              <p className="text-lg text-gray-400 font-medium leading-relaxed font-sans">
                {common.contact.address}
              </p>
            </div>
          </div>

          <div className="space-y-10 group">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Phone size={28} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Direct Line</h3>
              <div className="space-y-2">
                <p className="text-xl font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer">{common.contact.phone}</p>
                {common.contact.phones.map((p: string, i: number) => (
                  <p key={i} className="text-xl font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer">{p}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10 group">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Mail size={28} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Digital Inquiry</h3>
              <div className="space-y-2">
                <p className="text-base font-semibold tracking-tight text-gray-400 hover:text-primary transition-colors cursor-pointer">{common.contact.email}</p>
                {common.contact.emails.map((e: string, i: number) => (
                  <p key={i} className="text-base font-semibold tracking-tight text-gray-400 hover:text-primary transition-colors cursor-pointer">{e}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
