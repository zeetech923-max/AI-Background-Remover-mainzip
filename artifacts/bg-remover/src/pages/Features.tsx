import { motion } from "framer-motion";
import { Link } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import {
  Sparkles, Layers, Image as ImageIcon, CheckCircle2, Zap, Shield,
  RefreshCw, Palette, Package, Eye, Clock, Cpu, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Next-Gen AI Model",
    desc: "Our v2.0 neural network is trained on 50+ million diverse images — portraits, products, vehicles, animals, and more. It understands scene context, not just edges.",
    tag: "Core",
  },
  {
    icon: Layers,
    title: "Hair & Fur Precision",
    desc: "Sub-pixel accuracy on individual strands of hair, fur, and fine filaments. No more jagged halos or blurry edges. Even backlit hair against bright skies is handled cleanly.",
    tag: "Accuracy",
  },
  {
    icon: Eye,
    title: "Semi-Transparent Objects",
    desc: "Glass, smoke, water droplets, tulle fabric — areas with partial transparency are preserved naturally. The AI detects opacity levels and blends them into the output.",
    tag: "Accuracy",
  },
  {
    icon: Cpu,
    title: "100% In-Browser Processing",
    desc: "Our WebAssembly-powered ONNX runtime runs the full AI model on your device. Your images are never uploaded — everything happens locally at GPU-class speed.",
    tag: "Privacy",
  },
  {
    icon: Shield,
    title: "Zero Data Retention",
    desc: "Since processing is local, there is nothing to retain. We have no server-side image pipeline — your original files and outputs exist only in your browser's memory.",
    tag: "Privacy",
  },
  {
    icon: Package,
    title: "Batch Processing (up to 20)",
    desc: "Upload a batch of up to 20 images at once. They're queued and processed sequentially in the background while you work. Download any result individually or all at once.",
    tag: "Workflow",
  },
  {
    icon: Palette,
    title: "Background Replacement",
    desc: "Replace the removed background with a solid color, a custom linear gradient (with full color + direction control), or any custom image — directly in the tool.",
    tag: "Design",
  },
  {
    icon: CheckCircle2,
    title: "High-Resolution PNG Export",
    desc: "Output is always the full resolution of the source image, saved as PNG-24 with a genuine alpha channel. No lossy compression, no resolution caps.",
    tag: "Export",
  },
  {
    icon: ImageIcon,
    title: "Before / After Comparison Slider",
    desc: "An interactive drag-to-compare slider lets you inspect exactly how the AI performed against the original. Zoom in to check fine edge quality before downloading.",
    tag: "UX",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    desc: "Most images complete in 2–5 seconds. Model weights are cached after the first run, so subsequent images process even faster without any additional loading time.",
    tag: "Performance",
  },
  {
    icon: RefreshCw,
    title: "Works With Any Subject",
    desc: "Portraits, product photography, pets, cars, food, packaging — the model generalises broadly. If there's a distinguishable subject in the photo, it will find and extract it.",
    tag: "Versatility",
  },
  {
    icon: Clock,
    title: "No Sign-Up Required",
    desc: "Open the tool and start immediately. No account, no API key, no credit card. Just drop an image and get a result in seconds.",
    tag: "Accessibility",
  },
];

const TAG_COLORS: Record<string, string> = {
  Core: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Accuracy: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Privacy: "bg-green-500/10 text-green-600 dark:text-green-400",
  Workflow: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Design: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  Export: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  UX: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Performance: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Versatility: "bg-red-500/10 text-red-600 dark:text-red-400",
  Accessibility: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

export default function Features() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Everything you need.<br className="hidden md:block" /> Nothing you don't.
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            BGRemover AI is built from the ground up for professional-quality results — with no bloat, no subscriptions, and no compromises on accuracy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[f.tag] ?? "bg-muted text-muted-foreground"}`}>
                  {f.tag}
                </span>
              </div>
              <h3 className="font-bold text-base mb-1.5">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">See all features in action</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Upload any image and experience the precision for yourself — no signup needed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/remove">
              <Button size="lg" className="rounded-full font-semibold px-8 gap-2">
                Try it Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="rounded-full font-semibold px-8">
                How it works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
