import { Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { ArrowLeft, Clock, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    heading: "Why Background Matters in E-commerce",
    body: "Studies show that product images are the #1 factor in purchase decisions for online shoppers — ahead of reviews and price. A cluttered background distracts from the product, reduces perceived value, and increases returns because customers aren't sure what they're buying.",
  },
  {
    heading: "Amazon's Image Requirements",
    body: "Amazon mandates a pure white background (RGB 255,255,255) for the main product image, with the product filling 85%+ of the frame. Violating this can result in listing suppression. Use our tool to remove backgrounds, then export with a white fill in the background panel.",
  },
  {
    heading: "Shopify & DTC Store Best Practices",
    body: "Direct-to-consumer brands have more flexibility. Lifestyle images (on-model or in-context) perform well for fashion and home goods. Ghost mannequin images (transparent inside a garment) are the gold standard for apparel — achievable by removing the model's background.",
  },
  {
    heading: "eBay, Etsy & Marketplace Platforms",
    body: "These platforms are less strict, but clean backgrounds consistently outperform busy ones in click-through rate testing. A light gray (#f3f4f6) is a safe choice that reads as neutral in both dark and light-mode interfaces.",
  },
  {
    heading: "Image Dimensions and File Sizes",
    body: "Aim for a minimum of 1000×1000px (Amazon recommends 2000×2000px for zoom). Export as PNG for products with transparency and JPEG for solid-background images — JPEGs at 80–85% quality offer an ideal size-to-quality tradeoff for web use.",
  },
  {
    heading: "Batch Processing for Large Catalogs",
    body: "If you have a catalog of 50+ SKUs, manual editing is cost-prohibitive. Our batch processor handles up to 20 images simultaneously, all processed locally in your browser. The same background color is applied to every result in a single pass.",
  },
  {
    heading: "Social Commerce: Instagram, TikTok Shop",
    body: "Square (1:1) and vertical (4:5) formats dominate social feeds. Transparent backgrounds let you reuse the same product image across multiple platform-specific backgrounds without re-editing. Gradient backgrounds perform especially well on social, feeling current and premium.",
  },
];

export default function ArticleEcommerceGuide() {
  return (
    <SiteLayout>
      <article className="container mx-auto px-4 md:px-6 py-14 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">E-commerce</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 9 min read</span>
            <span className="text-xs text-muted-foreground">Apr 5, 2026</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-5">
            The Complete E-commerce Image Guide for 2026
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            From Amazon listings to Shopify storefronts — everything you need to know about image backgrounds, specs, and standards across every major selling platform.
          </p>

          <div className="h-px bg-border mb-10" />

          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary flex-shrink-0" />
                  {section.heading}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-6">
            <h3 className="font-bold text-base mb-3">Quick Reference: Platform Specs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { platform: "Amazon", bg: "White (#fff)", size: "2000×2000px" },
                { platform: "Shopify", bg: "Any (white recommended)", size: "2048×2048px" },
                { platform: "Etsy", bg: "Clean / lifestyle", size: "2000×2000px" },
              ].map(row => (
                <div key={row.platform} className="rounded-xl border border-border p-3 space-y-1">
                  <p className="font-semibold">{row.platform}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> {row.bg}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> {row.size}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/20 p-8 flex flex-col md:flex-row items-center gap-6">
            <ShoppingCart className="w-10 h-10 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Prepare your catalog now</h3>
              <p className="text-muted-foreground text-sm mb-4">Batch process all your product images — remove backgrounds and apply consistent white or colored backgrounds in seconds.</p>
              <Link href="/remove">
                <Button className="rounded-full font-semibold">Start Batch Processing</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </article>
    </SiteLayout>
  );
}
