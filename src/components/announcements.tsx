"use client";

import React, { JSX, useEffect, useState } from "react";
import type { Announcement } from "@/types/announcements";
import { useGetAnnouncementsQuery } from "@/services/announcements.service";
import { displayDate } from "@/lib/format-utils";
import { Share2, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function AnnouncementCarousel(): JSX.Element {
  const {
    data: announcementsData,
    isLoading,
    isError,
  } = useGetAnnouncementsQuery({
    page: 1,
    paginate: 10,
    search: "",
  });

  const announcements: Announcement[] = announcementsData?.data ?? [];

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Announcement | null>(null);

  // feedback copy link
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (announcements.length <= 1) {
      setActiveIndex(0);
      return;
    }
    if (isPaused || isModalOpen) return;

    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % announcements.length);
    }, 3000);

    return () => clearInterval(id);
  }, [announcements.length, isPaused, isModalOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [announcements.length]);

  const openDetail = (item: Announcement) => {
    setSelected(item);
    setIsModalOpen(true);
    setControlsVisible(true);
  };

  const closeDetail = () => {
    setSelected(null);
    setIsModalOpen(false);
  };

  const handleCopyLink = async (item: Announcement) => {
    const url = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/announcements/${item.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: do nothing (or show toast jika ada)
      // eslint-disable-next-line no-console
      console.error("Gagal menyalin link");
    }
  };

  const slideTo = (idx: number) => {
    setActiveIndex(idx);
    setControlsVisible(true);
  };

  return (
    <section className="rounded-2xl bg-white/90 ring-1 ring-zinc-100 shadow-sm backdrop-blur overflow-hidden">
      <div className="border-b border-zinc-100 px-4 py-3 md:px-6">
        <h3 className="font-semibold text-zinc-900">Pengumuman</h3>
        <p className="text-xs text-zinc-500">
          Menampilkan {announcements.length} pengumuman
        </p>
      </div>

      <div
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="p-4 flex items-center justify-center">
          {isLoading ? (
            <div className="w-full max-w-[980px] animate-pulse h-56 rounded-lg bg-zinc-200" />
          ) : isError || announcements.length === 0 ? (
            <div className="p-6 text-center text-sm text-zinc-600">
              Tidak ada pengumuman.
            </div>
          ) : (
            <div className="w-full max-w-[980px]">
              <div
                className="relative overflow-hidden rounded-lg"
                onClick={() => setControlsVisible((v) => !v)}
              >
                {/* Slides */}
                <div
                  className="flex transition-transform duration-600 ease-in-out"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {announcements.map((item) => (
                    <article
                      key={item.id}
                      className="w-full flex-shrink-0 p-2"
                      style={{ width: "100%" }}
                    >
                      <div className="relative rounded-lg overflow-hidden shadow-lg bg-white">
                        <div className="relative">
                          {typeof item.image === "string" && item.image ? (
                            <img
                              src={item.image}
                              alt={item.title ?? `pengumuman-${item.id}`}
                              className="w-full h-96 object-cover transition-transform duration-500 transform-gpu hover:scale-105"
                              draggable={false}
                              onClick={() => openDetail(item)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  openDetail(item);
                              }}
                              role="button"
                              tabIndex={0}
                            />
                          ) : (
                            <div
                              className="w-full h-56 flex items-center justify-center bg-gray-100 text-gray-500 text-sm"
                              onClick={() => openDetail(item)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  openDetail(item);
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              Tidak ada gambar
                            </div>
                          )}

                          {/* gradient overlay - jangan tangkap pointer */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Prev/Next - ikon Lucide, muncul on hover OR after click */}
                {announcements.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Sebelumnya"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(
                          (i) =>
                            (i - 1 + announcements.length) %
                            announcements.length
                        );
                        setControlsVisible(true);
                      }}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 shadow-md transition-opacity duration-200 ${
                        controlsVisible
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/85 hover:bg-white">
                        <ChevronLeft className="h-5 w-5 text-zinc-700" />
                      </div>
                    </button>

                    <button
                      type="button"
                      aria-label="Berikutnya"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex((i) => (i + 1) % announcements.length);
                        setControlsVisible(true);
                      }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 shadow-md transition-opacity duration-200 ${
                        controlsVisible
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/85 hover:bg-white">
                        <ChevronRight className="h-5 w-5 text-zinc-700" />
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* indicators */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {announcements.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 w-8 rounded-full transition-all ${
                      idx === activeIndex ? "bg-sky-600 w-10" : "bg-zinc-200"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      slideTo(idx);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal detail */}
      {isModalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl overflow-hidden bg-white shadow-2xl transform transition-all duration-300">
            <div className="flex items-start justify-between gap-4 p-4 border-b">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-zinc-900">
                  {selected.title}
                </h2>
                <div className="mt-1 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      Number(selected.status) === 1 || selected.status === true
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {Number(selected.status) === 1 || selected.status === true
                      ? "Aktif"
                      : "Nonaktif"}
                  </span>
                  <div className="text-xs text-zinc-500">
                    {displayDate(selected.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(selected)}
                  className="inline-flex items-center gap-2 rounded-md bg-sky-50 px-3 py-1 text-sm text-sky-700 hover:bg-sky-100"
                >
                  <Share2 className="h-4 w-4" /> Bagikan
                </button>

                <button
                  type="button"
                  onClick={closeDetail}
                  className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
                  aria-label="Tutup"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <div className="prose max-w-none text-zinc-800 whitespace-pre-line">
                  {selected.content}
                </div>
              </div>

              <aside>
                {typeof selected.image === "string" && selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-64 object-cover rounded-md shadow-sm"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400">
                    Tidak ada gambar
                  </div>
                )}

                {/* copy feedback */}
                {copied && (
                  <div className="mt-3 rounded-md bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                    Link disalin
                  </div>
                )}
              </aside>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t">
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-md bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}