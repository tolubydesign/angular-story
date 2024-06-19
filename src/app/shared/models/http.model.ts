
export type HTTPSuccessResponse<T = any> = {
  type: string,
  data: T,
  message: string,
}

export type HTTPErrorResponse = {
  errorMessage: string,
  code: number,
}
