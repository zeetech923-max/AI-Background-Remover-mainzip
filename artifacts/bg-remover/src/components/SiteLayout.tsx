import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { Sparkles, Sun, Moon, Menu, X, Twitter, Github, Linkedin, Shield, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (isStandalone) setInstalled(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    const onTrigger = async () => {
      if (!deferred) {
        alert(
          "To install: open this site in Chrome or Edge, then tap your browser menu → 'Install app' / 'Add to Home screen'.",
        );
        return;
      }
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("bgremover:install", onTrigger);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("bgremover:install", onTrigger);
    };
  }, [deferred]);

  const install = async () => {
    if (!deferred) {
      alert(
        "To install: open this site in Chrome or Edge, then tap your browser menu → 'Install app' / 'Add to Home screen'.",
      );
      return;
    }
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferred(null);
  };

  return { canInstall: !!deferred && !installed, installed, install };
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How to Use", href: "/how-it-works" },
  { label: "Privacy Policy", href: "/security" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { canInstall, install } = useInstallPrompt();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" : "bg-background border-b border-border/30"}`}>
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 text-primary p-1.5 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">BGRemover AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg transition-colors hover:text-foreground hover:bg-muted ${location === href ? "text-foreground font-semibold" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {canInstall && (
              <Button
                onClick={install}
                variant="outline"
                className="rounded-full px-4 h-9 font-semibold gap-1.5"
              >
                <Download className="w-4 h-4" /> Install App
              </Button>
            )}
            <Link href="/remove">
              <Button className="rounded-full px-5 h-9 font-semibold">Upload Image</Button>
            </Link>
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border z-40 overflow-hidden sticky top-16"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`p-3 font-medium rounded-lg hover:bg-muted block transition-colors ${location === href ? "text-primary bg-primary/5" : "text-foreground"}`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border mt-2 space-y-2">
                {canInstall && (
                  <Button
                    onClick={install}
                    variant="outline"
                    className="w-full rounded-full font-semibold gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Install App
                  </Button>
                )}
                <Link href="/remove">
                  <Button className="w-full rounded-full font-semibold">Upload Image</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card/50 py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-4 w-fit">
                <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight">BGRemover AI</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                The fastest, most accurate AI background remover for professionals and creators.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Articles</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/articles" className="hover:text-foreground transition-colors">All Articles</Link></li>
                <li><Link href="/articles/design-tips" className="hover:text-foreground transition-colors">Design Tips</Link></li>
                <li><Link href="/articles/ecommerce-guide" className="hover:text-foreground transition-colors">E-commerce Guide</Link></li>
                <li><Link href="/articles/ai-vs-manual" className="hover:text-foreground transition-colors">AI vs Manual</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/remove" className="hover:text-foreground transition-colors">Remove Background</Link></li>
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How to Use</Link></li>
                <li><a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} BGRemover AI. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Secure & Private</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Images never stored</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
