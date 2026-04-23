import { motion } from "framer-motion";
import { Link } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import {
  UploadCloud, Cpu, Download, Sparkles, Shield, Zap,
  ArrowRight, CheckCircle2, Image as ImageIcon, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    icon: UploadCloud,
    title: "Upload Your Image",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    details: [
      "Drag & drop any image onto the upload zone, or click to browse your files",
      "Supports PNG, JPG, JPEG, and WEBP up to 25MB per image",
      "Drop up to 20 images at once for batch processing",
      "Images from the landing page are passed directly to the tool — no re-upload needed",
    ],
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Processes Locally",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-500",
    details: [
      "The AI model (~50MB) is downloaded from a CDN once and cached in your browser",
      "On first use: model loads in ~3–5 seconds. Cached runs are near-instant",
      "A deep neural network generates a pixel-level foreground mask",
      "Edge refinement pass preserves hair, fur, and semi-transparent areas",
    ],
  },
  {
    number: "03",
    icon: Palette,
    title: "Customize Your Output",
    color: "from-pink-500/20 to-rose-600/10",
    iconColor: "text-pink-500",
    details: [
      "Preview the result on a transparent checkered background",
      "Apply a solid color background using the color picker or 10 quick-select presets",
      "Create a linear gradient with two color stops and a direction dial",
      "Upload your own custom background image for instant compositing",
    ],
  },
  {
    number: "04",
    icon: Download,
    title: "Download & Use",
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-500",
    details: [
      "Download as a high-resolution PNG with full transparency (alpha channel)",
      "When a background is applied, the composite is exported as a flat PNG",
      "Batch mode: download each result individually or use Download All",
      "Output resolution matches the source — no downscaling, no compression artifacts",
    ],
  },
];

const TECH = [
  { icon: Sparkles, title: "ONNX Runtime (WebAssembly)", body: "The AI model runs via the ONNX Runtime compiled to WebAssembly. This enables near-native inference speed inside a standard browser tab — no plugins or extensions needed." },
  { icon: Cpu, title: "U²-Net Architecture", body: "The underlying model uses a U²-Net variant — a two-level nested U-structure optimized for salient object detection. It produces cleaner masks than older segmentation approaches." },
  { icon: Shield, title: "Local Inference = Zero Upload", body: "Because the model runs on your machine, your images travel nowhere. There is no request to any server containing your image data at any point in the pipeline." },
  { icon: Zap, title: "Model Caching", body: "After the first use, the model weights are stored in your browser cache. Subsequent sessions load instantly from local storage — no waiting, no bandwidth used." },
];

export default function HowItWorks() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Professional results in 4 steps
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From upload to download in seconds — the entire process runs in your browser with no data ever leaving your device.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 mb-20">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-6 rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className={`md:w-56 flex-shrink-0 bg-gradient-to-br ${step.color} flex flex-col items-center justify-center p-8 gap-3`}>
                <div className={`w-16 h-16 rounded-2xl bg-white/80 dark:bg-black/20 flex items-center justify-center shadow-sm ${step.iconColor}`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <span className="text-4xl font-black text-foreground/10">{step.number}</span>
              </div>
              <div className="flex-1 p-6">
                <h2 className="text-xl font-bold mb-4">{step.title}</h2>
                <ul className="space-y-2.5">
                  {step.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Under the hood */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Under the hood</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">For the technically curious — here's exactly how BGRemover AI works at the infrastructure level.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {TECH.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 flex gap-4"
              >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-10 text-center">
          <ImageIcon className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to try it?</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Drop your first image and see the result in under 5 seconds — no signup, no install.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/remove">
              <Button size="lg" className="rounded-full font-semibold px-8 gap-2">
                Remove a Background <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="rounded-full font-semibold px-8">
                See All Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
