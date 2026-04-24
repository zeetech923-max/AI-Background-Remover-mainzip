import { useEffect } from "react";

type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterHandle?: string;
  publishedTime?: string;
  modifiedTime?: string;
};

function setMeta(selector: string, attr: "name" | "property", attrValue: string, value: string | null | undefined) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string | null | undefined) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function Seo({
  title, description, keywords, image, type = "website",
  noindex, nofollow, canonical, author,
  ogTitle, ogDescription, twitterTitle, twitterDescription,
  twitterHandle, publishedTime, modifiedTime,
}: SeoProps) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="keywords"]', "name", "keywords", keywords);
    setMeta('meta[name="author"]', "name", "author", author);
    const robotsParts = [noindex ? "noindex" : "index", nofollow ? "nofollow" : "follow"];
    setMeta('meta[name="robots"]', "name", "robots", robotsParts.join(","));

    setMeta('meta[property="og:title"]', "property", "og:title", ogTitle || title);
    setMeta('meta[property="og:description"]', "property", "og:description", ogDescription || description);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:image"]', "property", "og:image", image ?? undefined);
    setMeta('meta[property="og:url"]', "property", "og:url", typeof window !== "undefined" ? window.location.href : undefined);
    setMeta('meta[property="article:published_time"]', "property", "article:published_time", type === "article" ? publishedTime : undefined);
    setMeta('meta[property="article:modified_time"]', "property", "article:modified_time", type === "article" ? modifiedTime : undefined);
    setMeta('meta[property="article:author"]', "property", "article:author", type === "article" ? author : undefined);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", twitterTitle || ogTitle || title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", twitterDescription || ogDescription || description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image ?? undefined);
    setMeta('meta[name="twitter:site"]', "name", "twitter:site", twitterHandle);
    setMeta('meta[name="twitter:creator"]', "name", "twitter:creator", twitterHandle);

    setLink("canonical", canonical || (typeof window !== "undefined" ? window.location.href : undefined));
  }, [
    title, description, keywords, image, type, noindex, nofollow, canonical, author,
    ogTitle, ogDescription, twitterTitle, twitterDescription, twitterHandle,
    publishedTime, modifiedTime,
  ]);

  return null;
}
