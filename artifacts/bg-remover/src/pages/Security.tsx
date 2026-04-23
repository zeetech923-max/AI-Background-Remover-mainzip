import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle2 } from "lucide-react";

const SECTIONS = [
  {
    icon: Eye,
    title: "Your Images Never Leave Your Device",
    body: "BGRemover AI processes all images entirely within your web browser using WebAssembly (WASM) and on-device machine learning. Your original files and the resulting outputs are never transmitted to our servers, third parties, or any external network. Once you close your browser tab, all data is discarded.",
  },
  {
    icon: Server,
    title: "No Cloud Storage",
    body: "We do not operate any image storage infrastructure. There is no database of user-uploaded images. We have no ability to retrieve, view, share, or sell your images because we simply never receive them.",
  },
  {
    icon: Lock,
    title: "Data Collection",
    body: "We collect only standard anonymized analytics (page views, feature usage counts, and error rates) through a privacy-first analytics provider that does not use cookies or track individuals. We do not collect any personally identifiable information unless you explicitly submit a contact form.",
  },
  {
    icon: Shield,
    title: "Transport Security",
    body: "All communication between your browser and our servers uses TLS 1.3 encryption. Our domain enforces HTTPS-only connections via HSTS with a preload list entry. We score A+ on Qualys SSL Labs.",
  },
  {
    icon: CheckCircle2,
    title: "Content Security Policy",
    body: "We implement a strict Content Security Policy (CSP) to prevent cross-site scripting (XSS) and data injection attacks. All scripts are integrity-verified via Subresource Integrity (SRI) hashes.",
  },
  {
    icon: AlertTriangle,
    title: "Vulnerability Disclosure",
    body: "We run a responsible disclosure program. If you discover a security vulnerability, please email security@bgremover.ai. We will acknowledge receipt within 48 hours, investigate, and issue a fix promptly. We do not pursue legal action against good-faith security researchers.",
  },
];

export default function Security() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-5 mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Security Policy</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Your privacy and security are foundational to everything we build. Here's exactly how we protect you.
            </p>
            <p className="text-xs text-muted-foreground mt-3">Last updated: April 14, 2026</p>
          </div>

          <div className="grid gap-3 mb-10">
            {[
              "Images processed 100% in-browser — never uploaded",
              "No cloud image storage — zero retention",
              "TLS 1.3 encryption on all connections",
              "A+ SSL rating (Qualys SSL Labs)",
              "Strict Content Security Policy (CSP)",
              "Responsible disclosure program active",
            ].map(item => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-border mb-10" />

          <div className="space-y-10">
            {SECTIONS.map(({ icon: Icon, title, body }, i) => (
              <motion.section
                key={title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  {title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Questions about security?</p>
            <p>Contact us at <a href="mailto:security@bgremover.ai" className="text-primary hover:underline">security@bgremover.ai</a> for security disclosures, or <a href="mailto:hello@bgremover.ai" className="text-primary hover:underline">hello@bgremover.ai</a> for general privacy questions.</p>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
