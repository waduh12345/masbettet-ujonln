export interface Announcement {
  id: number;
  title: string;
  content: string;
  status: boolean | number;
  created_at: string;
  updated_at: string;
  image: File | string | null;
}