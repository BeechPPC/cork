import type { Request, Response, NextFunction } from 'express';

// Standard error response interface
export interface ApiError {
  message: string;
  error?: string;
  details?: any;
  stack?: string;
}

// Custom error class for API errors
export class ApiError extends Error {
  public statusCode: number;
  public errorCode?: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, errorCode?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, ApiError);
  }
}

// Standardized error handler middleware
export function standardErrorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  // Don't handle if response already sent
  if (res.headersSent) {
    return next(error);
  }

  // Default error values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorCode = "INTERNAL_ERROR";
  let details = undefined;

  // Handle different error types
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorCode = error.errorCode || "API_ERROR";
    details = error.details;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = "Validation failed";
    errorCode = "VALIDATION_ERROR";
    details = error.details || error.message;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = "Invalid ID format";
    errorCode = "INVALID_ID";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "Resource already exists";
    errorCode = "DUPLICATE_RESOURCE";
  } else if (error.status || error.statusCode) {
    statusCode = error.status || error.statusCode;
    message = error.message || message;
    errorCode = error.code || "HTTP_ERROR";
  }

  // Log error for debugging
  console.error("Standardized error handler:", {
    statusCode,
    message,
    errorCode,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Build response
  const response: ApiError = {
    message,
    error: errorCode
  };

  // Add details in development
  if (process.env.NODE_ENV === 'development' && details) {
    response.details = details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}

// Helper function to create standardized errors
export function createApiError(message: string, statusCode: number = 500, errorCode?: string, details?: any): ApiError {
  return new ApiError(message, statusCode, errorCode, details);
}

// Common error creators
export const errors = {
  badRequest: (message: string = "Bad Request", details?: any) => 
    createApiError(message, 400, "BAD_REQUEST", details),
  
  unauthorized: (message: string = "Unauthorized") => 
    createApiError(message, 401, "UNAUTHORIZED"),
  
  forbidden: (message: string = "Forbidden") => 
    createApiError(message, 403, "FORBIDDEN"),
  
  notFound: (message: string = "Not Found") => 
    createApiError(message, 404, "NOT_FOUND"),
  
  conflict: (message: string = "Conflict") => 
    createApiError(message, 409, "CONFLICT"),
  
  rateLimited: (message: string = "Too Many Requests") => 
    createApiError(message, 429, "RATE_LIMITED"),
  
  internalServer: (message: string = "Internal Server Error", details?: any) => 
    createApiError(message, 500, "INTERNAL_ERROR", details),
  
  serviceUnavailable: (message: string = "Service Unavailable") => 
    createApiError(message, 503, "SERVICE_UNAVAILABLE")
};