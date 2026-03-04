export type Story = {
  id: string;
  createdAt?: string;

  state: string;
  county: string;

  title?: string;
  body: string; // keep short

  link?: string; // optional source / project link
};
