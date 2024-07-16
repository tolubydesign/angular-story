
export type HTTPSuccessResponse<T = any> = {
  type: string,
  data: T,
  message: string,
}
