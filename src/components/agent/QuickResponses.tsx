
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, X } from 'lucide-react';

interface QuickResponsesProps {
  responses: string[];
  onResponseSelect: (response: string) => void;
}

export const QuickResponses = ({ responses, onResponseSelect }: QuickResponsesProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Quick Response Toggle Button */}
      <Button 
        onClick={() => setIsVisible(!isVisible)}
        className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
      >
        <Zap className="w-5 h-5" />
      </Button>

      {/* Floating Quick Responses Box - Squared and Floating */}
      {isVisible && (
        <div className="absolute bottom-16 right-0">
          <Card className="w-80 max-h-96 border-2 border-orange-200 shadow-xl bg-white rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Quick Responses</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0 hover:bg-slate-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {responses.map((response, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      onResponseSelect(response);
                      setIsVisible(false);
                    }}
                    className="text-xs h-auto p-3 bg-slate-50 border-slate-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-200 rounded-lg font-medium text-left justify-start whitespace-normal"
                  >
                    <span className="line-clamp-2">
                      {response}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
