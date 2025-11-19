import { apiSlice } from "./base-query";
import type { Announcement } from "@/types/announcements";

interface GetAnnouncementsParams {
  page: number;
  paginate: number;
  search?: string;
}

export const announcementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all Announcements (paginated)
    getAnnouncements: builder.query<
      {
        data: Announcement[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      GetAnnouncementsParams
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: "/announcement/announcements",
        method: "GET",
        params: { page, paginate, search },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Announcement[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // ✅ GET by ID
    getAnnouncementById: builder.query<Announcement, number>({
      query: (id) => ({
        url: `/announcement/announcements/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Announcement;
      }) => response.data,
    }),

    // ✅ CREATE (pakai FormData karena ada field file "image")
    createAnnouncement: builder.mutation<Announcement, FormData>({
      query: (formData) => ({
        url: "/announcement/announcements",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Announcement;
      }) => response.data,
    }),

    // ✅ UPDATE (PUT via POST + _method=PUT) — payload: FormData (karena image)
    updateAnnouncement: builder.mutation<
      Announcement,
      { id: number; payload: FormData }
    >({
      query: ({ id, payload }) => ({
        url: `/announcement/announcements/${id}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Announcement;
      }) => response.data,
    }),

    // ✅ DELETE
    deleteAnnouncement: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/announcement/announcements/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;