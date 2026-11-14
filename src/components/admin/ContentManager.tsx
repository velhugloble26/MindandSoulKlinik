/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  CREATE_BLOGS,
  CREATE_GALLERY,
  DELETE_BLOG_BY_ID,
  DELETE_GALLERY_BY_ID,
  GET_ALL_BLOGS,
  GET_ALL_GALLERY,
  DELETE_UPLOADED_IMAGE,
  GET_UPLOAD_IMAGES,
  UPDATE_BLOG_BY_ID,
  UPDATE_GALLERY_BY_ID,
  UPLOAD_IMAGE,
} from "@/utils/api";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import BlogContentEditor from "./BlogContentEditor";
import {
  ConfirmModal,
  EmptyState,
  fieldClass,
  LoadingState,
  Modal,
  Notice,
  PageHeader,
  Pager,
  Pagination,
  requestApi,
  SearchBar,
} from "./AdminUI";

type ContentItem = {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  description?: string;
  image: string;
  imagePublicId?: string;
  content?: string;
  created_at?: string;
};
type Kind = "blog" | "gallery";

const contracts = {
  blog: {
    label: "Blog",
    plural: "Blogs",
    list: GET_ALL_BLOGS,
    create: CREATE_BLOGS,
    update: UPDATE_BLOG_BY_ID,
    remove: DELETE_BLOG_BY_ID,
    id: "blogId",
    // Keep uploads grouped by the content service instead of asking admins to choose.
    folder: "blog",
  },
  gallery: {
    label: "Gallery item",
    plural: "Gallery",
    list: GET_ALL_GALLERY,
    create: CREATE_GALLERY,
    update: UPDATE_GALLERY_BY_ID,
    remove: DELETE_GALLERY_BY_ID,
    id: "galleryId",
    folder: "gallery",
  },
} as const;

const blank = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  description: "",
  image: "",
  imagePublicId: "",
  content: "",
};

