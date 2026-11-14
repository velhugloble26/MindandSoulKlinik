"use client";

import type Quill from "quill";
import { useEffect, useRef } from "react";

export default function BlogContentEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Quill | null>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
  }, [onChange, value]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let editor: Quill | null = null;

    void import("quill").then(({ default: Quill }) => {
      if (cancelled) return;

      editor = new Quill(container, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            ["clean"],
          ],
        },
      });
      editor.root.setAttribute("aria-label", "Blog content");
      if (valueRef.current) {
        editor.clipboard.dangerouslyPasteHTML(valueRef.current, "silent");
      }
      editor.on("text-change", () => {
        const html = editor?.root.innerHTML ?? "";
        onChangeRef.current(html === "<p><br></p>" ? "" : html);
      });
      editorRef.current = editor;
    });

    return () => {
      cancelled = true;
      editor?.off("text-change");
      editorRef.current = null;
      container.replaceChildren();
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (!value && editor.getText().trim()) {
      editor.setText("");
    } else if (value && editor.root.innerHTML !== value) {
      editor.clipboard.dangerouslyPasteHTML(value, "silent");
    }
  }, [value]);

  return <div className="blog-content-editor" ref={containerRef} />;
}
