"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Globe,
  ArrowRight,
  ChevronDown,
  Award,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFControl from "@/components/ui/inputs/RHFControl";
import { useAppToast } from "@/components/ui/AppToast";
import { PageHeader } from "@/components/ui";

import siteContent from "@/data/site-content.json";

const contactSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required").min(3, "Name too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  message: yup.string().required("Message is required").min(10, "Message too short"),
});

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const { common, contactPage } = siteContent;
  const { addToast } = useAppToast();
  
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const methods = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (_data: ContactFormData) => {
    addToast({
      title: "Inquiry Sent",
      message: "Thank you for contacting us. We will get back to you shortly.",
      variant: "success",
    });
    methods.reset();
  };

  const faqs = [
    {
      question: "What areas do you serve for turnkey office interiors?",
      answer: "Our main manufacturing facility is based in Gurugram, Haryana. We provide complete workspace planning and professional turnkey interior decorations across the Delhi NCR region (including Gurugram, Delhi, Noida, Faridabad, and Ghaziabad) as well as PAN-India supply and installation for large-scale corporate projects."
    },
    {
      question: "Can I customize the dimensions and finishes of the furniture?",
      answer: "Absolutely! As direct manufacturers of premium modular office furniture, we specialize in tailor-made solutions. You can customize table-top dimensions, wood-grain finishes, acoustic fabric partition colors, and powder-coated steel understructures to match your company's aesthetic and branding guidelines."
    },
    {
      question: "What is your typical turnaround time for commercial orders?",
      answer: "For standard items like modular workstations, ergonomic office chairs, and executive tables, our typical production lead time is 10 to 15 business days. For extensive corporate interiors, false ceiling designs, and turnkey layout executions, timelines are tailored to your specific site roadmap and requirements."
    },
    {
      question: "Do you offer layout planning and 3D design consultations?",
      answer: "Yes, we provide professional 2D layout optimization and 3D architectural workspace planning. Our designers help you maximize seating capacity, configure smart collaboration zones, map optimal traffic flow, and select complementary furniture pieces before manufacturing begins."
    }
  ];

  return (
    <main className="flex flex-col bg-white overflow-hidden">
      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
        badge={
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full shadow-inner shadow-white/5 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.35em] text-white uppercase">
              {contactPage.hero.badge || "CONTACT US"}
            </span>
          </div>
        }
        titlePrefix="Let's Design"
        titleHighlight="Beyond."
        subtitle={`Transforming your workspace starts with a professional consultation. ${contactPage.hero.subtitle || ""}`}
      />

      {/* Modern High-End Floating Cards Panel */}
      <section className="relative -mt-16 lg:-mt-24 z-20 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Phone className="w-7 h-7" />,
              label: "Phone Support",
              title: "Direct Hotlines",
              values: common.contact.phones,
              sub: "Available Mon-Sat (09:30 - 18:30)",
              action: `tel:${common.contact.phones[0]}`,
              actionLabel: "Call Support"
            },
            {
              icon: <Mail className="w-7 h-7" />,
              label: "Email Inquiry",
              title: "Corporate Desk",
              values: [common.contact.email, ...common.contact.emails],
              sub: "Average Response Time: 2 Hours",
              action: `mailto:${common.contact.email}`,
              actionLabel: "Email Direct"
            },
            {
              icon: <MapPin className="w-7 h-7" />,
              label: "Our Office",
              title: "Corporate Facility",
              values: [common.contact.locationShort, "Gurugram, Haryana"],
              sub: "Plot No. 06, Kadipur Industrial Area",
              action: "#map",
              actionLabel: "Find on Map"
            }
          ].map((card, i) => (
            <div
              key={i}
              className="relative group bg-white rounded-xl p-8 lg:p-10 border border-neutral-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between min-h-[290px] overflow-hidden"
            >
              {/* Subtle hover color fade background */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.015] to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="space-y-6 relative z-10">
                {/* Custom icon container with offset shadows */}
                <div className="w-16 h-16 bg-neutral-50 flex items-center justify-center rounded-xl text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm relative overflow-hidden group-hover:shadow-[0_10px_25px_-5px_rgba(237,28,39,0.35)] group-hover:rotate-3">
                  {card.icon}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">{card.label}</span>
                  <h3 className="text-xl font-bold text-secondary tracking-tight">{card.title}</h3>
                  <div className="space-y-1 pt-1">
                    {card.values.map((val, idx) => (
                      <p key={idx} className="text-neutral-600 text-sm font-semibold tracking-tight">{val}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 relative z-10 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{card.sub}</span>
                <a
                  href={card.action}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest group/link"
                >
                  <span>{card.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-24 lg:py-36 relative overflow-hidden bg-neutral-50/40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left side: Premium Brand & Hours Info Panel */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Premium Manufacturer
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-tight tracking-tight uppercase">
                  Let&apos;s Discuss <br />
                  <span className="text-neutral-500">Your Workspace.</span>
                </h2>
                <p className="text-neutral-500 text-base md:text-lg font-medium leading-relaxed max-w-lg">
                  Whether planning a fresh office layout, expanding your seating capacities, or designing custom modular partitions, our commercial workspace consultants provide complete end-to-end guidance.
                </p>
              </div>

              {/* Quality Badges */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-white border border-neutral-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-primary shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">20+ Years</h4>
                    <p className="text-[11px] text-neutral-400 font-semibold uppercase leading-tight">Design Legacy</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white border border-neutral-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Premium</h4>
                    <p className="text-[11px] text-neutral-400 font-semibold uppercase leading-tight">ISO Materials</p>
                  </div>
                </div>
              </div>

              {/* Business Hours Information */}
              <div className="p-8 lg:p-10 rounded-xl bg-secondary text-white relative overflow-hidden group shadow-xl">
                {/* SVG pattern background */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-[size:1.5rem_1.5rem]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">BUSINESS HOURS</h4>
                      <p className="text-sm font-bold opacity-95">{common.businessHours.notice}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="opacity-70 uppercase tracking-widest text-xs">Standard Timing</span>
                    <span className="bg-white/10 px-4.5 py-1.5 rounded-xl text-xs font-bold tracking-wider">{common.businessHours.display}</span>
                  </div>
                  
                  <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                    * Visitors are highly encouraged to schedule a showroom/factory visitation in advance for dedicated design consults.
                  </p>
                </div>
              </div>

              {/* Pan-India Delivery Ribbon */}
              <div className="p-6 rounded-xl bg-neutral-100/60 border border-neutral-200/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-neutral-500" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Pan-India Cargo Shipping</span>
                </div>
                <span className="text-[10px] bg-neutral-200 text-neutral-600 px-3 py-1 rounded-lg font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>

            {/* Right side: Modern Glassmorphic Form Panel */}
            <div className="lg:col-span-7 relative group">
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative bg-white/95 backdrop-blur-md p-8 lg:p-12 rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.07)] border border-neutral-100 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.11)]">
                <div className="mb-10">
                  <h3 className="text-2xl md:text-3xl font-black text-secondary uppercase tracking-tight">
                    Start a Conversation
                  </h3>
                  <p className="text-neutral-400 font-semibold mt-2 text-sm md:text-base leading-relaxed">
                    Share your office concept or layouts. Our furniture engineers will analyze and revert within 2 hours.
                  </p>
                </div>

                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                    <RHFControl
                      control="input"
                      name="fullName"
                      label="Full Name"
                      placeholder="e.g. Rahul Verma"
                      className="rounded-xl border-neutral-200 focus:border-primary/80 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium py-3 px-4"
                    />
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <RHFControl
                        control="input"
                        name="email"
                        label="Email Address"
                        placeholder="rahul@company.com"
                        type="email"
                        className="rounded-xl border-neutral-200 focus:border-primary/80 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium py-3 px-4"
                      />
                      <RHFControl
                        control="input"
                        name="phone"
                        label="Phone Number"
                        placeholder="e.g. +91 99999-99999"
                        className="rounded-xl border-neutral-200 focus:border-primary/80 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium py-3 px-4"
                      />
                    </div>
                    
                    <RHFControl
                      control="textarea"
                      name="message"
                      label="Workspace Requirements"
                      placeholder="Share a brief overview of your office furniture needs (workstations, desk configurations, design themes, seating quantity)..."
                      className="rounded-xl border-neutral-200 focus:border-primary/80 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium py-3.5 px-4 min-h-[120px]"
                    />

                    <button
                      id="submit-contact-form"
                      type="submit"
                      className="w-full bg-secondary text-white font-bold tracking-[0.25em] text-xs uppercase py-5 flex items-center justify-center gap-3 rounded-xl hover:bg-primary transition-all duration-500 shadow-lg shadow-secondary/10 hover:shadow-primary/20 group cursor-pointer active:scale-[0.98] mt-4"
                    >
                      <span>SEND INQUIRY</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </button>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-24 relative overflow-hidden bg-white border-t border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase bg-primary/5 px-4 py-1.5 rounded-lg inline-block">
              COMMON INQUIRIES
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-sm font-semibold leading-relaxed">
              Find quick answers regarding our custom design process, lead times, cargo shipping, and workspace layouts.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-xl border transition-all duration-300 overflow-hidden bg-white",
                    isOpen 
                      ? "border-primary/30 shadow-[0_15px_30px_-15px_rgba(237,28,39,0.06)]" 
                      : "border-neutral-200/70 hover:border-neutral-300 shadow-sm"
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 cursor-pointer"
                  >
                    <span className={cn(
                      "font-bold text-base md:text-lg transition-colors duration-300 tracking-tight",
                      isOpen ? "text-primary" : "text-secondary"
                    )}>
                      {faq.question}
                    </span>
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                      isOpen ? "bg-primary text-white rotate-180" : "bg-neutral-50 text-secondary hover:bg-neutral-100"
                    )}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr] opacity-100 border-t border-neutral-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="p-6 md:p-8 text-neutral-500 text-sm md:text-base leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Google Map Section with Elegant Frame and Floating Card */}
      <section className="h-[600px] w-full relative group" id="map">
        {/* Soft overlay mask for smooth layout blend */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent z-10" />
        
        {/* Floating directions card on the map (desktop only) */}
        <div className="absolute top-10 left-10 z-20 max-w-sm bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 hidden md:block group hover:scale-[1.02] transition-transform duration-500">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 min-w-[48px] min-h-[48px] bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-1">Our Facility</h4>
                <h3 className="text-base font-bold text-secondary tracking-tight">Western Interio Factory</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">{common.contact.address}</p>
              <a 
                href="https://maps.app.goo.gl/wJk4zX92vU7vG949A"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors group/link pt-1"
              >
                <span>Get Directions</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14030.73024856037!2d77.0142835!3d28.4590333!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19e9f6580f55%3A0x7d6f584f22a7f5a8!2sWestern%20Interio!5e0!3m2!1sen!2sin!4v1715500000000!5m2!1sen!2sin" 
          className="w-full h-full border-none filter grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Western Interio Gurugram Location Map"
        />
      </section>
    </main>
  );
}

