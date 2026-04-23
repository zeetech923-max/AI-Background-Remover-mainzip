import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { ArrowLeft, Calendar } from "lucide-react";
import { adminApi, type Post } from "@/lib/adminApi";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

function renderContent(content: string): { __html: string } {
  // Very simple markdown-ish: split paragraphs, allow raw HTML
  const blocks = content.split(/\n\n+/).map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (/^<.+>/.test(trimmed)) return trimmed;
    if (/^#\s/.test(trimmed)) return `<h2>${trimmed.replace(/^#\s+/, "")}</h2>`;
    if (/^##\s/.test(trimmed)) return `<h3>${trimmed.replace(/^##\s+/, "")}</h3>`;
    return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
  });
  return { __html: blocks.join("\n") };
}

export default function ArticlePost() {
  const [, params] = useRoute("/articles/:slug");
  const slug = params?.slug;
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setPost(null);
    setError(null);
    adminApi
      .getPost(slug)
      .then((r) => setPost(r.post))
      .catch((e) => setError((e as Error).message));
  }, [slug]);

  if (error) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 md:px-6 py-24 max-w-3xl text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/articles" className="text-primary font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to articles
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 md:px-6 py-24 max-w-3xl text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-3xl">
        <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
            <Calendar className="w-4 h-4" /> {formatDate(post.createdAt)}
          </div>
          {post.coverImageUrl && (
            <img src={post.coverImageUrl} alt="" className="w-full rounded-2xl mb-8 aspect-[16/9] object-cover" />
          )}
          {post.excerpt && <p className="text-lg text-muted-foreground mb-8">{post.excerpt}</p>}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={renderContent(post.content)}
          />
        </motion.div>
      </article>
    </SiteLayout>
  );
}
