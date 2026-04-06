import { Suspense } from "react";
import StoriesSubmitPageClient from "./StoriesSubmitPageClient";

function StoriesSubmitFallback() {
  return <main style={{ padding: 24 }}>Loading story submit page…</main>;
}

export default function StoriesSubmitPage() {
  return (
    <Suspense fallback={<StoriesSubmitFallback />}>
      <StoriesSubmitPageClient />
    </Suspense>
  );
}