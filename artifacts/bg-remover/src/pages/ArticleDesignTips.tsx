import { Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { ArrowLeft, Clock, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIPS = [
  { title: "Start with a transparent background", body: "Always work with transparent PNG files as your base layer. This gives you full flexibility to place your subject on any background without destructive edits." },
  { title: "Match lighting direction across layers", body: "When compositing a product onto a new background, ensure the light source in your background matches the original lighting on your subject. Mismatched shadows are the #1 giveaway of an edited image." },
  { title: "Preserve shadow for realism", body: "Drop shadows anchored to the base of your subject add weight and ground the object. Even a subtle 10% opacity shadow makes the composition look three-dimensional." },
  { title: "Use color grading to unify the scene", body: "After placing your subject on a new background, apply a shared color grade (a slight warm or cool tint) to both layers. This makes them feel like they were shot together." },
  { title: "Keep edge anti-aliasing intact", body: "When exporting, always use PNG-24 to preserve soft anti-aliased edges. JPEG compression artifacts destroy fine hair and transparent areas at the edges of your subject." },
  { title: "Use negative space intentionally", body: "A transparent or solid background lets you direct the viewer's eye. Position your subject off-center following the rule of thirds, and leave breathing room for text overlays." },
  { title: "Batch process to maintain consistency", body: "For product catalogs, batch processing all images with the same background color ensures visual consistency across your store. Inconsistency in backgrounds reduces perceived brand quality." },
  { title: "Test on dark and light backgrounds", body: "Always preview your cut-out subject on both a dark and a light background before publishing. Edge fringing and halos are most visible at high contrast." },
  { title: "Choose background colors that flatter", body: "Complementary colors (opposite on the color wheel) create energy. Analogous colors (adjacent) create harmony. For product photos, neutral grays let the product color pop." },
  { title: "Export at 2x for Retina displays", body: "Always export images at double the display size. A 400×400 product tile should be exported at 800×800 for sharp rendering on high-DPI screens." },
];

export default function ArticleDesignTips() {
  return (
    <SiteLayout>
      <article className="container mx-auto px-4 md:px-6 py-14 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Design</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6 min read</span>
            <span className="text-xs text-muted-foreground">Apr 10, 2026</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-5">
            10 Pro Design Tips for Stunning Product Images
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Professional designers don't just remove backgrounds — they craft compelling visual stories. Here are ten tips used by top-tier retouchers and brand designers to make product images that stop thumbs and drive conversions.
          </p>

          <div className="h-px bg-border mb-10" />

          <div className="space-y-8">
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tip.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-primary/5 border border-primary/20 p-8 flex flex-col md:flex-row items-center gap-6">
            <Lightbulb className="w-10 h-10 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Ready to apply these tips?</h3>
              <p className="text-muted-foreground text-sm mb-4">Use BGRemover AI to get a perfect transparent PNG in seconds — then bring it to life with any background.</p>
              <Link href="/remove">
                <Button className="rounded-full font-semibold">Try it Now</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </article>
    </SiteLayout>
  );
}
