import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, Download, RefreshCw, Sparkles, Sun, Moon,
  Image as ImageIcon, Palette, CheckCircle2, X, ChevronLeft,
  Layers, ArrowRight, Package, AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

type BgMode = "transparent" | "color" | "gradient" | "image";
type ProcessingStage = "queued" | "loading-model" | "segmenting" | "refining" | "done" | "error";

const STAGE_LABELS: Record<ProcessingStage, string> = {
  queued: "Queued",
  "loading-model": "Loading AI model...",
  segmenting: "Detecting subject...",
  refining: "Refining edges...",
  done: "Done",
  error: "Failed",
};

interface BatchItem {
  id: string;
  file: File;
  originalUrl: string;
  resultBlob: Blob | null;
  resultUrl: string | null;
  stage: ProcessingStage;
  progress: number;
  error: string;
}

const GRADIENT_PRESETS = [
  { label: "Twilight", from: "#667eea", to: "#764ba2", dir: "135deg" },
  { label: "Ocean", from: "#2193b0", to: "#6dd5ed", dir: "135deg" },
  { label: "Sunset", from: "#f7971e", to: "#ffd200", dir: "135deg" },
  { label: "Rose", from: "#f953c6", to: "#b91d73", dir: "135deg" },
  { label: "Forest", from: "#134e5e", to: "#71b280", dir: "135deg" },
  { label: "Slate", from: "#1e3a5f", to: "#4a90d9", dir: "135deg" },
];

function CheckerPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="10" fill="#d4d4d4" />
          <rect x="10" y="10" width="10" height="10" fill="#d4d4d4" />
          <rect x="10" y="0" width="10" height="10" fill="#f5f5f5" />
          <rect x="0" y="10" width="10" height="10" fill="#f5f5f5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#checker)" />
    </svg>
  );
}

function buildGradientStyle(color1: string, color2: string, dir: string) {
  return `linear-gradient(${dir}, ${color1}, ${color2})`;
}

async function createComposite(
  resultBlob: Blob,
  bgMode: BgMode,
  bgColor: string,
  gradColor1: string,
  gradColor2: string,
  gradDir: string,
  bgImageUrl: string | null
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const fgImg = new Image();
    fgImg.onload = () => {
      canvas.width = fgImg.naturalWidth;
      canvas.height = fgImg.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const finalize = () => {
        ctx.drawImage(fgImg, 0, 0);
        canvas.toBlob((b) => {
          if (b) resolve(URL.createObjectURL(b));
          else reject(new Error("Failed to create blob"));
        }, "image/png");
      };

      if (bgMode === "transparent") {
        finalize();
      } else if (bgMode === "color") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        finalize();
      } else if (bgMode === "gradient") {
        const angle = parseFloat(gradDir);
        const rad = (angle * Math.PI) / 180;
        const x1 = canvas.width / 2 - (Math.cos(rad) * canvas.width) / 2;
        const y1 = canvas.height / 2 - (Math.sin(rad) * canvas.height) / 2;
        const x2 = canvas.width / 2 + (Math.cos(rad) * canvas.width) / 2;
        const y2 = canvas.height / 2 + (Math.sin(rad) * canvas.height) / 2;
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, gradColor1);
        grad.addColorStop(1, gradColor2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        finalize();
      } else if (bgMode === "image" && bgImageUrl) {
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          finalize();
        };
        bgImg.onerror = finalize;
        bgImg.src = bgImageUrl;
      } else {
        finalize();
      }
    };
    fgImg.onerror = reject;
    fgImg.src = URL.createObjectURL(resultBlob);
  });
}

