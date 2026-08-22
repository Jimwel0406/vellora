export const STORE_NAME_MAX = 50;
const SAFE_NAME = /^[\p{L}\p{N}\s&.,'!?()-]+$/u;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function nameError(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim())
    return "Store name is required.";
  const name = value.trim();
  if (name.length > STORE_NAME_MAX)
    return `Store name must be ${STORE_NAME_MAX} characters or fewer.`;
  if (!SAFE_NAME.test(name))
    return "Store name can only contain letters, numbers, spaces, and & . , ' - ! ? ( ).";
  return null;
}