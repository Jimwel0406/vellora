// Deterministic color assignment for products/stores based on ID
// Returns Tailwind gradient classes for backgrounds and text colors for initials

const gradients = [
  "bg-gradient-to-br from-rose-400/20 via-orange-300/10 to-amber-400/20",
  "bg-gradient-to-br from-violet-400/20 via-fuchsia-300/10 to-purple-400/20",
  "bg-gradient-to-br from-emerald-400/20 via-teal-300/10 to-cyan-400/20",
  "bg-gradient-to-br from-sky-400/20 via-blue-300/10 to-indigo-400/20",
  "bg-gradient-to-br from-amber-400/20 via-yellow-300/10 to-lime-400/20",
  "bg-gradient-to-br from-pink-400/20 via-rose-300/10 to-red-400/20",
];

const textColors = [
  "text-rose-600",
  "text-violet-600",
  "text-emerald-600",
  "text-sky-600",
  "text-amber-600",
  "text-pink-600",
];

const darkGradients = [
  "bg-gradient-to-br from-rose-900/40 via-orange-900/20 to-amber-900/40",
  "bg-gradient-to-br from-violet-900/40 via-fuchsia-900/20 to-purple-900/40",
  "bg-gradient-to-br from-emerald-900/40 via-teal-900/20 to-cyan-900/40",
  "bg-gradient-to-br from-sky-900/40 via-blue-900/20 to-indigo-900/40",
  "bg-gradient-to-br from-amber-900/40 via-yellow-900/20 to-lime-900/40",
  "bg-gradient-to-br from-pink-900/40 via-rose-900/20 to-red-900/40",
];

export function getProductGradient(id: number, isDark = false) {
  const idx = id % gradients.length;
  return isDark ? darkGradients[idx] : gradients[idx];
}

export function getProductTextColor(id: number) {
  return textColors[id % textColors.length];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
