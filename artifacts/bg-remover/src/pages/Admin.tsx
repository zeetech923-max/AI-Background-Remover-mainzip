import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminApi, fileToDataUrl, type Post, type GalleryImage } from "@/lib/adminApi";
import { LogOut, Plus, Trash2, Upload, Save, Pencil, Eye, EyeOff } from "lucide-react";

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Default: <code className="bg-muted px-1 rounded">admin123</code> (set <code>ADMIN_PASSWORD</code> env var to change)
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
      <header className="border-b bg-background">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-semibold">BGRemover Admin</div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <PostsManager />
          </TabsContent>
          <TabsContent value="gallery" className="mt-6">
            <GalleryManager />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

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

  if (creating || editing) {
    return <PostEditor initial={editing} onCancel={() => { setEditing(null); setCreating(false); }} onSaved={onSaved} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
        <Button onClick={() => setCreating(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>
      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No posts yet. Create your first post.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {posts.map((p) => (
            <Card key={p.id}>
              <CardContent className="py-4 flex items-center gap-4">
                {p.coverImageUrl ? (
                  <img src={p.coverImageUrl} alt="" className="w-16 h-16 object-cover rounded" />
                ) : (
                  <div className="w-16 h-16 rounded bg-muted" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {p.title}
                    {p.published ? (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 inline-flex items-center gap-1"><Eye className="w-3 h-3" />Published</span>
                    ) : (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground inline-flex items-center gap-1"><EyeOff className="w-3 h-3" />Draft</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">/{p.slug}</div>
                </div>
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
                  className="gap-1.5 text-destructive"
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initial ? "Edit Post" : "New Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder={slugify(title) || "url-slug"} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cover Image URL</Label>
            <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://… or leave empty" />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Content (Markdown / HTML)</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} className="font-mono text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={published} onCheckedChange={setPublished} id="pub" />
            <Label htmlFor="pub">Published</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="gap-1.5">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
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
        <h2 className="text-xl font-semibold">Gallery ({images.length})</h2>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <Card key={img.id}>
              <CardContent className="p-2 space-y-2">
                <div className="aspect-square bg-muted rounded overflow-hidden">
                  <img src={img.dataUrl} alt={img.filename} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs truncate" title={img.filename}>{img.filename}</div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => copyUrl(img)}>
                    Copy URL
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
        <CardTitle>Site Settings</CardTitle>
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
