"use client";

import React from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  MessageSquare,
  Globe,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFControl from "@/components/ui/inputs/RHFControl";
import { useAppToast } from "@/components/ui/AppToast";

import siteContent from "@/data/site-content.json";

const contactSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required").min(3, "Name too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  message: yup.string().required("Message is required").min(10, "Message too short"),
});

export default function ContactPage() {
  const { common, contactPage } = siteContent;
  const { addToast } = useAppToast();

  const methods = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: any) => {
    addToast({
      title: "Inquiry Sent",
      message: "Thank you for contacting us. We will get back to you shortly.",
      variant: "success",
    });
    methods.reset();
  };

  return (
    <main className="flex flex-col bg-white">
      {/* Hero Section - High Impact */}
      <section className="relative min-h-[85vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden bg-neutral-950 pt-32 pb-48 lg:py-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
          alt="Contact Western Interio"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-30 grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary via-secondary/70 to-transparent" />

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse delay-700" />

        <div className="relative z-10 text-center space-y-8 max-w-5xl px-4">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full">
            <Sparkles size={18} className="text-primary animate-spin-slow" />
            <span className="text-[11px] font-black tracking-[0.4em] text-white uppercase">
              {contactPage.hero.badge}
            </span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Let's <span className="text-primary">Talk.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Transforming your workspace starts with a conversation. <br className="hidden lg:block" />
            {contactPage.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Floating Contact Cards */}
      <section className="relative -mt-6 lg:-mt-12 z-20 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Phone size={32} />,
              label: "Phone Support",
              value: common.contact.phones.join(", "),
              sub: "Available Mon-Sat",
              action: `tel:${common.contact.phoneRaw}`
            },
            {
              icon: <Mail size={32} />,
              label: "Email Inquiry",
              value: common.contact.email,
              sub: "24/7 Response Time",
              action: `mailto:${common.contact.email}`
            },
            {
              icon: <MapPin size={32} />,
              label: "Our Office",
              value: "Gurugram, Haryana",
              sub: common.contact.locationShort,
              action: "#map"
            }
          ].map((card, i) => (
            <a
              key={i}
              href={card.action}
              className="group bg-white p-10 rounded-2xl shadow-premium border border-gray-100 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-sm group-hover:shadow-primary/40 group-hover:rotate-6">
                {card.icon}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">{card.label}</span>
                <h3 className="text-base font-medium text-secondary tracking-tight">{card.value}</h3>
                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">{card.sub}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Main Content - SaaS Layout */}
      <section className="py-32 lg:py-48 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-start">
            {/* Left side: Content */}
            <div className="space-y-16">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-secondary tracking-tight">
                  Expert Help for <br />Your Workspace.
                </h2>
                <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg">
                  Whether you're starting a new office project or upgrading your existing furniture, our team is here to provide professional guidance.
                </p>
              </div>

              {/* Contact Cards - Modern Grid */}
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-10 rounded-[32px] bg-neutral-50 border border-neutral-100 hover:border-primary/20 transition-all duration-500 group">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-secondary text-white group-hover:bg-primary transition-colors duration-500 mb-8 shadow-lg shadow-secondary/10 group-hover:shadow-primary/20">
                    <Phone size={24} />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">Call Us</h4>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-secondary">{common.contact.phone}</p>
                    {common.contact.phones.map((p: string) => (
                      <p key={p} className="text-base font-medium text-secondary">{p}</p>
                    ))}
                  </div>
                </div>

                <div className="p-10 rounded-[32px] bg-neutral-50 border border-neutral-100 hover:border-primary/20 transition-all duration-500 group">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-secondary text-white group-hover:bg-primary transition-colors duration-500 mb-8 shadow-lg shadow-secondary/10 group-hover:shadow-primary/20">
                    <Mail size={24} />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">Email Us</h4>
                  <p className="text-lg font-medium text-secondary break-all">{common.contact.email}</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-10 lg:p-12 rounded-[48px] bg-secondary text-white relative overflow-hidden group shadow-2xl shadow-secondary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row gap-10 md:items-center">
                  <MapPin size={48} className="text-primary group-hover:scale-110 transition-transform duration-700" />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-3">Our Facility</h4>
                    <p className="text-lg font-medium leading-relaxed opacity-90">{common.contact.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form - Premium Container */}
            <div className="relative group">
              <div className="relative bg-white p-8 lg:p-16 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-neutral-100 transition-all duration-700 hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)]">
                <div className="mb-16">
                  <h3 className="text-4xl font-bold text-secondary tracking-tight">
                    Start a Conversation
                  </h3>
                  <p className="text-gray-400 font-medium mt-3 text-lg">Tell us about your project requirements.</p>
                </div>

                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-12">
                    <RHFControl control="input" name="fullName" label="Full Name" placeholder="e.g. John Smith" />
                    <div className="grid md:grid-cols-2 gap-12">
                      <RHFControl control="input" name="email" label="Email Address" placeholder="john@company.com" type="email" />
                      <RHFControl control="input" name="phone" label="Phone Number" placeholder="+91 00000-00000" />
                    </div>
                    <RHFControl control="textarea" name="message" label="Project Details" placeholder="Describe your workspace vision..." />

                    <button
                      type="submit"
                      className="w-full bg-secondary text-white font-bold tracking-[0.2em] text-xs uppercase py-7 flex items-center justify-center gap-4 rounded-2xl hover:bg-primary transition-all duration-500 shadow-2xl shadow-secondary/10 hover:shadow-primary/30 group cursor-pointer active:scale-[0.98]"
                    >
                      SEND INQUIRY
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Simplified */}
      <section className="h-[600px] w-full bg-neutral-100 relative grayscale hover:grayscale-0 transition-all duration-1000">
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14030.73024856037!2d77.0142835!3d28.4590333!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19e9f6580f55%3A0x7d6f584f22a7f5a8!2sWestern%20Interio!5e0!3m2!1sen!2sin!4v1715500000000!5m2!1sen!2sin" 
            className="w-full h-full border-none"
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
         />
      </section>
    </main>
  );
}
