export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  category: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  focusKeyword: string;
  canonicalUrl: string;
  author: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string | null;
  twitterTitle: string;
  twitterDescription: string;
  noindex: boolean;
  nofollow: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GalleryImage = {
  id: number;
  filename: string;
  dataUrl: string;
  size: number;
  createdAt: string;
};

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const adminApi = {
  me: () => req<{ authenticated: boolean }>("/api/admin/me"),
  login: (password: string) =>
    req<{ ok: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => req<{ ok: true }>("/api/admin/logout", { method: "POST" }),

  listPosts: () => req<{ posts: Post[] }>("/api/posts"),
  getPost: (slug: string) => req<{ post: Post }>(`/api/posts/${slug}`),
  createPost: (data: Partial<Post>) =>
    req<{ post: Post }>("/api/admin/posts", { method: "POST", body: JSON.stringify(data) }),
  updatePost: (id: number, data: Partial<Post>) =>
    req<{ post: Post }>(`/api/admin/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePost: (id: number) => req<{ ok: true }>(`/api/admin/posts/${id}`, { method: "DELETE" }),

  getSettings: () => req<{ settings: Record<string, string> }>("/api/settings"),
  updateSettings: (settings: Record<string, string>) =>
    req<{ ok: true }>("/api/admin/settings", { method: "PUT", body: JSON.stringify({ settings }) }),

  listGallery: () => req<{ images: GalleryImage[] }>("/api/gallery"),
  uploadImage: (filename: string, dataUrl: string) =>
    req<{ image: GalleryImage }>("/api/admin/gallery", {
      method: "POST",
      body: JSON.stringify({ filename, dataUrl }),
    }),
  deleteImage: (id: number) =>
    req<{ ok: true }>(`/api/admin/gallery/${id}`, { method: "DELETE" }),
};

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