export default function ContentManager({ kind }: { kind: Kind }) {
  const config = contracts[kind];
  const [items, setItems] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState<ContentItem | "new" | null>(null);
  const [deleting, setDeleting] = useState<ContentItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ page: String(page), limit: "12" });
      if (search) query.set("search", search);
      if (kind === "blog" && category) query.set("category", category);
      const payload = await requestApi(`${config.list}?${query}`);
      setItems(payload.data?.data || []);
      setPagination(payload.data?.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to load ${config.plural.toLowerCase()}.`,
      );
    } finally {
      setLoading(false);
    }
  }, [category, config, kind, page, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmRemove() {
    if (!deleting) return;
    setError("");
    setSuccess("");
    setDeleteError("");
    setDeleteBusy(true);
    try {
      const payload = await requestApi(config.remove, {
        method: "DELETE",
        body: JSON.stringify({ [config.id]: deleting._id }),
      });
      setSuccess(payload.message);
      setDeleting(null);
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      setDeleteError(message);
      setError(message);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Content"
        title={config.plural}
        description={
          kind === "blog"
            ? "Publish and maintain the insights shown across the website."
            : "Manage the image collection using the existing gallery and upload APIs."
        }
        action={
          <button className="btn-primary" onClick={() => setEditing("new")}>
            Add {config.label}
          </button>
        }
      />
      {success && <Notice kind="success">{success}</Notice>}
      {error && <Notice>{error}</Notice>}
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder={`Search ${config.plural.toLowerCase()}`}
      >
        {kind === "blog" && (
          <input
            className="admin-filter"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            placeholder="Category"
            aria-label="Filter by category"
          />
        )}
      </SearchBar>
      {loading ? (
        <LoadingState label={`Loading ${config.plural.toLowerCase()}…`} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={kind === "blog" ? "article" : "photo_library"}
          title={`No ${config.plural.toLowerCase()} found`}
          body={
            search || category
              ? "Try changing your search or filter."
              : `Create the first ${config.label.toLowerCase()} to get started.`
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article className="admin-card overflow-hidden" key={item._id}>
              <div className="aspect-video surface-container">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    {item.category && (
                      <p className="text-xs uppercase tracking-[0.15em] ui-accent mb-1">
                        {item.category}
                      </p>
                    )}
                    <h2 className="text-headline-lg truncate ui-heading">
                      {item.title}
                    </h2>
                  </div>
                  <span className="text-xs ui-muted whitespace-nowrap">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-IN")
                      : ""}
                  </span>
                </div>
                <p className="mt-3 text-sm ui-copy line-clamp-3">
                  {item.excerpt || item.description}
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    className="admin-button-secondary flex-1"
                    onClick={() => setEditing(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-button-danger"
                    onClick={() => {
                      setDeleteError("");
                      setDeleting(item);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <Pager value={pagination} onChange={setPage} />
      {editing && (
        <ContentForm
          kind={kind}
          item={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            setSuccess(message);
            load();
          }}
        />
      )}
      {deleting && (
        <ConfirmModal
          title={`Delete ${config.label.toLowerCase()}?`}
          message={`Delete “${deleting.title}”? This cannot be undone.`}
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmRemove}
          onClose={() => {
            if (!deleteBusy) setDeleting(null);
          }}
        />
      )}
    </>
  );
}

function ContentForm({
  kind,
  item,
  onClose,
  onSaved,
}: {
  kind: Kind;
  item?: ContentItem;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const config = contracts[kind];
  const [form, setForm] = useState({ ...blank, ...item });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadFolder = config.folder;
  const [images, setImages] = useState<
    { publicId: string; url: string; format: string; bytes: number }[]
  >([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const uploadedPublicId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingImages(true);
    requestApi(
      `${GET_UPLOAD_IMAGES}?folder=${encodeURIComponent(uploadFolder)}`,
    )
      .then((payload) => {
        if (active) setImages(payload.data?.images || []);
      })
      .catch((err) => {
        if (active) {
          setImages([]);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load service images.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingImages(false);
      });
    return () => {
      active = false;
    };
  }, [uploadFolder]);

  function set(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }
  async function cleanupTemporaryUpload(publicId: string) {
    try {
      await requestApi(DELETE_UPLOADED_IMAGE, {
        method: "DELETE",
        body: JSON.stringify({ publicId }),
      });
    } catch (err) {
      console.error("UNSAVED_IMAGE_CLEANUP_ERROR:", err);
    }
  }
  function closeForm() {
    if (busy || uploading) return;
    if (uploadedPublicId.current)
      void cleanupTemporaryUpload(uploadedPublicId.current);
    uploadedPublicId.current = null;
    onClose();
  }
  function autoSlug(title: string) {
    set("title", title);
    if (!item)
      set(
        "slug",
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      );
  }
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.set("image", file);
      data.set("folder", uploadFolder);
      const payload = await requestApi(UPLOAD_IMAGE, {
        method: "POST",
        body: data,
      });
      const newPublicId = payload.data?.publicId;
      const newImageUrl = payload.data?.url;
      if (!newPublicId || !newImageUrl)
        throw new Error("Upload response did not include image details.");
      const previousTemporaryId = uploadedPublicId.current;
      uploadedPublicId.current = newPublicId;
      set("image", newImageUrl);
      set("imagePublicId", newPublicId);
      if (previousTemporaryId && previousTemporaryId !== newPublicId)
        await cleanupTemporaryUpload(previousTemporaryId);
      const imagesPayload = await requestApi(
        `${GET_UPLOAD_IMAGES}?folder=${encodeURIComponent(uploadFolder)}`,
      );
      setImages(imagesPayload.data?.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }
  async function selectImage(image: { publicId: string; url: string }) {
    if (
      uploadedPublicId.current &&
      uploadedPublicId.current !== image.publicId
    ) {
      await cleanupTemporaryUpload(uploadedPublicId.current);
      uploadedPublicId.current = null;
    }
    set("image", image.url);
    set("imagePublicId", image.publicId);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (
      kind === "blog" &&
      !form.content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;|&#160;/g, " ")
        .trim()
    ) {
      setError("Blog content is required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data =
        kind === "blog"
          ? {
              title: form.title,
              slug: form.slug,
              category: form.category,
              excerpt: form.excerpt,
              image: form.image,
              ...(form.imagePublicId
                ? { imagePublicId: form.imagePublicId }
                : {}),
              content: form.content,
            }
          : {
              title: form.title,
              description: form.description,
              image: form.image,
              ...(form.imagePublicId
                ? { imagePublicId: form.imagePublicId }
                : {}),
            };
      const payload = await requestApi(item ? config.update : config.create, {
        method: item ? "PATCH" : "POST",
        body: JSON.stringify(item ? { [config.id]: item._id, ...data } : data),
      });
      uploadedPublicId.current = null;
      onSaved(payload.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={`${item ? "Edit" : "Add"} ${config.label}`}
      onClose={closeForm}
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Notice>{error}</Notice>}
        <label className="admin-label">
          Title
          <input
            className={fieldClass}
            required
            maxLength={200}
            value={form.title}
            onChange={(e) => autoSlug(e.target.value)}
          />
        </label>
        {kind === "blog" && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="admin-label">
                Slug
                <input
                  className={fieldClass}
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                />
              </label>
              <label className="admin-label">
                Category
                <input
                  className={fieldClass}
                  required
                  maxLength={100}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                />
              </label>
            </div>
            <label className="admin-label">
              Excerpt
              <textarea
                className={fieldClass}
                required
                maxLength={1000}
                rows={3}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
              />
            </label>
          </>
        )}
        {kind === "gallery" && (
          <label className="admin-label">
            Description
            <textarea
              className={fieldClass}
              required
              maxLength={2000}
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
        )}
        <div>
          <p className="mb-3 text-xs ui-muted">
            Images are stored in the {uploadFolder} folder automatically.
          </p>
          <label className="admin-label">
            Upload new image
            <input
              type="file"
              className={fieldClass}
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading || busy}
              onChange={(event) => {
                const input = event.currentTarget;
                void upload(input.files?.[0]).finally(() => {
                  input.value = "";
                });
              }}
            />
          </label>
          <p className="mt-1 text-xs ui-muted">
            JPEG, PNG, WebP or GIF · maximum 8 MB
          </p>
          {uploading && (
            <p className="mt-2 text-sm ui-accent">Uploading image…</p>
          )}
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium ui-heading">
              Latest images in {uploadFolder}
            </p>
            {loadingImages ? (
              <p className="text-sm ui-muted">Loading folder images…</p>
            ) : images.length ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((image) => (
                  <button
                    key={image.publicId}
                    type="button"
                    disabled={uploading || busy}
                    className={`overflow-hidden rounded-lg border ${
                      form.imagePublicId === image.publicId
                        ? "border-primary ring-2 ring-primary"
                        : "border-surface"
                    }`}
                    aria-label={`Select image ${image.publicId}`}
                    onClick={() => selectImage(image)}
                  >
                    <Image
                      src={image.url}
                      alt=""
                      width={320}
                      height={220}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm ui-muted">No images in this folder yet.</p>
            )}
          </div>
          {form.image && (
            <Image
              src={form.image}
              alt="Selected image preview"
              width={1600}
              height={900}
              className="mt-3 h-32 w-full rounded-lg object-cover"
            />
          )}
          <input type="hidden" required value={form.image} />
        </div>
        {kind === "blog" && (
          <div className="admin-label">
            <span>Content</span>
            <BlogContentEditor
              value={form.content}
              onChange={(value) => set("content", value)}
            />
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="admin-button-secondary"
            disabled={busy || uploading}
            onClick={closeForm}
          >
            Cancel
          </button>
          <button className="btn-primary" disabled={busy || uploading}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
