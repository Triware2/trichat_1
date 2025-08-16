
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TestTube, Send, RotateCcw } from 'lucide-react';

export const RuleTestingInterface = () => {
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);

  const handleTestRule = () => {
    if (!testInput.trim()) return;

    // Mock test result
    const mockResult = {
      id: Date.now(),
      input: testInput,
      matchedRules: [
        {
          ruleName: 'Sample Response Rule',
          confidence: 0.95,
          response: 'This is a sample response based on your input.',
          executionTime: '12ms'
        }
      ],
      timestamp: new Date().toISOString()
    };

    setTestResults([mockResult, ...testResults]);
    setTestInput('');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Rule Testing Interface</h3>
          <p className="text-slate-600">Test your rules with sample inputs and see how they perform</p>
        </div>
        <Button
          variant="outline"
          onClick={clearResults}
          className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white text-slate-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear Results
        </Button>
      </div>

      {/* Test Input */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-4 h-4 text-blue-600" />
            </div>
            Test Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-input" className="text-sm font-medium text-slate-700">
              Enter test message
            </Label>
            <div className="flex gap-3">
              <Input
                id="test-input"
                placeholder="Type a message to test your rules..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTestRule()}
                className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button
                onClick={handleTestRule}
                disabled={!testInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              >
                <Send className="w-4 h-4 mr-2" />
                Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">
            Test Results ({testResults.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TestTube className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">No test results yet. Start testing your rules above.</p>
            </div>
          ) : (
            testResults.map((result) => (
              <div
                key={result.id}
                className="bg-slate-50/80 rounded-xl p-4 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50/80 text-blue-700 border-blue-200/50">
                      Test Input
                    </Badge>
                    <span className="text-sm text-slate-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-lg p-3 mb-3">
                  <p className="text-slate-900 font-medium">{result.input}</p>
                </div>

                {result.matchedRules.map((rule: any, index: number) => (
                  <div key={index} className="bg-green-50/80 rounded-lg p-3 border border-green-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">{rule.ruleName}</h4>
                      <Badge variant="outline" className="bg-green-100/80 text-green-700 border-green-200/50">
                        {rule.confidence * 100}% confidence
                      </Badge>
                    </div>
                    <p className="text-green-700 mb-2">{rule.response}</p>
                    <div className="flex items-center gap-4 text-xs text-green-600">
                      <span>Execution time: {rule.executionTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
