
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TestTube, Send, RefreshCw } from 'lucide-react';

interface TestResult {
  id: string;
  input: string;
  matchedRule?: string;
  response: string;
  confidence: number;
  timestamp: Date;
}

export const RuleTestingInterface = () => {
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mockRules = [
    { id: '1', trigger: 'billing', response: 'I can help you with billing questions. What specific billing issue do you have?' },
    { id: '2', trigger: 'order', response: 'To check your order status, please provide your order number.' },
    { id: '3', trigger: 'support', response: 'I\'m here to help! What can I assist you with today?' }
  ];

  const handleTest = async () => {
    if (!testInput.trim()) return;

    setIsLoading(true);

    // Simulate rule matching
    await new Promise(resolve => setTimeout(resolve, 1000));

    const matchedRule = mockRules.find(rule => 
      testInput.toLowerCase().includes(rule.trigger.toLowerCase())
    );

    const result: TestResult = {
      id: Date.now().toString(),
      input: testInput,
      matchedRule: matchedRule?.trigger,
      response: matchedRule?.response || 'I didn\'t understand that. Could you please rephrase?',
      confidence: matchedRule ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3,
      timestamp: new Date()
    };

    setTestResults([result, ...testResults]);
    setTestInput('');
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Rule Testing Interface</h3>
        <Button variant="outline" onClick={clearResults} disabled={testResults.length === 0}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear Results
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-blue-600" />
            Test Your Bot Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test-input">Test Message</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="test-input"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type a message to test against your rules..."
                onKeyPress={(e) => e.key === 'Enter' && handleTest()}
              />
              <Button onClick={handleTest} disabled={!testInput.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map(result => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.timestamp.toLocaleTimeString()}
                      </Badge>
                      {result.matchedRule && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Matched: {result.matchedRule}
                        </Badge>
                      )}
                      <Badge 
                        className={`text-xs ${
                          result.confidence > 0.7 ? 'bg-green-100 text-green-800' : 
                          result.confidence > 0.4 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {Math.round(result.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Input:</p>
                      <p className="text-sm bg-gray-50 p-2 rounded">{result.input}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Bot Response:</p>
                      <p className="text-sm bg-blue-50 p-2 rounded">{result.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {testResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No test results yet. Enter a message above to test your bot rules.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
