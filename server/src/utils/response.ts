import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
};

export const errorResponse = (
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  error: any = null
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    error: error || undefined,
  };
  return res.status(statusCode).json(payload);
};