export default function RemoveBg() {
  const { theme, setTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [sliderDragging, setSliderDragging] = useState(false);
  const [bgMode, setBgMode] = useState<BgMode>("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [gradColor1, setGradColor1] = useState("#667eea");
  const [gradColor2, setGradColor2] = useState("#764ba2");
  const [gradDir, setGradDir] = useState("135");
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  const [compositeCache, setCompositeCache] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);
  const queueRef = useRef<BatchItem[]>([]);

  const activeItem = items.find(i => i.id === activeId) ?? items[0] ?? null;

  const updateItem = useCallback((id: string, patch: Partial<BatchItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }, []);

  const processOne = useCallback(async (item: BatchItem) => {
    updateItem(item.id, { stage: "loading-model", progress: 0 });

    const progressTimer = { ref: null as ReturnType<typeof setInterval> | null };
    const fakeProgress = (target: number, dur: number) => {
      if (progressTimer.ref) clearInterval(progressTimer.ref);
      const start = Date.now();
      progressTimer.ref = setInterval(() => {
        const f = Math.min((Date.now() - start) / dur, 1);
        updateItem(item.id, { progress: item.progress + (target - item.progress) * f });
        if (f >= 1 && progressTimer.ref) { clearInterval(progressTimer.ref); progressTimer.ref = null; }
      }, 50);
    };

    try {
      fakeProgress(20, 3000);
      const { removeBackground } = await import("@imgly/background-removal");
      updateItem(item.id, { stage: "segmenting" });
      fakeProgress(75, 6000);

      const blob = await removeBackground(item.file, {
        publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/",
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) {
            updateItem(item.id, { progress: Math.min(10 + (current / total) * 80, 88) });
          }
        },
        model: "medium",
        output: { format: "image/png", quality: 1 },
      } as Parameters<typeof removeBackground>[1]);

      if (progressTimer.ref) clearInterval(progressTimer.ref);
      updateItem(item.id, { stage: "refining", progress: 92 });
      await new Promise(r => setTimeout(r, 300));

      const resultUrl = URL.createObjectURL(blob);
      updateItem(item.id, { stage: "done", progress: 100, resultBlob: blob, resultUrl });
    } catch (err) {
      if (progressTimer.ref) clearInterval(progressTimer.ref);
      console.error(err);
      updateItem(item.id, { stage: "error", error: "Processing failed. Try a different image." });
    }
  }, [updateItem]);

  const runQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    while (true) {
      const pending = queueRef.current.find(i => i.stage === "queued");
      if (!pending) break;
      await processOne(pending);
    }
    processingRef.current = false;
  }, [processOne]);

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/")).slice(0, 20);
    if (!imageFiles.length) return;
    const newItems: BatchItem[] = imageFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      originalUrl: URL.createObjectURL(file),
      resultBlob: null,
      resultUrl: null,
      stage: "queued",
      progress: 0,
      error: "",
    }));
    setItems(prev => {
      const next = [...prev, ...newItems];
      queueRef.current = next;
      return next;
    });
    if (!activeId) setActiveId(newItems[0].id);
    setTimeout(runQueue, 100);
  }, [activeId, runQueue]);

  // Pick up file passed from landing page
  useEffect(() => {
    import("@/lib/pending-file").then(({ takePendingFile }) => {
      const file = takePendingFile();
      if (file) addFiles([file]);
    });
  }, [addFiles]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };
  const onBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBgImageUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  // Sync queue ref with items state
  useEffect(() => { queueRef.current = items; }, [items]);

  // Compute composite for the active item whenever bg settings or result changes
  useEffect(() => {
    if (!activeItem?.resultBlob || !activeItem?.resultUrl) return;
    const { id, resultBlob } = activeItem;
    let cancelled = false;
    createComposite(resultBlob, bgMode, bgColor, gradColor1, gradColor2, gradDir, bgImageUrl)
      .then(url => { if (!cancelled) setCompositeCache(c => ({ ...c, [id]: url })); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [activeItem?.id, activeItem?.resultBlob, bgMode, bgColor, gradColor1, gradColor2, gradDir, bgImageUrl]);

  const downloadItem = (item: BatchItem) => {
    const url = compositeCache[item.id] ?? item.resultUrl;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = item.file.name.replace(/\.[^.]+$/, "") + "_nobg.png";
    a.click();
  };

  const downloadAll = async () => {
    for (const item of items) {
      if (item.stage !== "done") continue;
      await new Promise<void>(resolve => {
        const url = compositeCache[item.id] ?? item.resultUrl;
        if (!url) { resolve(); return; }
        const a = document.createElement("a");
        a.href = url;
        a.download = item.file.name.replace(/\.[^.]+$/, "") + "_nobg.png";
        a.click();
        setTimeout(resolve, 400);
      });
    }
  };

  const reset = () => {
    items.forEach(i => { if (i.originalUrl) URL.revokeObjectURL(i.originalUrl); if (i.resultUrl) URL.revokeObjectURL(i.resultUrl); });
    Object.values(compositeCache).forEach(u => URL.revokeObjectURL(u));
    setItems([]);
    setActiveId(null);
    setCompositeCache({});
    setBgMode("transparent");
    processingRef.current = false;
  };

  // Slider drag
  const onSliderMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setSliderDragging(true); };
  useEffect(() => {
    if (!sliderDragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;
      setSliderPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    };
    const onUp = () => setSliderDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [sliderDragging]);

  const isEmpty = items.length === 0;
  const doneCount = items.filter(i => i.stage === "done").length;
  const compositeUrl = activeItem ? compositeCache[activeItem.id] : null;

  const bgPreviewStyle: React.CSSProperties =
    bgMode === "color" ? { background: bgColor } :
    bgMode === "gradient" ? { background: buildGradientStyle(gradColor1, gradColor2, `${gradDir}deg`) } :
    {};

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 text-primary p-1.5 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">BGRemover AI</span>
          </Link>
          <div className="flex items-center gap-2">
            {!isEmpty && (
              <>
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud className="w-4 h-4" /> Add More
                </Button>
                {doneCount > 1 && (
                  <Button size="sm" className="gap-2 hidden sm:flex" onClick={downloadAll}>
                    <Package className="w-4 h-4" /> Download All ({doneCount})
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={reset}>
                  <RefreshCw className="w-4 h-4" /> Start Over
                </Button>
              </>
            )}
            {isEmpty && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              </Link>
            )}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {/* Empty state */}
          {isEmpty && (
            <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto mt-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">AI Background Removal</h1>
                <p className="text-muted-foreground text-lg">Precise subject detection. Hair, fur, and soft edges preserved. Professional-quality transparent PNG output.</p>
              </div>
              <div
                className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-card/50 hover:border-primary/50 hover:bg-card"
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-5">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold mb-2">Drag & drop images here</h2>
                <p className="text-muted-foreground mb-2">PNG, JPG, JPEG, WEBP — up to 25MB each</p>
                <p className="text-sm text-primary font-medium mb-6">Supports batch upload — drop up to 20 images at once</p>
                <Button className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 pointer-events-none">
                  Browse Files
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
                {[
                  ["Hair & Fur", "Fine strands preserved with sub-pixel accuracy"],
                  ["Semi-Transparent", "Glass, smoke, and soft edges handled naturally"],
                  ["High Resolution", "Output at full original resolution — zero quality loss"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-xl bg-card border border-border p-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mx-auto mb-1" />
                    <p className="font-semibold text-foreground text-xs">{title}</p>
                    <p className="text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />
            </motion.div>
          )}

          {/* Working state */}
          {!isEmpty && (
            <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col xl:flex-row gap-6">

              {/* Left: active image viewer */}
              <div className="flex-1 min-w-0">
                {activeItem && (
                  <>
                    {/* Processing spinner */}
                    {(activeItem.stage !== "done" && activeItem.stage !== "error") && (
                      <motion.div
                        key={`proc-${activeItem.id}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl border border-border bg-card p-10 flex flex-col items-center text-center gap-5 mb-4"
                      >
                        <div className="w-36 h-36 rounded-xl overflow-hidden bg-muted shadow-lg">
                          <img src={activeItem.originalUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="relative w-16 h-16">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="5" className="text-muted/40" />
                            <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 26}`}
                              strokeDashoffset={`${2 * Math.PI * 26 * (1 - activeItem.progress / 100)}`}
                              className="text-primary transition-all duration-200"
                            />
                          </svg>
                          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{STAGE_LABELS[activeItem.stage]}</p>
                          <p className="text-muted-foreground text-sm">{Math.round(activeItem.progress)}% — processing entirely in your browser</p>
                        </div>
                        <div className="w-full max-w-xs bg-muted rounded-full h-1.5 overflow-hidden">
                          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${activeItem.progress}%` }} transition={{ duration: 0.3 }} />
                        </div>
                      </motion.div>
                    )}

                    {/* Error state */}
                    {activeItem.stage === "error" && (
                      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 flex items-center gap-4 mb-4">
                        <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Failed to process this image</p>
                          <p className="text-sm text-muted-foreground">{activeItem.error}</p>
                        </div>
                      </div>
                    )}

                    {/* Done: Before/After slider */}
                    {activeItem.stage === "done" && activeItem.resultUrl && (
                      <motion.div key={`done-${activeItem.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-card mb-4">
                          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                              <ArrowRight className="w-3.5 h-3.5" /> Drag the slider to compare
                            </span>
                            <span className="text-xs text-muted-foreground">{activeItem.file.name}</span>
                          </div>

                          <div
                            ref={sliderRef}
                            className="relative select-none overflow-hidden aspect-video cursor-col-resize bg-muted"
                            onMouseDown={onSliderMouseDown}
                            onTouchStart={() => setSliderDragging(true)}
                          >
                            {/* After side */}
                            <div className="absolute inset-0">
                              {bgMode === "transparent" && <CheckerPattern />}
                              {bgMode === "color" && <div className="absolute inset-0" style={{ background: bgColor }} />}
                              {bgMode === "gradient" && <div className="absolute inset-0" style={{ background: buildGradientStyle(gradColor1, gradColor2, `${gradDir}deg`) }} />}
                              {bgMode === "image" && bgImageUrl && <img src={bgImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                              <img src={activeItem.resultUrl} className="absolute inset-0 w-full h-full object-contain" draggable={false} alt="Result" />
                              <div className="absolute top-2 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">After</div>
                            </div>

                            {/* Before side */}
                            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                              <img src={activeItem.originalUrl} className="absolute inset-0 w-full h-full object-contain" draggable={false} alt="Original" />
                              <div className="absolute top-2 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">Before</div>
                            </div>

                            {/* Divider */}
                            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-200">
                                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button onClick={() => downloadItem(activeItem)} className="flex-1 h-12 rounded-xl gap-2 font-semibold shadow-md shadow-primary/20">
                            <Download className="w-4 h-4" /> Download PNG
                          </Button>
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-12 rounded-xl gap-2">
                            <UploadCloud className="w-4 h-4" /> Add More
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Batch queue grid */}
                {items.length > 1 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      Batch Queue — {doneCount}/{items.length} complete
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setActiveId(item.id)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                            item.id === activeItem?.id ? "border-primary shadow-md shadow-primary/20 scale-[1.03]" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <img src={item.originalUrl} className="w-full h-full object-cover" alt="" />
                          <div className={`absolute inset-0 flex items-center justify-center ${item.stage === "done" ? "bg-black/20" : "bg-black/50"}`}>
                            {item.stage === "done" && <CheckCircle2 className="w-6 h-6 text-white drop-shadow" />}
                            {item.stage === "error" && <AlertCircle className="w-6 h-6 text-red-400 drop-shadow" />}
                            {item.stage === "queued" && <div className="text-white text-xs font-semibold bg-black/60 px-2 py-0.5 rounded-full">Queued</div>}
                            {(item.stage === "loading-model" || item.stage === "segmenting" || item.stage === "refining") && (
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                          {item.stage === "done" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); downloadItem(item); }}
                              className="absolute bottom-1 right-1 w-6 h-6 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                            >
                              <Download className="w-3 h-3 text-white" />
                            </button>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Background panel */}
              <div className="xl:w-72 flex-shrink-0">
                <div className="rounded-2xl border border-border bg-card p-5 sticky top-24 space-y-5">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Background
                  </h3>

                  {/* Mode tabs */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {([
                      { mode: "transparent" as BgMode, label: "None" },
                      { mode: "color" as BgMode, label: "Color" },
                      { mode: "gradient" as BgMode, label: "Gradient" },
                      { mode: "image" as BgMode, label: "Image" },
                    ]).map(({ mode, label }) => (
                      <button
                        key={mode}
                        onClick={() => setBgMode(mode)}
                        className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                          bgMode === mode ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Preview thumbnail */}
                  <div className="rounded-xl overflow-hidden border border-border h-28 relative">
                    {bgMode === "transparent" && <CheckerPattern />}
                    {(bgMode === "color" || bgMode === "gradient") && <div className="absolute inset-0" style={bgPreviewStyle} />}
                    {bgMode === "image" && bgImageUrl && <img src={bgImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                    {bgMode === "image" && !bgImageUrl && <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground text-xs">No image selected</div>}
                    {activeItem?.resultUrl && <img src={activeItem.resultUrl} className="absolute inset-0 w-full h-full object-contain" alt="" />}
                  </div>

                  {/* Transparent */}
                  {bgMode === "transparent" && (
                    <p className="text-xs text-muted-foreground">Output will be a PNG with full transparency — ready for any design tool.</p>
                  )}

                  {/* Solid color */}
                  {bgMode === "color" && (
                    <div className="space-y-3">
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
                      <div className="flex gap-1.5 flex-wrap">
                        {["#ffffff", "#f3f4f6", "#0f172a", "#2563EB", "#22C55E", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899", "#000000"].map(c => (
                          <button key={c} onClick={() => setBgColor(c)} className={`w-7 h-7 rounded-md border-2 transition-all ${bgColor === c ? "border-primary scale-110" : "border-border"}`} style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gradient */}
                  {bgMode === "gradient" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground block mb-1">From</label>
                          <input type="color" value={gradColor1} onChange={e => setGradColor1(e.target.value)} className="w-full h-9 rounded-lg border border-border cursor-pointer bg-transparent" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground block mb-1">To</label>
                          <input type="color" value={gradColor2} onChange={e => setGradColor2(e.target.value)} className="w-full h-9 rounded-lg border border-border cursor-pointer bg-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Direction — {gradDir}°</label>
                        <input type="range" min="0" max="360" value={gradDir} onChange={e => setGradDir(e.target.value)} className="w-full accent-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-2">Presets</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {GRADIENT_PRESETS.map(p => (
                            <button
                              key={p.label}
                              onClick={() => { setGradColor1(p.from); setGradColor2(p.to); setGradDir(p.dir.replace("deg", "")); }}
                              className="h-8 rounded-lg border border-border overflow-hidden relative hover:scale-105 transition-transform"
                              title={p.label}
                            >
                              <div className="absolute inset-0" style={{ background: `linear-gradient(${p.dir}, ${p.from}, ${p.to})` }} />
                              <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-semibold drop-shadow">{p.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom image */}
                  {bgMode === "image" && (
                    <div className="space-y-2">
                      <button
                        onClick={() => bgFileInputRef.current?.click()}
                        className="w-full rounded-xl border-2 border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex flex-col items-center gap-2"
                      >
                        <ImageIcon className="w-5 h-5" />
                        {bgImageUrl ? "Change background image" : "Upload background image"}
                      </button>
                      <input ref={bgFileInputRef} type="file" accept="image/*" className="hidden" onChange={onBgFileChange} />
                    </div>
                  )}

                  <div className="pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground">
                    <Layers className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                    Output is full-resolution PNG. Shadows and soft edges are preserved naturally by the AI.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />
    </div>
  );
}
