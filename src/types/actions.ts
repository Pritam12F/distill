export type ServerActionDefaultResponse<T> = {
  error?: string;
  message?: string;
  success: boolean;
  data?: T;
};
