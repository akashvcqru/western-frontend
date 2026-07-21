"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MessageSquare, Sparkles, Phone, Mail, ShieldCheck } from "lucide-react";
import QuoteModal from "@/components/common/QuoteModal";
import siteContent from "@/data/site-content.json";
import { useSettings } from "@/hooks/useSettings";
import { useGetBlogByIdOrSlugQuery } from "@/redux/api/blogsApi";

const renderTextWithLinks = (text: string, linkText?: string, hyperlink?: string) => {
  if (!text) return "";

  const escapeRegExp = (str: string) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  // Pattern matching:
  // Group 1 & 2 & 3: [Anchor](URL)
  // Group 4: Raw HTTP/HTTPS URL
  // Group 5: Custom link text
  let regexStr = '(\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\))|((?:https?:\\/\\/|www\\.)[^\\s\\(\\)\\[\\]\\{\\}<>]+)';
  if (linkText && hyperlink) {
    regexStr += `|(${escapeRegExp(linkText)})`;
  }

  const regex = new RegExp(regexStr, 'gi');
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;

    // Add leading plain text
    if (matchIndex > currentIndex) {
      parts.push(text.substring(currentIndex, matchIndex));
    }

    if (match[1]) {
      // Markdown link: [Anchor](URL)
      const anchorText = match[2];
      const url = match[3];
      parts.push(
        <a
          key={matchIndex}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline hover:text-[#c5141e] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {anchorText}
        </a>
      );
    } else if (match[4]) {
      // Raw URL
      let url = match[4];
      const href = url.startsWith('www.') ? `https://${url}` : url;
      
      let displayUrl = url;
      let finalHref = href;
      const trailingPunctuation = /[.,;:?!]$/;
      const trailingMatch = displayUrl.match(trailingPunctuation);
      let trailingPart = "";
      if (trailingMatch) {
        displayUrl = displayUrl.slice(0, -1);
        finalHref = finalHref.slice(0, -1);
        trailingPart = trailingMatch[0];
      }

      parts.push(
        <a
          key={matchIndex}
          href={finalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline hover:text-[#c5141e] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {displayUrl}
        </a>
      );
      if (trailingPart) {
        parts.push(trailingPart);
      }
    } else if (match[5]) {
      // Custom link text
      const matchedText = match[5];
      parts.push(
        <a
          key={matchIndex}
          href={hyperlink!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline hover:text-[#c5141e] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {matchedText}
        </a>
      );
    }

    currentIndex = regex.lastIndex;
  }

  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
};

export default function BlogDetailPage({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { contact } = useSettings();

  const { data, isLoading, isError } = useGetBlogByIdOrSlugQuery(id);
  const post = data?.data ?? null;

  // Parse links list
  const parsedLinksList: { text: string; url: string }[] = [];
  if (post?.linkText && post?.hyperlink) {
    try {
      if (post.linkText.startsWith('[') && post.hyperlink.startsWith('[')) {
        const texts = JSON.parse(post.linkText) as string[];
        const urls = JSON.parse(post.hyperlink) as string[];
        texts.forEach((t, i) => {
          if (t.trim() && urls[i]?.trim()) {
            parsedLinksList.push({ text: t.trim(), url: urls[i].trim() });
          }
        });
      } else {
        parsedLinksList.push({ text: post.linkText, url: post.hyperlink });
      }
    } catch (e) {
      parsedLinksList.push({ text: post.linkText, url: post.hyperlink });
    }
  }

  const hasInlineLink = !!(
    parsedLinksList.length > 0 &&
    post?.content?.some((paragraph) =>
      parsedLinksList.some((link) =>
        paragraph.toLowerCase().includes(link.text.toLowerCase())
      )
    )
  );

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
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-2xl border border-neutral-100/50 group">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-fill rounded-xl block group-hover:scale-[1.005] transition-transform duration-500"
              />
            </div>

            {/* Rich Text Body */}
            <div className="prose prose-neutral max-w-none space-y-8 text-neutral-600 text-base sm:text-[17px] leading-relaxed font-normal [&_a]:text-primary [&_a]:font-semibold [&_a]:underline hover:[&_a]:text-[#c5141e] [&_a]:transition-colors [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:mx-auto [&_img]:object-contain [&_img]:shadow-lg">
              {post.content.map((paragraph, index) => {
                const isHtml = /^\s*<[a-zA-Z]/i.test(paragraph);
                if (isHtml) {
                  return (
                    <div
                      key={index}
                      style={{ contentVisibility: index > 1 ? "auto" : "visible" }}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  );
                }
                return (
                  <p key={index} style={{ contentVisibility: index > 1 ? "auto" : "visible" }}>
                    {renderTextWithLinks(paragraph, post.linkText, post.hyperlink)}
                  </p>
                );
              })}

              {parsedLinksList.length > 0 && !hasInlineLink && (
                <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Featured Links</span>
                    <p className="text-sm text-neutral-600 font-medium">Click the links below to visit resources related to this article.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {parsedLinksList.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-[#c5141e] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 cursor-pointer text-center"
                      >
                        <span>{link.text}</span>
                        <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
          <aside className="lg:col-span-4 space-y-6 sticky top-[max(6rem,calc(50vh-270px))]">
            
            {/* Author details card */}
            <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary border-b border-neutral-200 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> About The Author
              </h3>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg shadow-md shadow-primary/5 shrink-0">
                  <ShieldCheck size={22} className="text-primary" />
                </div>
                <div className="leading-none min-w-0">
                  <h4 className="font-semibold text-xs text-secondary uppercase truncate">
                    {post.author}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1 truncate">
                    {post.authorRole}
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                Researched, verified, and published directly by Western Interio Corporate Administration.
              </p>
            </div>

            {/* Smart High-Conversion Consulting CTA card */}
            <div className="bg-secondary text-white rounded-xl p-6 border border-neutral-800 space-y-4 shadow-2xl relative overflow-hidden group">
              {/* Decorative glows */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.05] pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="space-y-2.5 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/20 border border-primary/30 rounded-md text-primary text-[9px] font-semibold uppercase tracking-[0.2em]">
                  <Sparkles size={10} className="text-primary animate-pulse" /> Consulting
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white leading-snug">
                  Need a Customized Workspace Layout?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Get a free turnkey workspace design consult with our Gurgaon architects.
                </p>
              </div>

              <div className="space-y-3.5 pt-1 relative z-10">
                <button
                  onClick={() => setIsQuoteOpen(true)}
                  className="w-full px-5 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/20 tracking-[0.2em] text-[10px] uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageSquare size={13} />
                  Book Design Consult
                </button>
                <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <a href={`tel:${contact.phoneRaw}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone size={11} className="text-primary" /> {contact.phone}
                  </a>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Mail size={11} className="text-primary" /> {contact.email}
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
