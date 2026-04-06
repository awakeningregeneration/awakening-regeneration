import { Suspense } from "react";
import SubmitPageClient from "./SubmitPageClient";

function SubmitFallback() {
  return <main style={{ padding: 24 }}>Loading submit page…</main>;
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<SubmitFallback />}>
      <SubmitPageClient />
    </Suspense>
  );
}