"use client";

import Image from "next/image";
import BlogNameCard from "./BlogNameCard";
import { useState, useEffect } from "react";
import {
  PenTool,
  X,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  LucideIcon,
} from "lucide-react";
import { createBlog, updateBlog } from "@/actions/blog.actions";
import { UploadButton } from "@/lib/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-md transition ${
      isActive
        ? "bg-[#1F4F46] text-white"
        : "text-[#1F4F46] hover:bg-[#1F4F46]/10"
    }`}
  >
    <Icon size={18} />
  </button>
);

interface BlogData {
  id: string;
  title: string;
  content: string;
  blogImg: string | null;
}

interface WriteBlogModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  blogToEdit?: BlogData | null;
}

export default function WriteBlogModal({
  userId,
  isOpen,
  onClose,
  blogToEdit,
}: WriteBlogModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [coverImg, setCoverImg] = useState<string | null>(
    blogToEdit?.blogImg ?? null,
  );
  const [title, setTitle] = useState(blogToEdit?.title ?? "");

  const [contentHtml, setContentHtml] = useState(blogToEdit?.content ?? "");

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: blogToEdit?.content ?? "",
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[300px] bg-transparent text-left text-lg text-[#1F4F46] outline-none prose prose-p:my-2 prose-headings:font-serif focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setContentHtml(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!isOpen) return null;

  const generateSlug = (text: string) => {
    return (
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now()
    );
  };

  const renameFile = (files: File[]) => {
    const currentSlug = generateSlug(title || "untitled");
    return files.map((file) => {
      const extension = file.name.split(".").pop();
      const newFileName = `${currentSlug}.${extension}`;
      return new File([file], newFileName, { type: file.type });
    });
  };

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    formData.append("content", contentHtml);

    if (coverImg) {
      formData.append("imageUrl", coverImg);
    }

    if (!formData.get("title")) {
      formData.append("title", title);
    }

    if (blogToEdit) {
      await updateBlog(blogToEdit.id, userId, formData);
    } else {
      const finalSlug = generateSlug(title);
      formData.append("slug", finalSlug);
      await createBlog(userId, formData);
    }

    setIsSubmitting(false);
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 mt-5">
      <div
        className="w-full max-w-300 bg-[#F5F3EF] rounded-2xl shadow-2xl p-8 
                   animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BlogNameCard />
            {blogToEdit && (
              <span className="text-[#85BFBB] font-serif italic">
                - Editing
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1F4F46] transition"
          >
            <X size={24} />
          </button>
        </div>

        <form action={onSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your story..."
              className="w-full bg-transparent text-3xl font-serif text-[#1F4F46] 
                        placeholder:text-[#1F4F46]/30 outline-none border-b 
                        border-gray-200 pb-2 focus:border-[#85BFBB] transition"
            />
          </div>

          {/* Img Upload */}
          <div className="space-y-3">
            {coverImg ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                <Image
                  src={coverImg}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImg(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 
                            rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-4 text-sm text-gray-500 
                             border border-dashed border-[#1F4F46]/20 p-4 rounded-xl hover:bg-white/50 transition"
              >
                <div className="relative flex items-center gap-2 cursor-pointer hover:text-[#85BFBB] transition w-full">
                  <ImageIcon size={18} />
                  <span>
                    {blogToEdit ? "Change Cover Image" : "Add Cover Image"}
                  </span>
                  <div className="absolute inset-0 opacity-0 w-full h-full cursor-pointer">
                    <UploadButton
                      endpoint="imageUploader"
                      onBeforeUploadBegin={renameFile}
                      onClientUploadComplete={(res) => setCoverImg(res[0].url)}
                      appearance={{
                        button: { width: "100%", height: "100%" },
                        container: { width: "100%", height: "100%" },
                        allowedContent: { display: "none" },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EDITOR SECTION */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white/40 focus-within:border-[#85BFBB] transition">
            {/* Toolbar */}
            {editor && (
              <div className="flex items-center gap-1 mb-3 pb-3 border-b border-gray-100">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive("bold")}
                  icon={Bold}
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive("italic")}
                  icon={Italic}
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  isActive={editor.isActive("underline")}
                  icon={UnderlineIcon}
                />
              </div>
            )}

            {/* Editor Area */}
            <EditorContent editor={editor} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-[#1F4F46] font-medium hover:bg-black/5 rounded-full transition"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting || !editor?.getText().trim()}
              className="bg-[#85BFBB] text-white px-8 py-2 rounded-full font-bold shadow-md 
                        hover:bg-[#74aeaa] transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <PenTool size={18} />
              )}
              {blogToEdit ? "Update Story" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
