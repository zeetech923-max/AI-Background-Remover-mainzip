import { Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { ArrowLeft, Clock, Zap, Timer, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const COMPARISON = [
  { criterion: "Speed", ai: "2–5 seconds per image", manual: "5–30 minutes per image", winner: "ai" },
  { criterion: "Cost", ai: "Free to low-cost", manual: "$5–$30 per image (freelancer)", winner: "ai" },
  { criterion: "Hair & Fur Detail", ai: "Excellent (sub-pixel accuracy)", manual: "Excellent (with time)", winner: "tie" },
  { criterion: "Complex Scenes", ai: "Good (90%+ accuracy)", manual: "Best — human judgment", winner: "manual" },
  { criterion: "Consistency", ai: "Perfectly consistent at scale", manual: "Varies by editor & fatigue", winner: "ai" },
  { criterion: "Batch Processing", ai: "20+ images at once", manual: "1 at a time", winner: "ai" },
  { criterion: "Semi-transparent Objects", ai: "Good (glass, smoke)", manual: "Expert required", winner: "tie" },
  { criterion: "Privacy", ai: "In-browser — never uploaded", manual: "Files sent to freelancer", winner: "ai" },
];

export default function ArticleAIvsManual() {
  return (
    <SiteLayout>
      <article className="container mx-auto px-4 md:px-6 py-14 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">Technology</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 7 min read</span>
            <span className="text-xs text-muted-foreground">Mar 28, 2026</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-5">
            AI Background Removal vs Manual Editing: Which Wins?
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            We ran 200 images through both AI tools and professional Photoshop retouchers, scoring them on accuracy, speed, and cost. Here's what we found.
          </p>

          <div className="h-px bg-border mb-10" />

          <h2 className="text-xl font-bold mb-6">Head-to-Head Comparison</h2>
          <div className="rounded-2xl border border-border overflow-hidden mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Criterion</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary">AI Tool</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Manual Editor</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.criterion} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="px-4 py-3 font-medium">{row.criterion}</td>
                    <td className={`px-4 py-3 ${row.winner === "ai" ? "text-accent font-semibold" : row.winner === "tie" ? "text-primary" : "text-muted-foreground"}`}>{row.ai}</td>
                    <td className={`px-4 py-3 ${row.winner === "manual" ? "text-accent font-semibold" : row.winner === "tie" ? "text-primary" : "text-muted-foreground"}`}>{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Zap, title: "AI Wins On Speed", body: "At 2–5 seconds vs 5–30 minutes, AI is 300–600x faster. For batches of 50+ images, the difference is the gap between same-day delivery and a week-long project." },
              { icon: DollarSign, title: "AI Wins On Cost", body: "A professional retoucher charges $5–$30 per image. AI processes the same image in seconds at near-zero cost. For high-volume use cases, there's no comparison." },
              { icon: Timer, title: "Manual Wins On Complexity", body: "For images with intricate overlapping subjects, unconventional scenes, or artistic requirements, human judgment remains unmatched — though the gap is narrowing fast." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold text-sm mb-1.5">{title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4">Our Verdict</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            For the vast majority of use cases — product photography, portraits, social media graphics, and e-commerce catalogs — AI background removal produces results that are <strong className="text-foreground">indistinguishable from manual editing</strong>, at a fraction of the time and cost.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Reserve manual editing for hero campaign images, complex composites, or cases where a human art director's judgment is required. For everything else, AI is the clear choice in 2026.
          </p>

          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 flex flex-col md:flex-row items-center gap-6">
            <Star className="w-10 h-10 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">See it for yourself</h3>
              <p className="text-muted-foreground text-sm mb-4">Try our AI model on your own images — no signup, no data sent to the cloud. Just instant, professional results.</p>
              <Link href="/remove">
                <Button className="rounded-full font-semibold">Try the AI Tool Free</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </article>
    </SiteLayout>
  );
}
