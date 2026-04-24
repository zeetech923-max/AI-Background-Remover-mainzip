import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Link2Off,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Eraser, Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  onPickImage?: (insert: (url: string) => void) => ReactNode;
  placeholder?: string;
  minHeight?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  onPickImage,
  placeholder = "Start writing your post…",
  minHeight = "400px",
}: Props) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [htmlDraft, setHtmlDraft] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "rounded bg-muted p-3 font-mono text-sm" } },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      ImageExt.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto my-4" },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none px-4 py-3",
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  if (!editor) {
    return <div className="border rounded-md bg-muted/20" style={{ minHeight }} />;
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImage = (url: string) => {
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border rounded-md bg-background overflow-hidden">
      <Toolbar
        editor={editor}
        mode={mode}
        onToggleMode={() => {
          if (mode === "visual") {
            setHtmlDraft(editor.getHTML());
            setMode("html");
          } else {
            editor.commands.setContent(htmlDraft || "");
            onChange(htmlDraft);
            setMode("visual");
          }
        }}
        onLink={setLink}
        onImagePick={onPickImage ? () => onPickImage(insertImage) : undefined}
        imagePickerSlot={onPickImage ? onPickImage(insertImage) : null}
      />
      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={htmlDraft}
          onChange={(e) => {
            setHtmlDraft(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full font-mono text-sm p-4 bg-muted/20 outline-none resize-y"
          style={{ minHeight }}
        />
      )}
    </div>
  );
}

type ToolbarProps = {
  editor: Editor;
  mode: "visual" | "html";
  onToggleMode: () => void;
  onLink: () => void;
  onImagePick?: () => void;
  imagePickerSlot?: ReactNode;
};

function Toolbar({ editor, mode, onToggleMode, onLink, imagePickerSlot }: ToolbarProps) {
  const isVisual = mode === "visual";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1.5 sticky top-0 z-10">
      <Group>
        <Btn title="Bold" active={editor.isActive("bold")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
        <Btn title="Italic" active={editor.isActive("italic")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
        <Btn title="Underline" active={editor.isActive("underline")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Btn>
        <Btn title="Strikethrough" active={editor.isActive("strike")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></Btn>
        <Btn title="Inline code" active={editor.isActive("code")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleCode().run()}><Code className="w-4 h-4" /></Btn>
      </Group>
      <Sep />
      <Group>
        <Btn title="Heading 1" active={editor.isActive("heading", { level: 1 })} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="w-4 h-4" /></Btn>
        <Btn title="Heading 2" active={editor.isActive("heading", { level: 2 })} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></Btn>
        <Btn title="Heading 3" active={editor.isActive("heading", { level: 3 })} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></Btn>
      </Group>
      <Sep />
      <Group>
        <Btn title="Bullet list" active={editor.isActive("bulletList")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
        <Btn title="Numbered list" active={editor.isActive("orderedList")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
        <Btn title="Quote" active={editor.isActive("blockquote")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>
        <Btn title="Code block" active={editor.isActive("codeBlock")} disabled={!isVisual}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className="w-4 h-4" /></Btn>
        <Btn title="Horizontal rule" disabled={!isVisual}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="w-4 h-4" /></Btn>
      </Group>
      <Sep />
      <Group>
        <Btn title="Align left" active={editor.isActive({ textAlign: "left" })} disabled={!isVisual}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft className="w-4 h-4" /></Btn>
        <Btn title="Align center" active={editor.isActive({ textAlign: "center" })} disabled={!isVisual}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter className="w-4 h-4" /></Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: "right" })} disabled={!isVisual}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight className="w-4 h-4" /></Btn>
      </Group>
      <Sep />
      <Group>
        <Btn title="Link" active={editor.isActive("link")} disabled={!isVisual} onClick={onLink}>
          <Link2 className="w-4 h-4" />
        </Btn>
        <Btn title="Unlink" disabled={!isVisual || !editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}><Link2Off className="w-4 h-4" /></Btn>
        {imagePickerSlot ? (
          <span className={cn("inline-flex", !isVisual && "opacity-50 pointer-events-none")}>{imagePickerSlot}</span>
        ) : null}
      </Group>
      <Sep />
      <Group>
        <Btn title="Undo" disabled={!isVisual || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}><Undo className="w-4 h-4" /></Btn>
        <Btn title="Redo" disabled={!isVisual || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}><Redo className="w-4 h-4" /></Btn>
        <Btn title="Clear formatting" disabled={!isVisual}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser className="w-4 h-4" /></Btn>
      </Group>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleMode}
          className={cn(
            "text-xs px-2.5 py-1.5 rounded font-medium transition-colors",
            !isVisual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
          title="Toggle HTML source"
        >
          {isVisual ? "HTML" : "Visual"}
        </button>
      </div>
    </div>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}
function Sep() {
  return <div className="w-px h-6 bg-border mx-0.5" />;
}
function Btn({
  children, onClick, active, title, disabled,
}: { children: ReactNode; onClick?: () => void; active?: boolean; title: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
        disabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
