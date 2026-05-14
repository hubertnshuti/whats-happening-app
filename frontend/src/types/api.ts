/**
 * Core API response shapes — matching the backend contract.
 *
 * Every endpoint returns ApiResponse<T>. List endpoints return
 * ApiResponse<PageResponse<T>>.
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiError[] | null;
}

export interface ApiError {
  field?: string;
  code?: string;
  message: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Standard pagination query params */
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}
