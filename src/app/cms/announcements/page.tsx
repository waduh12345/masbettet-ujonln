"use client";

import React, { JSX, useMemo, useState } from "react";
import { Announcement } from "@/types/announcements";
import {
  useGetAnnouncementsQuery,
  useDeleteAnnouncementMutation,
} from "@/services/announcements.service";
import AnnouncementForm from "@/components/form-modal/announcements-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { displayDate } from "@/lib/format-utils";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AnnouncementPage(): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [paginate] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const {
    data: announcementsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAnnouncementsQuery(
    { page, paginate, search },
    { refetchOnFocus: false }
  );

  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  const announcements = useMemo<Announcement[]>(
    () => announcementsData?.data ?? [],
    [announcementsData]
  );

  const lastPage = announcementsData?.last_page ?? 1;
  const currentPage = announcementsData?.current_page ?? 1;
  const total = announcementsData?.total ?? 0;

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  // Hapus pake SweetAlert2
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus pengumuman?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAnnouncement(id).unwrap();
      await Swal.fire({
        title: "Terhapus",
        text: "Pengumuman berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Gagal",
        text: "Gagal menghapus pengumuman. Coba lagi.",
        icon: "error",
      });
    }
  };

  const handleOnSuccess = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    refetch();
  };

  return (
    <>
      <SiteHeader title="Pengumuman" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Daftar Pengumuman</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Cari judul..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-xs"
            />
            <Button
              onClick={handleOpenCreate}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Tambah Pengumuman
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          {isLoading || isFetching ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              Tidak ada pengumuman.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 w-20">Gambar</th>
                    <th className="py-2">Judul</th>
                    <th className="py-2 w-28">Status</th>
                    <th className="py-2 w-40">Dibuat</th>
                    <th className="py-2 w-28 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {announcements.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pr-2">
                        {typeof a.image === "string" && a.image ? (
                          <img
                            src={a.image}
                            alt={a.title ?? `gambar-${a.id}`}
                            className="h-10 w-16 object-cover rounded-md border"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="h-10 w-16 flex items-center justify-center rounded-md border bg-gray-50 text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="py-3 pr-2">
                        <div className="max-w-[32rem] truncate">{a.title}</div>
                      </td>

                      <td className="py-3 pr-2">
                        <span
                          className={`inline-block whitespace-nowrap px-2 py-0.5 rounded-full text-xs font-medium ${
                            Number(a.status) === 1 || a.status === true
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {Number(a.status) === 1 || a.status === true
                            ? "Aktif"
                            : "Nonaktif"}
                        </span>
                      </td>

                      <td className="py-3 pr-2 text-xs text-gray-600">
                        {displayDate(a.created_at)}
                      </td>

                      <td className="py-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(a)}
                            title="Edit"
                            className="p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(a.id)}
                            title="Hapus"
                            disabled={isDeleting}
                            className="p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              Menampilkan {announcements.length} dari {total} item
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                Sebelumnya
              </Button>
              <div className="text-sm">
                Hal {currentPage} / {lastPage}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={currentPage >= lastPage}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-2xl shadow-lg overflow-auto max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium">
                  {editingAnnouncement
                    ? "Edit Pengumuman"
                    : "Tambah Pengumuman"}
                </h2>
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAnnouncement(null);
                    }}
                  >
                    Tutup
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <AnnouncementForm
                  mode={editingAnnouncement ? "edit" : "create"}
                  initialData={editingAnnouncement ?? undefined}
                  onClose={() => {
                    setIsModalOpen(false);
                    setEditingAnnouncement(null);
                  }}
                  onSuccess={handleOnSuccess}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}