import { Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { ArrowRight, Clock, Tag } from "lucide-react";

const ARTICLES = [
  {
    slug: "design-tips",
    href: "/articles/design-tips",
    category: "Design",
    title: "10 Pro Design Tips for Stunning Product Images",
    excerpt: "Learn how professional designers use transparent backgrounds, lighting tricks, and composition rules to make product images that convert.",
    readTime: "6 min read",
    date: "Apr 10, 2026",
    color: "from-blue-500/20 to-violet-500/20",
  },
  {
    slug: "ecommerce-guide",
    href: "/articles/ecommerce-guide",
    category: "E-commerce",
    title: "The Complete E-commerce Image Guide for 2026",
    excerpt: "From Amazon listings to Shopify storefronts — a deep dive into image specs, background standards, and how to stand out in crowded marketplaces.",
    readTime: "9 min read",
    date: "Apr 5, 2026",
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    slug: "ai-vs-manual",
    href: "/articles/ai-vs-manual",
    category: "Technology",
    title: "AI Background Removal vs Manual Editing: Which Wins?",
    excerpt: "We put AI-powered tools head to head against professional Photoshop retouchers. The results might surprise you.",
    readTime: "7 min read",
    date: "Mar 28, 2026",
    color: "from-orange-500/20 to-rose-500/20",
  },
];

const CATEGORIES = ["All", "Design", "E-commerce", "Technology"];

export default function Articles() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Articles</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Learn & Grow</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Guides, tutorials and insights to help you create better visuals and grow your business.
          </p>
        </motion.div>

        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${cat === "All" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={article.href}>
                <a className="group block rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden">
                  <div className={`h-36 bg-gradient-to-br ${article.color} flex items-center justify-center`}>
                    <Tag className="w-10 h-10 text-foreground/20" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{article.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                    </div>
                    <h2 className="font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors">{article.title}</h2>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.date}</span>
                      <span className="flex items-center gap-1 text-primary font-medium">Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
                    </div>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
