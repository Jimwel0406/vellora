"use client";

import { useEffect, useState } from "react";

export function CartVendorSection({
  groupId,
  initialRowCount,
  header,
  children,
}: {
  groupId: string;
  initialRowCount: number;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const [rowCount, setRowCount] = useState(initialRowCount);

  useEffect(() => {
    function handleRemove(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.group === groupId) {
        setRowCount((prev) => prev - 1);
      }
    }
    window.addEventListener("cart-item-removed", handleRemove);
    return () => window.removeEventListener("cart-item-removed", handleRemove);
  }, [groupId]);

  if (rowCount <= 0) return null;

  return (
    <section data-section={`cart-store-${groupId}`} className="section-cart-store space-y-6">
      {header}
      {children}
    </section>
  );
}