"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useGetBlogsQuery } from "@/redux/api/blogsApi";
import type { BlogPost } from "@/types/api";

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

export default function BlogLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data, isLoading, isError } = useGetBlogsQuery({ limit: 100 });
  const blogs: BlogPost[] = data?.data ?? [];

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  return (
    <main className="bg-white min-h-screen">
      {/* Premium Hero Section */}
      <PageHeader
        bgImage="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
        badgeText="Western Interio Journal"
        titlePrefix="Insights &"
        titleHighlight="Space Innovation."
        subtitle="Explore our expert articles on workspace ergonomics, modular furniture engineering, and corporate interior design trends."
      />

      {/* Blogs Filter & Grid Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Glow Accents */}
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(237,28,39,0.03)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(237,28,39,0.02)_0%,transparent_75%)] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#ed1c27]/30 border-t-[#ed1c27] rounded-full animate-spin" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-24 text-neutral-400 text-sm">
              Failed to load blogs. Please try again later.
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && blogs.length === 0 && (
            <div className="text-center py-24 text-neutral-400 text-sm">
              No blog posts published yet. Check back soon.
            </div>
          )}

          {/* Content */}
          {!isLoading && !isError && blogs.length > 0 && (
            <>
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      selectedCategory === category
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "bg-neutral-50 text-neutral-500 border border-neutral-100 hover:bg-neutral-100 hover:text-secondary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Blogs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                {filteredBlogs.map((post: BlogPost) => {
                  // Parse links list
                  const parsedLinksList: { text: string; url: string }[] = [];
                  if (post.linkText && post.hyperlink) {
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

                  const hasInlineLink = parsedLinksList.length > 0 && parsedLinksList.some((link) =>
                    post.excerpt.toLowerCase().includes(link.text.toLowerCase())
                  );

                  return (
                    <article
                      key={post.id}
                      className="group bg-white rounded-xl overflow-hidden border border-neutral-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.05)] hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
                    >
                      {/* Visual Frame */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        {/* Glassmorphic Category Indicator */}
                        <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-secondary text-[9px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-neutral-100 shadow-md">
                          {post.category}
                        </span>
                      </div>

                      {/* Body Content */}
                      <div className="p-8 lg:p-10 flex flex-col justify-between flex-grow space-y-6">
                        <div className="space-y-4">
                          {/* Meta Indicators */}
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-primary" />
                              {post.date}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} className="text-primary" />
                              {post.readTime}
                            </span>
                          </div>

                          {/* Headline */}
                          <h3 className="text-xl lg:text-2xl font-semibold text-secondary leading-snug group-hover:text-primary transition-colors tracking-tight">
                            <Link href={`/blog/${post.id}`}>
                              {post.title}
                            </Link>
                          </h3>

                          {/* Excerpt */}
                          <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                            {renderTextWithLinks(post.excerpt, post.linkText, post.hyperlink)}
                          </p>

                          {/* Highlighted Hyperlink */}
                          {parsedLinksList.length > 0 && !hasInlineLink && (
                            <div className="pt-2 flex flex-wrap gap-2">
                              {parsedLinksList.map((link, i) => (
                                <a
                                  key={i}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-wide hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>{link.text}</span>
                                  <ArrowRight size={12} />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footing/Author Block */}
                        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                          {/* Author */}
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                              <ShieldCheck size={16} className="text-primary" />
                            </div>
                            <div className="leading-none min-w-0">
                              <h4 className="text-[11px] font-semibold text-secondary uppercase truncate">
                                {post.author}
                              </h4>
                              <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider mt-0.5 truncate">
                                {post.authorRole}
                              </p>
                            </div>
                          </div>

                          {/* Styled Link */}
                          <Link
                            href={`/blog/${post.id}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-50 text-secondary border border-neutral-100 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group/btn"
                            aria-label={`Read ${post.title}`}
                          >
                            <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  );
}
