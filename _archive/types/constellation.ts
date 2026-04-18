export type ConstellationSignal = {
  id: string;
  title: string;
  description: string;
  region: string | null;
  category: string | null;
  link: string;
  practices?: string[] | null;
  image_url?: string;
  created_at?: string;
};
