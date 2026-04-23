import { Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { Sparkles, Target, Heart, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const VALUES = [
  { icon: Zap, title: "Speed Without Compromise", body: "We believe powerful tools should be instant. Our AI processes images in seconds without sacrificing the fine details that matter most." },
  { icon: Heart, title: "Privacy First", body: "Your images are yours. We process everything in your browser — nothing is uploaded to our servers, stored, or shared. Ever." },
  { icon: Globe, title: "Accessible to Everyone", body: "Professional image editing used to require expensive software and years of skill. We're changing that — powerful AI tools for anyone, anywhere." },
  { icon: Target, title: "Accuracy Obsessed", body: "Hair, fur, transparent glass, soft shadows — we've obsessively tuned our models to handle the edge cases that other tools get wrong." },
];

const TEAM = [
  { name: "Alex Rivera", role: "CEO & Co-founder", initials: "AR", color: "bg-blue-500" },
  { name: "Mia Chen", role: "CTO & Co-founder", initials: "MC", color: "bg-violet-500" },
  { name: "James Okafor", role: "Head of AI Research", initials: "JO", color: "bg-green-500" },
  { name: "Sofia Müller", role: "Head of Design", initials: "SM", color: "bg-rose-500" },
  { name: "Liam Park", role: "Head of Engineering", initials: "LP", color: "bg-orange-500" },
  { name: "Priya Nair", role: "Head of Growth", initials: "PN", color: "bg-teal-500" },
];

export default function About() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4" /> Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
              We make professional image editing<br className="hidden md:block" /> accessible to everyone
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              BGRemover AI was founded in 2023 with a simple belief: the tools used by $300/hour retouchers should be available to every creator, seller, and designer — for free, in seconds, with no skill required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16 text-center">
            {[
              { stat: "50M+", label: "Images processed" },
              { stat: "180+", label: "Countries served" },
              { stat: "4.9★", label: "Average user rating" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-4xl font-extrabold text-primary mb-1">{stat}</p>
                <p className="text-muted-foreground text-sm">{label}</p>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">What we stand for</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {VALUES.map(({ icon: Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1.5">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Meet the team</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TEAM.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border bg-card p-5 text-center"
                >
                  <div className={`w-14 h-14 ${member.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3`}>
                    {member.initials}
                  </div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-muted-foreground text-xs">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-10 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to try it?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Join over 50 million users who've made BGRemover AI part of their creative workflow.</p>
            <Link href="/remove">
              <Button size="lg" className="rounded-full font-semibold px-8">Remove a Background Free</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
