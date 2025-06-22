export interface ResponseDto<T> {
  result: T;
  isSuccess: boolean;
  message: string;
}
