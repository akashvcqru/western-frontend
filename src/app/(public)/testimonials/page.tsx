"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Quote, 
  Star, 
  MessageSquare, 
  Check, 
  Sparkles, 
  Building2, 
  HelpCircle,
  TrendingUp,
  Clock,
  VolumeX
} from "lucide-react";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import siteContent from "@/data/site-content.json";
import { AppModal, Accordion, PageHeader } from "@/components/ui";
import RHFControl from "@/components/ui/inputs/RHFControl";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetTestimonialsQuery, useCreateTestimonialMutation } from "@/redux/api/testimonialsApi";

// Validation schema for testimonials
const testimonialSchema = yup.object().shape({
  author: yup.string().required("Your name is required").min(3, "Name must be at least 3 characters"),
  designation: yup.string().required("Your job title is required"),
  company: yup.string().required("Company name is required"),
  category: yup.string().required("Please select a project category"),
  quote: yup.string().required("Feedback is required").min(10, "Please write at least 10 characters"),
});

type TestimonialFormValues = {
  author: string;
  designation: string;
  company: string;
  category: string;
  quote: string;
};

interface Testimonial {
  author: string;
  designation: string;
  company: string;
  category: string;
  quote: string;
  rating: number;
}

export default function TestimonialsPage() {
  const { testimonialsPage } = siteContent;

  const { data: categoriesResult } = useGetCategoriesQuery({ limit: 100 });

  const categoriesList = React.useMemo(() => {
    return categoriesResult?.data?.filter(c => c.status === "Active") || [];
  }, [categoriesResult]);

  const categoryOptions = React.useMemo(() => {
    const options = [{ label: "Select Category", value: "" }];
    categoriesList.forEach(cat => {
      options.push({ label: cat.name, value: cat.slug || cat.id });
    });
    return options;
  }, [categoriesList]);

  const { data: testimonialsResult } = useGetTestimonialsQuery();
  const [createTestimonial] = useCreateTestimonialMutation();

  const testimonialsList = React.useMemo(() => {
    return testimonialsResult?.data || [];
  }, [testimonialsResult]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Form setup
  const methods = useForm<TestimonialFormValues>({
    resolver: yupResolver(testimonialSchema) as Resolver<TestimonialFormValues>,
    defaultValues: {
      author: "",
      designation: "",
      company: "",
      category: "",
      quote: "",
    }
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      await createTestimonial({
        author: data.author,
        designation: data.designation,
        company: data.company,
        quote: data.quote,
        rating: selectedRating,
        category: data.category,
      }).unwrap();

      setFormSuccess(true);

      // Reset states after complete animation
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(false);
        methods.reset();
        setSelectedRating(5);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  // Filter definitions
  const categories = React.useMemo(() => {
    const list = [{ id: "all", label: "All Projects" }];
    categoriesList.forEach(cat => {
      list.push({ id: cat.slug || cat.id, label: cat.name });
    });
    return list;
  }, [categoriesList]);

  // Dynamic counter
  const getCount = (catId: string) => {
    if (catId === "all") return testimonialsList.length;
    return testimonialsList.filter((t) => t.category === catId).length;
  };

  // Filtered Testimonials
  const filteredTestimonials = selectedCategory === "all"
    ? testimonialsList
    : testimonialsList.filter((t) => t.category === selectedCategory);

  // Initial generator for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // FAQs Database
  const faqs = [
    {
      q: "Can you customize modular office furniture to our specific brand colors?",
      a: "Yes! All of our office desking, partitions, storage, and cafeteria series can be fully customized in alignment with your corporate brand guidelines, color palettes, materials, and dimension specifications."
    },
    {
      q: "What is the typical lead time for a large-scale office setup?",
      a: "Our typical delivery and installation timeline ranges from 2 to 3 weeks, depending on the scale and custom designs. We specialize in fast-track modular assembly to minimize your workplace transition time."
    },
    {
      q: "Do you offer layout planning and space optimization services?",
      a: "Absolutely! We provide high-fidelity 2D and 3D layout planning and space utilization consultations. Our workspace architects will evaluate your corporate footprint to engineer the most productive floor plan layout."
    },
    {
      q: "What kind of warranty do you provide on office chairs and workstations?",
      a: "All premium office chairs, executive desks, and modular partition systems manufactured by Western Interio come with a comprehensive 3 to 5-year warranty, supported by our responsive local support team."
    }
  ];

  return (
    <main className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
        badgeText={testimonialsPage.hero.badge}
        title={
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase"
            dangerouslySetInnerHTML={{ __html: testimonialsPage.hero.title }}
          />
        }
        subtitle={testimonialsPage.hero.subtitle}
      />

      {/* Featured Enterprise Case Study Banner */}
      <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 -mt-10 relative z-30 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 md:p-12 lg:p-14 rounded-xl border border-neutral-800 shadow-2xl relative overflow-hidden group">
          {/* Subtle light leak */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Case details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                <Building2 size={13} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Enterprise Success Story</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  NextGen Systems: <br className="hidden md:inline" /> 
                  <span className="text-neutral-400">A Noise-Free Agile Corporate Hub.</span>
                </h3>
                <div className="relative">
                  <Quote size={80} className="absolute -left-6 -top-8 text-white/5 pointer-events-none" strokeWidth={1} />
                  <p className="text-lg md:text-xl text-white italic leading-relaxed font-normal relative z-10 pl-2">
                    &quot;The quality of the modular partitions is top-notch. It gave our office a modern and premium look while maintaining absolute workspace acoustic privacy. Perfect execution by Western Interio.&quot;
                  </p>
                </div>
              </div>
              
              {/* Context */}
              <p className="text-sm text-neutral-350 leading-relaxed font-normal max-w-2xl">
                We manufactured and installed over 500 desking workstations and integrated acoustic double-glazed glass partition systems across a 15,000 sq ft floor plan. Delivered completely turnkey in record timeline.
              </p>

              {/* Author footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-neutral-800/80">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-rose-600 flex items-center justify-center font-bold text-white shadow-lg">
                  VM
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm tracking-wide uppercase">Vikram Malhotra</h5>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Facility Manager, NextGen Systems</p>
                </div>
              </div>
            </div>

            {/* Structured Stats Panels */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: <TrendingUp size={20} />, value: "15,000+", label: "Sq Ft Transformed" },
                { icon: <Clock size={20} />, value: "45 Days", label: "Record Timeline" },
                { icon: <Building2 size={20} />, value: "500+", label: "Workstations Setup" },
                { icon: <VolumeX size={20} />, value: "98%", label: "Acoustic Insulation" }
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-500 group-hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="text-primary mb-3">{stat.icon}</div>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{stat.value}</h4>
                  <p className="text-[10px] font-bold text-neutral-300 tracking-wider uppercase mt-1 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Project Filter Bar */}
      <section className="py-5 bg-neutral-50/60 border-y border-neutral-100 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 font-bold uppercase tracking-wider text-xs">Filter By Project:</span>
            <div className="h-4 w-px bg-neutral-200 hidden md:block" />
          </div>

          {/* Horizontal scrollable categories selector */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar mask-fade">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              const count = getCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] whitespace-nowrap shrink-0 transition-all duration-300 cursor-pointer ${
                    active 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900"
                  }`}
                >
                  {cat.label} 
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                    active ? "bg-white text-primary" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Interactive Cards Grid */}
      <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-neutral-50/40 relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-neutral-100 shadow-sm space-y-4 max-w-lg mx-auto">
              <MessageSquare size={48} className="text-neutral-300 mx-auto" />
              <h4 className="font-bold text-neutral-800 text-xl">No reviews yet</h4>
              <p className="text-neutral-700 text-sm font-normal">Be the first to share your experience with modular installations.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-primary text-white rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-neutral-900 hover:shadow-lg transition-all"
              >
                Submit Feedback
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {filteredTestimonials.map((t, i) => (
                <div 
                  key={i} 
                  className="bg-white p-8 md:p-10 rounded-xl border border-neutral-100 flex flex-col justify-between space-y-8 relative group hover:border-primary/20 hover:shadow-[0_30px_70px_-15px_rgba(237,28,39,0.08)] hover:-translate-y-2.5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 duration-700 h-full"
                >
                  {/* Decorative background quote mark */}
                  <div className="absolute top-8 right-8 text-primary/5 group-hover:text-primary/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
                     <Quote size={90} strokeWidth={0.5} />
                  </div>

                  {/* Top rating & tags */}
                  <div className="space-y-5 relative z-10">
                    <div className="flex justify-between items-center">
                      {/* Rating Stars */}
                      <div className="flex gap-1 text-primary">
                        {[...Array(5)].map((_, idx) => (
                          <Star 
                            key={idx} 
                            size={15} 
                            fill={idx < t.rating ? "currentColor" : "none"} 
                            className={idx < t.rating ? "" : "text-neutral-200"}
                            strokeWidth={idx < t.rating ? 0 : 1.5} 
                          />
                        ))}
                      </div>

                      {/* Tag badges */}
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full font-bold uppercase tracking-widest text-[9px]">
                        {categoriesList.find(c => (c.slug || c.id) === t.category || c.id === t.category)?.name || 
                         (t.category === "workstations" ? "Desking Series" : 
                          t.category === "chairs" ? "Seating Series" : 
                          t.category === "partitions" ? "Partitions" : 
                          t.category === "turnkey" ? "Turnkey Space" : 
                          t.category)}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-neutral-800 text-base leading-relaxed font-normal tracking-wide italic">
                      &quot;{t.quote}&quot;
                    </p>
                  </div>

                  {/* Author metadata footer */}
                  <div className="pt-6 border-t border-neutral-50 flex items-center gap-4 relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-neutral-800 text-white flex items-center justify-center font-extrabold shrink-0 group-hover:from-primary group-hover:to-rose-600 transition-all duration-500 shadow-md group-hover:shadow-primary/20">
                      {getInitials(t.author)}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-neutral-800 uppercase tracking-tight text-sm truncate">{t.author}</h4>
                        <Check size={14} className="text-green-500 shrink-0 bg-green-50 rounded-full p-0.5 border border-green-100" />
                      </div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none truncate">{t.designation}</p>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none truncate">{t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Conversion Banner */}
      <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
           <div className="bg-neutral-950 p-8 md:p-12 lg:p-16 rounded-xl relative overflow-hidden shadow-2xl shadow-neutral-900/10">
              {/* Background red visual flare */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-[linear-gradient(115deg,rgba(237,28,39,0.06),transparent_80%)] pointer-events-none" />
              
              <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
                 <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Corporate Trust</span>
                      <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                         Transforming Workspace <br className="hidden md:inline" /> 
                         Aesthetics Across <span className="text-primary">1000+</span> Offices.
                      </h2>
                    </div>
                    <p className="text-neutral-300 text-sm md:text-base font-normal leading-relaxed max-w-xl">
                       Startups to conglomerate enterprises rely on Western Interio to plan, manufacture, and erect beautiful, productive corporate spaces. Work with us to design beyond.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                      <Link href="/contact" className="px-10 py-4.5 bg-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/20 text-center">
                         Contact Consult
                      </Link>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-10 py-4.5 bg-white/5 text-white border border-white/10 font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white hover:text-black hover:border-transparent transition-all duration-500 text-center"
                      >
                         Leave Review
                      </button>
                    </div>
                 </div>

                 {/* Pan India Delivery stats */}
                 <div className="lg:col-span-5 grid grid-cols-2 gap-6">
                    {[
                       { label: "Client Retainment", value: "85%" },
                       { label: "Completed Projects", value: "1000+" },
                       { label: "Pan India Delivery", value: "30+ Cities" },
                       { label: "Corporate Services", value: "5 major" }
                    ].map((stat, i) => (
                       <div key={i} className="p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md">
                          <h4 className="text-3xl font-extrabold text-primary tracking-tight">{stat.value}</h4>
                          <p className="text-[10px] font-extrabold text-neutral-350 uppercase tracking-widest leading-normal mt-1">{stat.label}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-neutral-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-100 rounded-full text-neutral-600">
              <HelpCircle size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Got Questions?</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-800 tracking-tight leading-tight">Testimonials FAQ</h2>
            <p className="text-neutral-700 text-sm font-normal max-w-md mx-auto">Common answers to modular furniture custom orders, lead times, and layouts.</p>
          </div>

          <Accordion 
            items={faqs.map((faq) => ({
              title: faq.q,
              content: faq.a
            }))} 
          />
        </div>
      </section>

      {/* Floating Action Button (FAB) review submission */}
      <div className="fixed bottom-24 right-6 z-[80]">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-4.5 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-neutral-900 shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all duration-300 cursor-pointer group"
        >
          <Sparkles size={16} className="text-white animate-pulse group-hover:rotate-12 transition-transform" />
          <span>Share Experience</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </button>
      </div>

      {/* Share Experience Review Modal Form */}
      <AppModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary animate-pulse" size={18} />
            <span className="font-bold text-base md:text-lg text-neutral-950 tracking-tight">Review submission Form</span>
          </div>
        }
        size="lg"
        hideFooter
      >
        <div className="relative">
          {formSuccess ? (
            /* Success confirmation screen */
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in fade-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-50 text-green-500 border border-green-100 flex items-center justify-center shadow-inner relative">
                <Check size={40} className="stroke-[3]" />
                <span className="absolute inset-0 rounded-full animate-ping bg-green-500/20 pointer-events-none" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-neutral-800">Thank You So Much!</h4>
                <p className="text-neutral-700 text-sm font-normal max-w-sm mx-auto">
                  Your feedback has been successfully submitted and sent to the admin panel for review. Once approved, it will appear on our testimonials showcase list. We appreciate your partnership!
                </p>
              </div>
            </div>
          ) : (
            /* Submission Form Content */
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 pt-2">
                
                {/* Rating Input Selector */}
                <div className="space-y-2 pb-2">
                  <label className="block text-xs font-black text-neutral-700 uppercase tracking-widest">
                    Your Rating Selection
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= (hoveredRating || selectedRating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setSelectedRating(star)}
                            className="p-1 cursor-pointer transition-transform duration-200 active:scale-125 focus:outline-none"
                          >
                            <Star 
                              size={28} 
                              fill={active ? "#ed1c27" : "none"} 
                              className={active ? "text-primary animate-in zoom-in duration-100" : "text-neutral-300"} 
                              strokeWidth={active ? 0 : 1.5}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      {selectedRating} out of 5 stars
                    </span>
                  </div>
                </div>

                {/* Form fields layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RHFControl 
                    control="input" 
                    name="author" 
                    label="Client Name" 
                    placeholder="e.g. Rajesh Khanna" 
                  />
                  <RHFControl 
                    control="input" 
                    name="designation" 
                    label="Job Title" 
                    placeholder="e.g. Operations Head" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RHFControl 
                    control="input" 
                    name="company" 
                    label="Company Name" 
                    placeholder="e.g. Tech Innovations Pvt Ltd" 
                  />
                  
                  {/* Select options */}
                  <RHFControl 
                    control="select" 
                    name="category" 
                    label="Project Category Type" 
                    options={categoryOptions}
                  />
                </div>

                <RHFControl 
                  control="textarea" 
                  name="quote" 
                  label="Share Your Experience (Testimonial)" 
                  placeholder="Share a detailed overview of your project, product durability, installation experience, and team performance..." 
                />

                <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 rounded-lg font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-primary text-white hover:bg-neutral-900 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 cursor-pointer flex items-center gap-2"
                  >
                    <Check size={14} className="stroke-[2.5]" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            </FormProvider>
          )}
        </div>
      </AppModal>
    </main>
  );
}
