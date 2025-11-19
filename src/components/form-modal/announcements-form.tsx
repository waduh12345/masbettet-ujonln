"use client";

import React, { JSX, useEffect, useState } from "react";
import type { Announcement } from "@/types/announcements";
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/services/announcements.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

type Props = {
  mode: "create" | "edit";
  initialData?: Announcement;
  onClose?: () => void;
  onSuccess?: () => void;
};

export default function AnnouncementForm({
  mode,
  initialData,
  onClose,
  onSuccess,
}: Props): JSX.Element {
  const [title, setTitle] = useState<string>(initialData?.title ?? "");
  const [content, setContent] = useState<string>(initialData?.content ?? "");
  const [status, setStatus] = useState<number>(
    initialData
      ? initialData.status === true
        ? 1
        : Number(initialData.status)
      : 0
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialData?.image === "string" ? initialData?.image : null
  );

  const [createAnnouncement, { isLoading: isCreating }] =
    useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();

  useEffect(() => {
    setTitle(initialData?.title ?? "");
    setContent(initialData?.content ?? "");
    setStatus(
      initialData
        ? initialData.status === true
          ? 1
          : Number(initialData.status)
        : 0
    );
    setImageFile(null);
    setImagePreview(
      typeof initialData?.image === "string" ? initialData?.image : null
    );
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setImageFile(null);
      setImagePreview(
        typeof initialData?.image === "string" ? initialData?.image : null
      );
      return;
    }
    const file = files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = (): string | null => {
    if (title.trim().length === 0) return "Judul wajib diisi.";
    if (content.trim().length === 0) return "Konten wajib diisi.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      await Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: err,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", String(status === 1 ? 1 : 0));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (mode === "create") {
        await createAnnouncement(formData).unwrap();
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pengumuman berhasil dibuat.",
          timer: 1400,
          showConfirmButton: false,
        });
      } else if (mode === "edit" && initialData) {
        await updateAnnouncement({
          id: initialData.id,
          payload: formData,
        }).unwrap();
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pengumuman berhasil diperbarui.",
          timer: 1400,
          showConfirmButton: false,
        });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan pengumuman. Coba lagi.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label>Judul</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul pengumuman"
              required
            />
          </div>

          <div>
            <Label>Konten</Label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full rounded-md border p-3 resize-vertical focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Tulis isi pengumuman..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <div>
              <Label>Status</Label>
              <div className="flex items-center gap-4 mt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 1}
                    onChange={() => setStatus(1)}
                    className="accent-sky-500"
                  />
                  <span>Aktif</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 0}
                    onChange={() => setStatus(0)}
                    className="accent-sky-500"
                  />
                  <span>Nonaktif</span>
                </label>
              </div>
            </div>

            <div className="mt-4 sm:mt-0">
              <Label>Unggah Gambar (opsional)</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maks. ukuran file sesuai kebijakan server.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (onClose) onClose();
              }}
            >
              Batal
            </Button>

            <Button type="submit" disabled={isCreating || isUpdating}>
              {mode === "create"
                ? isCreating
                  ? "Menyimpan..."
                  : "Simpan"
                : isUpdating
                ? "Memperbarui..."
                : "Perbarui"}
            </Button>
          </div>
        </div>

        <aside className="md:col-span-1">
          <div className="border rounded-lg overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium">Preview Gambar</h3>
              <p className="text-xs text-gray-500 mt-1">
                {`Klik "Hapus" untuk mengosongkan preview.`}
              </p>
            </div>

            <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={title ?? "preview-image"}
                  className="w-full h-[260px] object-cover rounded-md shadow-sm"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                    setImagePreview(null);
                  }}
                />
              ) : (
                <div className="text-center text-sm text-gray-400">
                  <div className="mb-2">Belum ada gambar</div>
                  <div className="text-xs">Preview akan muncul di sini</div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex items-center justify-between gap-2">
              <div className="text-xs text-gray-500">
                {imagePreview ? "Gambar siap diupload" : "Tidak ada gambar"}
              </div>

              <div className="flex items-center gap-2">
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveImage}
                    className="text-sm px-2 py-1"
                  >
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}