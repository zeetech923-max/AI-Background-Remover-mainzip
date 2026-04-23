import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud, CheckCircle2, Sparkles, Layers, Zap, Shield,
  Image as ImageLucide, ArrowRight, ChevronRight
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SiteLayout from "@/components/SiteLayout";

export default function Home() {
  const [, navigate] = useLocation();
  const heroFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      import("@/lib/pending-file").then(({ setPendingFile }) => {
        setPendingFile(file);
        navigate("/remove");
      });
    }
  };
  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      import("@/lib/pending-file").then(({ setPendingFile }) => {
        setPendingFile(file);
        navigate("/remove");
      });
    }
    e.target.value = "";
  };

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
              <motion.div variants={fadeIn}>
                <Badge variant="secondary" className="mb-6 px-3 py-1 rounded-full text-primary bg-primary/10 hover:bg-primary/20 border-primary/20 font-medium">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                  v2.0 AI Model is Live
                </Badge>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Remove Image Backgrounds{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Instantly with AI</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Upload any photo and get a perfectly transparent background in less than 3 seconds. Flawless cutouts, preserving hair and fine edges.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button size="lg" onClick={() => heroFileInputRef.current?.click()} className="rounded-full text-base h-14 px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                  Upload Image
                </Button>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="rounded-full text-base h-14 px-8 font-semibold bg-background/50 backdrop-blur-sm">
                    How it works
                  </Button>
                </Link>
              </motion.div>
              <input ref={heroFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroFileChange} />
              {/* Drop zone */}
              <motion.div variants={fadeIn} className="max-w-md">
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                    isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-card/50 hover:bg-card hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => heroFileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Drag & Drop your image here</h3>
                  <p className="text-sm text-muted-foreground mb-6">PNG, JPG, JPEG up to 25MB · Batch up to 20 images</p>
                  <Button variant="secondary" className="rounded-full pointer-events-none">or click to browse</Button>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[600px] aspect-[4/5] lg:aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2.5rem] rotate-3 blur-2xl opacity-50" />
              <div className="absolute inset-0 rounded-3xl p-1 bg-gradient-to-br from-white/40 to-white/5 dark:from-white/10 dark:to-white/0 backdrop-blur-sm shadow-2xl">
                <BeforeAfterSlider
                  beforeImage={`${import.meta.env.BASE_URL}hero-before.jpg`}
                  afterImage={`${import.meta.env.BASE_URL}hero-after.png`}
                  className="w-full h-full rounded-[1.4rem]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Get Our App */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/60 shadow-sm p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Get Our App</h2>
                <p className="text-muted-foreground mb-4 max-w-xl">
                  Install our website as an app for a better experience. Available now on Google Play Store.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-5">
                  <CheckCircle2 className="w-4 h-4" /> Fast, Secure &amp; Easy to Use
                </div>
                <Button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("bgremover:install"));
                  }}
                  className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 h-11"
                >
                  Install Now
                </Button>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("bgremover:install"));
                }}
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 transition-colors text-white rounded-xl px-5 py-3 self-start lg:self-center"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
                  <defs>
                    <linearGradient id="play-a" x1="6" y1="3" x2="22" y2="16" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#00C3FF" />
                      <stop offset="1" stopColor="#1BE2FA" />
                    </linearGradient>
                    <linearGradient id="play-b" x1="6" y1="29" x2="22" y2="16" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#FFCE00" />
                      <stop offset="1" stopColor="#FFEA00" />
                    </linearGradient>
                    <linearGradient id="play-c" x1="22" y1="3" x2="22" y2="29" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#DE2453" />
                      <stop offset="1" stopColor="#FE3944" />
                    </linearGradient>
                    <linearGradient id="play-d" x1="6" y1="3" x2="6" y2="29" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#11D574" />
                      <stop offset="1" stopColor="#01F176" />
                    </linearGradient>
                  </defs>
                  <path d="M6.5 3.2 L19.5 11 L15.6 14.7 Z" fill="url(#play-a)" />
                  <path d="M6.5 28.8 L19.5 21 L15.6 17.3 Z" fill="url(#play-b)" />
                  <path d="M19.5 11 L25.5 14.5 C26.6 15.2 26.6 16.8 25.5 17.5 L19.5 21 L15.6 16 Z" fill="url(#play-c)" />
                  <path d="M6.5 3.2 L15.6 16 L6.5 28.8 C5.9 28.5 5.5 27.9 5.5 27.2 L5.5 4.8 C5.5 4.1 5.9 3.5 6.5 3.2 Z" fill="url(#play-d)" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase tracking-wide opacity-90">Get it on</div>
                  <div className="text-lg font-semibold -mt-0.5">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features preview */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Designed for Professionals</h2>
              <p className="text-muted-foreground text-lg max-w-xl">Every detail engineered for speed, accuracy, and ease of use.</p>
            </div>
            <Link href="/features" className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline whitespace-nowrap">
              All features <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Sparkles, title: "Next-Gen AI Model", desc: "Trained on 50M+ images — portraits, products, vehicles, animals. Understands context, not just edges." },
              { icon: Layers, title: "Hair & Fur Precision", desc: "Sub-pixel accuracy on individual strands. Even backlit hair against bright skies is handled cleanly." },
              { icon: ImageLucide, title: "Batch Processing", desc: "Drop up to 20 images at once. Process them all in sequence and download individually or together." },
              { icon: CheckCircle2, title: "Transparent PNG Export", desc: "Full-resolution output with a genuine alpha channel. No downscaling, no compression artifacts." },
              { icon: Zap, title: "100% In-Browser", desc: "Your images never leave your device. The AI model runs locally via WebAssembly — zero upload." },
              { icon: Shield, title: "Zero Data Retention", desc: "Since processing is local, there's nothing to retain. Complete privacy by design." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-lg transition-all duration-300 h-full group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <f.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Magic in 3 Steps</h2>
              <p className="text-muted-foreground text-lg">It's literally as simple as dropping a file.</p>
            </div>
            <Link href="/how-it-works" className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline whitespace-nowrap">
              Full breakdown <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-border via-primary/50 to-border -translate-y-1/2 -z-10" />
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Upload Image", desc: "Drag & drop or select an image. Supports batches of up to 20 images.", icon: UploadCloud },
                { step: "02", title: "AI Processes Locally", desc: "Your image never leaves your device. Our WebAssembly AI detects and extracts the subject.", icon: Zap },
                { step: "03", title: "Download PNG", desc: "Save a high-resolution transparent PNG instantly, or apply a custom background first.", icon: ImageLucide },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary/5 relative">
                    <item.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Loved by Creators</h2>
            <p className="text-lg text-muted-foreground">Thousands of professionals rely on BGRemover AI daily.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Jenkins", role: "E-commerce Manager", text: "We process hundreds of product photos weekly. BGRemover AI cut our editing time by 90%. The edge detection on tricky items like jewelry is incredible.", initials: "SJ" },
              { name: "David Chen", role: "Graphic Designer", text: "I've tried every background removal tool on the market. This is the only one that actually handles curly hair properly without leaving a weird halo effect.", initials: "DC" },
              { name: "Elena Rodriguez", role: "Marketing Director", text: "The batch processing feature is a lifesaver. We drag an entire campaign's worth of assets and they're ready before I finish my coffee.", initials: "ER" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card border-border/50 shadow-sm h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4 text-amber-500">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">{t.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "How does the AI work?", a: "The model is a U²-Net variant running via WebAssembly in your browser. It generates a pixel-level foreground mask entirely on your device — no server involved." },
              { q: "What image formats are supported?", a: "JPG, JPEG, PNG, and WEBP — up to 25MB per file. Output is always high-resolution PNG with a genuine alpha channel." },
              { q: "Is my image safe?", a: "Yes. Processing is 100% local — your image never leaves your browser. There is no upload, no server, and nothing to delete." },
              { q: "Can I use the images commercially?", a: "Yes. The processed images are yours to use however you like — personal or commercial." },
              { q: "How does batch upload work?", a: "Drop up to 20 images at once. They queue and process sequentially. Download each result individually or all at once." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-semibold text-base py-4 hover:no-underline hover:text-primary transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-primary" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-30" />
        <div className="container mx-auto px-4 md:px-6 text-center text-primary-foreground relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">Ready to speed up your workflow?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join 100,000+ creators who save hours every week using BGRemover AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/remove">
              <Button size="lg" variant="secondary" className="rounded-full text-base h-14 px-8 font-semibold gap-2">
                Start now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" className="rounded-full text-base h-14 px-8 font-semibold bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm">
                See all features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
