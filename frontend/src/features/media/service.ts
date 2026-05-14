import { axiosInstance } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export const mediaService = {
  async upload(
    file: File,
    purpose: "event-covers" | "event-gallery" | "user-avatars" = "event-covers",
  ): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("purpose", purpose);
    const { data } = await axiosInstance.post<ApiResponse<{ url: string }>>(
      "/media/upload",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (!data.success || !data.data) throw new Error(data.message);
    return data.data.url;
  },
};
