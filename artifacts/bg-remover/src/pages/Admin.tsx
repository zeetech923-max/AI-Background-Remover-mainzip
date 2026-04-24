import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminApi, fileToDataUrl, type Post, type GalleryImage } from "@/lib/adminApi";
import {
  LogOut, Plus, Trash2, Upload, Save, Pencil, Eye, EyeOff,
  FileText, Image as ImageIcon, Settings as SettingsIcon, Search,
  ExternalLink, Globe, BarChart3,
} from "lucide-react";

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = "Admin · BGRemover AI";
    adminApi
      .me()
      .then((r) => setAuthed(r.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.login(password);
      toast.success("Welcome back");
      onSuccess();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">BGRemover Admin</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to manage your content</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Default: <code className="bg-muted px-1 rounded">admin123</code>. Set <code>ADMIN_PASSWORD</code> env var to change.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const handleLogout = async () => {
    await adminApi.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <SettingsIcon className="w-5 h-5 text-primary" />
            BGRemover Admin
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" /> View Site
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="overview" className="gap-1.5"><BarChart3 className="w-4 h-4" />Overview</TabsTrigger>
            <TabsTrigger value="posts" className="gap-1.5"><FileText className="w-4 h-4" />Posts</TabsTrigger>
            <TabsTrigger value="gallery" className="gap-1.5"><ImageIcon className="w-4 h-4" />Media</TabsTrigger>
            <TabsTrigger value="seo" className="gap-1.5"><Search className="w-4 h-4" />SEO</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5"><SettingsIcon className="w-4 h-4" />Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6"><Overview /></TabsContent>
          <TabsContent value="posts" className="mt-6"><PostsManager /></TabsContent>
          <TabsContent value="gallery" className="mt-6"><GalleryManager /></TabsContent>
          <TabsContent value="seo" className="mt-6"><SeoManager /></TabsContent>
          <TabsContent value="settings" className="mt-6"><SettingsManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Overview() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    adminApi.listPosts().then((r) => setPosts(r.posts)).catch(() => {});
    adminApi.listGallery().then((r) => setImages(r.images)).catch(() => {});
  }, []);

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;

  const stats = [
    { label: "Total Posts", value: posts.length, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Published", value: published, color: "text-green-600", bg: "bg-green-50" },
    { label: "Drafts", value: drafts, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Media Images", value: images.length, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet — click the Posts tab to create one.</p>
          ) : (
            <div className="space-y-2">
              {posts.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${p.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const reload = () =>
    adminApi
      .listPosts()
      .then((r) => setPosts(r.posts))
      .catch((e) => toast.error(e.message));

  useEffect(() => {
    reload();
  }, []);

  const onSaved = () => {
    setEditing(null);
    setCreating(false);
    reload();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q),
    );
  }, [posts, search]);

  if (creating || editing) {
    return <PostEditor initial={editing} onCancel={() => { setEditing(null); setCreating(false); }} onSaved={onSaved} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-semibold">All Posts ({posts.length})</h2>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button onClick={() => setCreating(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {posts.length === 0 ? "No posts yet. Create your first post." : "No posts match your search."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <Card key={p.id}>
              <CardContent className="py-4 flex items-center gap-4">
                {p.coverImageUrl ? (
                  <img src={p.coverImageUrl} alt="" className="w-20 h-16 object-cover rounded" />
                ) : (
                  <div className="w-20 h-16 rounded bg-muted flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {p.title}
                    {p.published ? (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 inline-flex items-center gap-1"><Eye className="w-3 h-3" />Live</span>
                    ) : (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground inline-flex items-center gap-1"><EyeOff className="w-3 h-3" />Draft</span>
                    )}
                    {p.noindex && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">noindex</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    /articles/{p.slug}
                    {p.category && <span className="ml-2">· {p.category}</span>}
                  </div>
                </div>
                {p.published && (
                  <Button asChild variant="ghost" size="sm" className="gap-1.5">
                    <a href={`/articles/${p.slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setEditing(p)} className="gap-1.5">
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!confirm(`Delete "${p.title}"?`)) return;
                    await adminApi.deletePost(p.id);
                    toast.success("Deleted");
                    reload();
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PostEditor({ initial, onCancel, onSaved }: { initial: Post | null; onCancel: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [metaKeywords, setMetaKeywords] = useState(initial?.metaKeywords ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(initial?.ogImageUrl ?? "");
  const [noindex, setNoindex] = useState(initial?.noindex ?? false);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [saving, setSaving] = useState(false);

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        slug: slug || slugify(title),
        title,
        excerpt,
        content,
        coverImageUrl: coverImageUrl || null,
        category,
        tags,
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImageUrl: ogImageUrl || null,
        noindex,
        published,
      };
      if (initial) await adminApi.updatePost(initial.id, body);
      else await adminApi.createPost(body);
      toast.success("Saved");
      onSaved();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const insertContent = (text: string) => {
    setContent((c) => c + (c.endsWith("\n") || !c ? "" : "\n\n") + text);
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{initial ? "Edit Post" : "New Post"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Post title" />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">/articles/</span>
                <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder={slugify(title) || "url-slug"} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt (short summary)</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} maxLength={300} />
              <div className="text-xs text-muted-foreground text-right">{excerpt.length}/300</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Content (Markdown / HTML)</Label>
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant="outline" onClick={() => insertContent("# Heading")}>H1</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => insertContent("## Subheading")}>H2</Button>
                  <ImagePickerDialog onPick={(url) => insertContent(`<img src="${url}" alt="" />`)}>
                    <Button type="button" size="sm" variant="outline" className="gap-1"><ImageIcon className="w-3.5 h-3.5" />Insert Image</Button>
                  </ImagePickerDialog>
                </div>
              </div>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="font-mono text-sm" placeholder="# Your heading&#10;&#10;Write your post content here. Use blank lines to separate paragraphs. Raw HTML is supported." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Search className="w-5 h-5 text-primary" />SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Meta Title <span className="text-xs text-muted-foreground">(falls back to post title)</span></Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={70} placeholder={title || "SEO page title"} />
              <div className="text-xs text-muted-foreground text-right">{metaTitle.length}/70</div>
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} maxLength={160} placeholder="What this post is about, in 1-2 sentences." />
              <div className="text-xs text-muted-foreground text-right">{metaDescription.length}/160</div>
            </div>
            <div className="space-y-2">
              <Label>Meta Keywords <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
              <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="background removal, AI, photo editing" />
            </div>
            <div className="space-y-2">
              <Label>Social Share Image (Open Graph)</Label>
              <div className="flex gap-2">
                <Input value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} placeholder="Falls back to cover image" />
                <ImagePickerDialog onPick={(url) => setOgImageUrl(url)}>
                  <Button type="button" variant="outline">Pick</Button>
                </ImagePickerDialog>
              </div>
              {(ogImageUrl || coverImageUrl) && (
                <img src={ogImageUrl || coverImageUrl} alt="" className="mt-2 w-full max-w-sm aspect-[1.91/1] object-cover rounded border" />
              )}
            </div>
            <div className="flex items-center gap-3 pt-2 border-t">
              <Switch checked={noindex} onCheckedChange={setNoindex} id="noindex" />
              <Label htmlFor="noindex" className="cursor-pointer">
                Noindex (hide from Google &amp; sitemap)
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="pub" />
              <Label htmlFor="pub" className="cursor-pointer">
                {published ? "Published" : "Draft"}
              </Label>
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={saving} className="gap-1.5">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : initial ? "Update Post" : "Create Post"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {coverImageUrl && (
              <img src={coverImageUrl} alt="" className="w-full aspect-video object-cover rounded border" />
            )}
            <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://… or pick from media" />
            <div className="flex gap-2">
              <ImagePickerDialog onPick={(url) => setCoverImageUrl(url)}>
                <Button type="button" variant="outline" className="flex-1 gap-1"><ImageIcon className="w-4 h-4" />Pick from Media</Button>
              </ImagePickerDialog>
              {coverImageUrl && (
                <Button type="button" variant="outline" onClick={() => setCoverImageUrl("")}>Clear</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories &amp; Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Tutorial, News" />
            </div>
            <div className="space-y-2">
              <Label>Tags <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ai, tips, design" />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

function ImagePickerDialog({ children, onPick }: { children: React.ReactNode; onPick: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) adminApi.listGallery().then((r) => setImages(r.images)).catch(() => {});
  }, [open]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const f of files) {
        const url = await fileToDataUrl(f);
        await adminApi.uploadImage(f.name, url);
      }
      const r = await adminApi.listGallery();
      setImages(r.images);
      toast.success(`Uploaded ${files.length}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pick Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label className="cursor-pointer">
            <Button asChild className="gap-1.5">
              <span>
                <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload New"}
              </span>
            </Button>
            <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" disabled={uploading} />
          </Label>
          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No images yet — upload some above.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => { onPick(img.dataUrl); setOpen(false); }}
                  className="aspect-square rounded border overflow-hidden hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all"
                >
                  <img src={img.dataUrl} alt={img.filename} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const reload = () =>
    adminApi
      .listGallery()
      .then((r) => setImages(r.images))
      .catch((e) => toast.error(e.message));

  useEffect(() => {
    reload();
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const f of files) {
        const url = await fileToDataUrl(f);
        await adminApi.uploadImage(f.name, url);
      }
      toast.success(`Uploaded ${files.length} image(s)`);
      reload();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (img: GalleryImage) => {
    navigator.clipboard.writeText(img.dataUrl);
    toast.success("Image URL copied");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Media Library ({images.length})</h2>
        <Label className="cursor-pointer">
          <Button asChild className="gap-1.5">
            <span>
              <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload Images"}
            </span>
          </Button>
          <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" disabled={uploading} />
        </Label>
      </div>
      {images.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No images yet. Upload some to use in blog posts or site content.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img) => (
            <Card key={img.id}>
              <CardContent className="p-2 space-y-2">
                <div className="aspect-square bg-muted rounded overflow-hidden">
                  <img src={img.dataUrl} alt={img.filename} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs truncate" title={img.filename}>{img.filename}</div>
                <div className="text-xs text-muted-foreground">{(img.size / 1024).toFixed(1)} KB</div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => copyUrl(img)}>
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={async () => {
                      if (!confirm("Delete image?")) return;
                      await adminApi.deleteImage(img.id);
                      reload();
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const SEO_FIELDS = [
  { key: "site_name", label: "Site Name", placeholder: "BGRemover AI" },
  { key: "site_title_template", label: "Title Template", placeholder: "%s | BGRemover AI", help: "Use %s for the page title" },
  { key: "site_default_title", label: "Default Page Title", placeholder: "BGRemover AI — Remove Image Backgrounds Instantly" },
  { key: "site_default_description", label: "Default Description (Home, fallback)", placeholder: "AI-powered background removal in your browser." },
  { key: "site_default_keywords", label: "Default Keywords", placeholder: "background remover, AI, photo editing" },
  { key: "site_default_og_image", label: "Default Social Share Image URL", placeholder: "https://…" },
  { key: "twitter_handle", label: "Twitter Handle", placeholder: "@yourhandle" },
  { key: "google_site_verification", label: "Google Search Console verification token", placeholder: "abc123…" },
  { key: "google_analytics_id", label: "Google Analytics Measurement ID", placeholder: "G-XXXXXXXXXX" },
];

function SeoManager() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [robotsBlock, setRobotsBlock] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((r) => {
        setValues(r.settings);
        setRobotsBlock(r.settings.robots_disallow_all === "true");
      })
      .catch((e) => toast.error(e.message));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings({ ...values, robots_disallow_all: robotsBlock ? "true" : "false" });
      toast.success("SEO settings saved");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5 text-primary" />Site-wide SEO</CardTitle>
          <p className="text-sm text-muted-foreground">These apply to every page unless overridden by a specific post.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {SEO_FIELDS.map((s) => (
              <div key={s.key} className="space-y-2">
                <Label>{s.label}</Label>
                <Input
                  value={values[s.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                  placeholder={s.placeholder}
                />
                {s.help && <p className="text-xs text-muted-foreground">{s.help}</p>}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t">
              <Switch id="robots" checked={robotsBlock} onCheckedChange={setRobotsBlock} />
              <div>
                <Label htmlFor="robots" className="cursor-pointer">Block all search engines</Label>
                <p className="text-xs text-muted-foreground">Adds <code>Disallow: /</code> to robots.txt. Use only during staging.</p>
              </div>
            </div>
            <Button type="submit" disabled={saving} className="gap-1.5">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save SEO Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-primary" />Public SEO Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Auto-generated from your published posts:</p>
          <ul className="space-y-1.5">
            <li>
              <a href="/api/sitemap.xml" target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> /api/sitemap.xml
              </a>
              <span className="text-muted-foreground"> — submit to Google Search Console</span>
            </li>
            <li>
              <a href="/api/robots.txt" target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> /api/robots.txt
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

const SETTING_KEYS = [
  { key: "hero_title", label: "Hero Title", placeholder: "Remove Image Backgrounds" },
  { key: "hero_subtitle", label: "Hero Subtitle (the gradient line)", placeholder: "Instantly with AI" },
  { key: "hero_description", label: "Hero Description", placeholder: "Upload any photo and get…" },
  { key: "site_tagline", label: "Site Tagline (footer)", placeholder: "AI-powered background removal" },
  { key: "contact_email", label: "Contact Email", placeholder: "hello@example.com" },
];

function SettingsManager() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((r) => setValues(r.settings))
      .catch((e) => toast.error(e.message));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(values);
      toast.success("Settings saved");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Site Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          {SETTING_KEYS.map((s) => (
            <div key={s.key} className="space-y-2">
              <Label>{s.label}</Label>
              <Input
                value={values[s.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                placeholder={s.placeholder}
              />
            </div>
          ))}
          <Button type="submit" disabled={saving} className="gap-1.5">
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
