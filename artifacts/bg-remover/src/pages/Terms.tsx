import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using BGRemover AI (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all visitors, users, and others who access or use the Service.",
  },
  {
    title: "2. Description of Service",
    body: "BGRemover AI provides an AI-powered background removal tool that operates entirely within the user's web browser. The Service processes images locally on the user's device and does not transmit image data to any external server. Additional features may include background replacement, batch processing, and export options.",
  },
  {
    title: "3. User Responsibilities",
    body: "You are solely responsible for all images you process using the Service. You represent and warrant that you own or have the necessary rights to use all images you submit to the Service. You agree not to use the Service to process images that violate any applicable law, infringe intellectual property rights, or contain illegal content.",
  },
  {
    title: "4. Intellectual Property",
    body: "BGRemover AI retains all rights, title, and interest in and to the Service, including all software, algorithms, models, and user interface elements. You retain full ownership of your original images and the processed output images. We claim no rights to your content.",
  },
  {
    title: "5. Privacy and Data",
    body: "All image processing occurs locally in your browser. We do not collect, store, or have access to your images. Please review our Security Policy for full details on our data practices. We collect only anonymized, non-personal usage analytics.",
  },
  {
    title: "6. Disclaimer of Warranties",
    body: "The Service is provided \"as is\" and \"as available\" without warranties of any kind, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or produce results of any particular quality.",
  },
  {
    title: "7. Limitation of Liability",
    body: "To the maximum extent permitted by law, BGRemover AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.",
  },
  {
    title: "8. Changes to the Service",
    body: "We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.",
  },
  {
    title: "9. Changes to Terms",
    body: "We reserve the right to modify these Terms at any time. We will post the updated Terms on this page with a revised date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.",
  },
  {
    title: "10. Governing Law",
    body: "These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Delaware.",
  },
  {
    title: "11. Contact",
    body: "For questions about these Terms, please contact us at legal@bgremover.ai or through our Contact Us page.",
  },
];

export default function Terms() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-5 mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: April 14, 2026</p>
          </div>

          <div className="h-px bg-border mb-10" />

          <div className="space-y-8">
            {SECTIONS.map((section, i) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <h2 className="text-base font-bold mb-2 text-foreground">{section.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{section.body}</p>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Questions about these Terms?</p>
            <p>Contact us at <a href="mailto:legal@bgremover.ai" className="text-primary hover:underline">legal@bgremover.ai</a> and we'll be happy to clarify anything.</p>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
