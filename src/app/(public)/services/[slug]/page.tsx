"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  Factory,
  Award,
  Zap,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import servicesData from "@/data/services.json";
import QuoteModal from "@/components/common/QuoteModal";
import siteContent from "@/data/site-content.json";
import Accordion from "@/components/ui/Accordion";

interface ServiceGridItem {
  icon: string;
  title: string;
  desc: string;
}

interface ServiceWorkflowItem {
  icon: string;
  step: string;
  title: string;
  desc: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface ChooseUsHighlight {
  title: string;
  desc: string;
}

interface ServiceDetail {
  id: string;
  slug: string;
  name: string;
  hero: {
    title: string;
    description: string;
    image: string;
  };
  philosophy: {
    title: string;
    description: string;
    image: string;
    grid: ServiceGridItem[];
  };
  workflow: ServiceWorkflowItem[];
  cta: {
    title: string;
    description: string;
  };
  faqs?: FAQItem[];
  chooseUs?: ChooseUsHighlight[];
}

export default function DynamicServicePage() {
  const params = useParams();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const slug = params?.slug as string;
  const serviceDetail = (servicesData as ServiceDetail[]).find(
    (s) => s.slug === slug,
  );

  // Fallback to main services directory if the slug is invalid
  if (!serviceDetail) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-bold text-secondary">Service not found</h2>
        <Link
          href="/services"
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  // Get dynamic Lucide icon
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Sparkles;
  };

