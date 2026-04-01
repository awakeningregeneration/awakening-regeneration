"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitSupportPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/support", {
      method: "POST",
      body: JSON.stringify({
        title,
        type,
        link,
        description,
      }),
    });

    if (res.ok) {
      router.push("/support");
    } else {
      alert("Something went wrong");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">
        Add a Support Resource
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          placeholder="Type (tool, service, material, etc)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          placeholder="Website link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}