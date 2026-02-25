import { Suspense } from "react";
import OntdekClient from "./OntdekClient";

export default function OntdekPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Laden…</main>}>
      <OntdekClient />
    </Suspense>
  );
}