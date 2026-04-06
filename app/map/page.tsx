import { Suspense } from "react";
import MapPageClient from "./MapPageClient";

function MapFallback() {
  return <main style={{ padding: 24 }}>Loading map…</main>;
}

export default function MapPage() {
  return (
    <Suspense fallback={<MapFallback />}>
      <MapPageClient />
    </Suspense>
  );
}