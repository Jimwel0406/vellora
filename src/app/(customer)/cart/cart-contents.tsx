"use client";

import { useEffect, useState } from "react";

export function CartContents({
  initialRowCount,
  empty,
  children,
}: {
  initialRowCount: number;
  empty: React.ReactNode;
  children: React.ReactNode;
}) {
  const [rowCount, setRowCount] = useState(initialRowCount);

  useEffect(() => {
    function handleRemove() {
      setRowCount((prev) => prev - 1);
    }
    window.addEventListener("cart-item-removed", handleRemove);
    return () => window.removeEventListener("cart-item-removed", handleRemove);
  }, []);

  if (rowCount <= 0) return <>{empty}</>;
  return <>{children}</>;
}