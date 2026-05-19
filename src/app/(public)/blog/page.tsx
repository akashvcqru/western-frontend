"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui";
import blogsData from "@/data/blogs.json";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  tags: string[];
}

export default function BlogLandingPage() {
  const blogs = blogsData as BlogPost[];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

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
            {filteredBlogs.map((post: BlogPost) => (
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
                      {post.excerpt}
                    </p>
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
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
