
import { useState, useCallback } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
}

export const useErrorBoundary = () => {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const captureError = useCallback((error: Error, errorInfo?: any) => {
    setError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    });
    
    // Log to console for debugging
    console.error('Error captured by boundary:', error, errorInfo);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    captureError,
    clearError,
    hasError: !!error
  };
};
