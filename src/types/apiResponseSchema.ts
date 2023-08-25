export interface IApiResponse<T> {
  status: "error" | "success" | "unauthorized",
  data: T
}