/**
 * Type-safe environment access.
 *
 * Anything prefixed NEXT_PUBLIC_ is exposed to the browser.
 */

export const env = {
  API_URL:
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  CLOUDINARY_CLOUD: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD ?? "",
  CLOUDINARY_PRESET:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
} as const;