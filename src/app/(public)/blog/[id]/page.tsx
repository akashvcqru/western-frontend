"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MessageSquare, Sparkles, Phone, Mail, ShieldCheck } from "lucide-react";
import QuoteModal from "@/components/common/QuoteModal";
import siteContent from "@/data/site-content.json";
import { useGetBlogByIdOrSlugQuery } from "@/redux/api/blogsApi";

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const { data, isLoading, isError } = useGetBlogByIdOrSlugQuery(id);
  const post = data?.data ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ed1c27]/30 border-t-[#ed1c27] rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    notFound();
    return null;
  }

  // Placeholder product object for QuoteModal compatibility
  const productPlaceholder = {
    id: post.id,
    name: `Blog Inquiry: ${post.title}`,
    brand: "Western Interio Insights",
    images: [post.image],
    catNo: "BLOG"
  };

  return (
    <main className="bg-white min-h-screen pt-12 lg:pt-16 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Navigation Breadcrumb back link */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 hover:text-primary transition-all duration-300 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-primary" />
            Back to Articles
          </Link>
        </div>

        {/* Blog Main Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Rich Article Content (lg:col-span-8) */}
          <article className="lg:col-span-8 space-y-12">
            
            {/* Header Content */}
            <div className="space-y-6">
              {/* Category indicator & tags */}
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 border border-primary/20 text-primary text-[9px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">
                  {post.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-widest">
                  Western Interio Exclusive
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary tracking-tight leading-[1.15]">
                {post.title}
              </h1>

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary" />
                  {post.date}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-primary" />
                  {post.readTime}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-primary" />
                  By {post.author}
                </span>
              </div>
            </div>

            {/* Hero Cover Image Frame */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-2xl border border-neutral-100/50 bg-neutral-50 group">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.01] transition-transform duration-1000"
              />
            </div>

            {/* Rich Text Body */}
            <div className="prose prose-neutral max-w-none space-y-8 text-neutral-600 text-base sm:text-[17px] leading-relaxed font-normal">
              {post.content.map((paragraph, index) => (
                <p key={index} className="first-letter:text-3xl first-letter:font-semibold first-letter:text-primary first-letter:mr-1 first-letter:float-left first-letter:leading-none" style={{ contentVisibility: index > 1 ? "auto" : "visible" }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Custom tags footer list */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-10 border-t border-neutral-100 flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary" /> Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-neutral-50 text-neutral-500 border border-neutral-150 text-[9px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg hover:bg-neutral-100 hover:text-secondary transition-all"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          </article>

          {/* Right Column: Dynamic Context Sidebar (lg:col-span-4) */}
          <aside className="lg:col-span-4 space-y-12 sticky top-48">
            
            {/* Author details card */}
            <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary border-b border-neutral-200 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> About The Author
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg shadow-lg shadow-primary/5 shrink-0">
                  <ShieldCheck size={28} className="text-primary" />
                </div>
                <div className="leading-none min-w-0">
                  <h4 className="font-semibold text-sm text-secondary uppercase truncate">
                    {post.author}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1 truncate">
                    {post.authorRole}
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                This article has been researched, verified, and published directly by the Western Interio Corporate Administration. All architecture metrics represent official standards.
              </p>
            </div>

            {/* Smart High-Conversion Consulting CTA card */}
            <div className="bg-secondary text-white rounded-xl p-8 border border-neutral-800 space-y-6 shadow-2xl relative overflow-hidden group">
              {/* Decorative glows */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.05] pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 border border-primary/30 rounded-lg text-primary text-[9px] font-semibold uppercase tracking-[0.2em]">
                  <Sparkles size={11} className="text-primary animate-pulse" /> Consulting
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
                  Need a Customized Workspace Layout?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Receive a complimentary turnkey design consult for your office space. Share your design concepts with our Gurgaon architects.
                </p>
              </div>

              <div className="space-y-4 pt-2 relative z-10">
                <button
                  onClick={() => setIsQuoteOpen(true)}
                  className="w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/20 tracking-[0.2em] text-[9px] uppercase flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                >
                  <MessageSquare size={13} />
                  Book Design Consult
                </button>
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <a href={`tel:${siteContent.common.contact.phoneRaw}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone size={12} className="text-primary" /> {siteContent.common.contact.phone}
                  </a>
                  <a href={`mailto:${siteContent.common.contact.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Mail size={12} className="text-primary" /> {siteContent.common.contact.email}
                  </a>
                </div>
              </div>
            </div>

          </aside>

        </div>

      </div>

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        product={productPlaceholder as { id: string; name: string; images: string[]; brand: string; catNo: string }}
      />
    </main>
  );
}