  // Format title with HSL tailwind colors and highlight last word
  const highlightLastWord = (text: string) => {
    if (!text) return "";
    const words = text.trim().split(" ");
    if (words.length <= 1) return text;
    const lastWord = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-primary">{lastWord}</span>
      </>
    );
  };

  const formatTitle = (text: string) => {
    if (!text) return "";
    const parts = text.split("<br />");
    return parts.map((part, index) => {
      const isLast = index === parts.length - 1;
      return (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {isLast ? highlightLastWord(part) : part}
        </React.Fragment>
      );
    });
  };

  const serviceName = serviceDetail.name;
  const heroImage =
    serviceDetail.hero.image ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop";

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <Image
          src={heroImage}
          alt={serviceName}
          fill
          priority
          className="object-cover opacity-40 grayscale-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

        <div className="relative z-10 text-center space-y-8 max-w-5xl px-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">
              Service Excellence
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 uppercase">
            {formatTitle(serviceDetail.hero.title)}
          </h1>
          <p className="text-base lg:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {serviceDetail.hero.description}
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-neutral-50/50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-stretch">
            <div className="space-y-8">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  Design Philosophy
                </span>
                <h2 className="text-2xl lg:text-4xl font-bold text-secondary tracking-tight leading-tight uppercase">
                  {formatTitle(serviceDetail.philosophy.title)}
                </h2>
              </div>
              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                {serviceDetail.philosophy.description}
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {serviceDetail.philosophy.grid.map((item, i) => {
                  const Icon = getIconComponent(item.icon);
                  return (
                    <div
                      key={i}
                      className="p-6 rounded-xl bg-white border border-neutral-200 shadow-xl shadow-neutral-900/[0.03] hover:border-primary/40 hover:shadow-2xl hover:shadow-neutral-900/[0.06] transition-all duration-500 group"
                    >
                      <div className="w-12 h-12 bg-neutral-50 rounded-lg flex items-center justify-center text-primary border border-neutral-200 group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-4">
                        <Icon size={22} />
                      </div>
                      <h4 className="font-bold text-secondary text-lg mb-2 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-neutral-500 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative h-full min-h-[600px] rounded-xl overflow-hidden shadow-2xl shadow-neutral-200 border border-neutral-100/50">
              <Image
                src={serviceDetail.philosophy.image}
                alt={`${serviceName} Design Preview`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section (Standardized with rounded-lg/xl only) */}
      <section className="py-24 bg-white border-t border-neutral-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/5 px-4 py-1.5 rounded-lg inline-block">
              Core Credentials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-tight">
              Why Choose <span className="text-primary">Western Interio.</span>
            </h2>
            <p className="text-neutral-400 text-sm font-normal leading-relaxed max-w-xl mx-auto">
              We leverage direct factory operations, premium sourcing, and
              expert execution to deliver uncompromised quality on every single
              commercial contract.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceDetail.chooseUs?.map((item, i) => {
              const icons = [Factory, Shield, Award, Zap];
              const Icon = icons[i] || Shield;
              return (
                <div
                  key={i}
                  className="p-6 bg-neutral-50/50 border border-neutral-200/55 rounded-xl shadow-soft hover:shadow-premium hover:bg-white hover:border-primary/20 transition-all duration-500 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-secondary border border-neutral-150 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-secondary tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-neutral-500 leading-relaxed text-xs font-normal">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-primary uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 size={12} strokeWidth={2.5} /> Verified
                    Standard
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Execution Strategy
            </span>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight uppercase">
              Our <span className="text-primary">Workflow.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 relative">
            {serviceDetail.workflow.map((item, i) => {
              const Icon = getIconComponent(item.icon);
              return (
                <div
                  key={i}
                  className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-500 group relative z-10 shadow-2xl shadow-black/20"
                >
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8">
                    <Icon size={28} />
                  </div>
                  <div className="space-y-4">
                    <span className="text-primary font-black text-sm tracking-widest">
                      {item.step}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 font-medium leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section (Dynamic & Interactive Accordion) */}
      {serviceDetail.faqs && serviceDetail.faqs.length > 0 && (
        <section className="py-24 bg-neutral-50/50 relative overflow-hidden">
          <div className="max-w-[800px] mx-auto px-6 relative z-10">
            <div className="text-center space-y-4 mb-14">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/5 px-4 py-1.5 rounded-lg inline-block">
                Common Inquiries
              </span>
              <h2 className="text-3xl font-bold text-secondary uppercase tracking-tight">
                Frequently Asked{" "}
                <span className="text-primary">Questions.</span>
              </h2>
              <p className="text-neutral-400 text-sm font-normal leading-relaxed max-w-xl mx-auto">
                Got questions about the project lifecycle or technical limits?
                We have answers.
              </p>
            </div>

            <Accordion
              items={serviceDetail.faqs.map((faq) => ({
                title: faq.q,
                content: faq.a,
              }))}
            />
          </div>
        </section>
      )}

      {/* Upgraded CTA Section (Premium Glassmorphism & standard rounded-lg/xl borders only) */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Glow Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] bg-[radial-gradient(circle,rgba(237,28,39,0.06)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl border border-neutral-800 shadow-2xl relative overflow-hidden p-8 sm:p-12 lg:p-20 group">
            {/* Background image subtle overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
              <Image
                src={heroImage}
                alt="Luxury office interiors setup consultation"
                fill
                className="object-cover grayscale"
              />
            </div>

            {/* Abstract geometric mesh layout */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Heading and info */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-xl">
                    <Sparkles
                      size={12}
                      className="text-primary animate-pulse"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                      Corporate Consultation
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white uppercase">
                    {formatTitle(serviceDetail.cta.title)}
                  </h2>
                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                    {serviceDetail.cta.description}
                  </p>
                </div>

                {/* Trust Badges (ISO, 10-Yr, Factory Direct) */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    { label: "10-Year Warranty", icon: Shield },
                    { label: "ISO Certified Quality", icon: Award },
                    { label: "Gurgaon Direct Factory", icon: Factory },
                  ].map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 backdrop-blur-md"
                    >
                      <badge.icon size={13} className="text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Direct info list pills */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-neutral-300 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 leading-none">
                        Call Us
                      </p>
                      <a
                        href={`tel:${siteContent.common.contact.phoneRaw}`}
                        className="text-xs font-bold text-white leading-tight hover:text-primary transition-colors truncate"
                      >
                        {siteContent.common.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-neutral-300 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 leading-none">
                        Email Us
                      </p>
                      <a
                        href={`mailto:${siteContent.common.contact.email}`}
                        className="text-xs font-bold text-white leading-tight hover:text-primary transition-colors truncate"
                      >
                        {siteContent.common.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions panel */}
              <div className="lg:col-span-5 flex flex-col gap-5 w-full bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                  REQUEST WORKSPACE AUDIT
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Schedule a private tour of our Gurgaon manufacturing facility
                  or receive a personalized high-fidelity 2D/3D workspace layout
                  consultation.
                </p>

                <div className="space-y-4 pt-2">
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="w-full px-8 py-4 bg-primary text-white font-extrabold rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(237,28,39,0.3)] tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-3 cursor-pointer active:scale-98 group"
                  >
                    <span>Request Workspace Audit</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>

                  <Link
                    href="/contact"
                    className="w-full px-8 py-4 bg-white/5 border border-white/15 text-white font-extrabold rounded-lg hover:bg-white/20 transition-all duration-500 tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-center"
                  >
                    Contact Specialist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
