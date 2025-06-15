
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  description?: string;
}

export const ErrorFallback = ({ 
  error, 
  resetError, 
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again."
}: ErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{description}</p>
          
          {error && (
            <details className="text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                Technical Details
              </summary>
              <pre className="text-xs text-gray-700 mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          
          {resetError && (
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
