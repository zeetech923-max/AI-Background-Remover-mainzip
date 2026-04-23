import { useState } from "react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { Mail, MessageSquare, Clock, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOPICS = [
  "General Inquiry",
  "Technical Support",
  "Business / Enterprise",
  "Partnership",
  "Press & Media",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-14">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Get in Touch</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Have a question, problem, or want to work with us? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Mail, title: "Email Support", body: "hello@bgremover.ai", sub: "We reply within 24 hours" },
              { icon: MessageSquare, title: "Live Chat", body: "Available in the app", sub: "Mon–Fri, 9am–6pm UTC" },
              { icon: Clock, title: "Response Time", body: "Under 24 hours", sub: "For most inquiries" },
            ].map(({ icon: Icon, title, body, sub }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5 flex gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-foreground text-sm font-medium">{body}</p>
                  <p className="text-muted-foreground text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Message Sent!</h2>
                <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <Button variant="outline" className="rounded-full mt-2" onClick={() => setSent(false)}>Send Another</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Your Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Email Address</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Topic</label>
                  <select
                    value={form.topic}
                    onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select a topic...</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl h-12 font-semibold gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
