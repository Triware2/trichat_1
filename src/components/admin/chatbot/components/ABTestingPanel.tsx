import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader as CardHeaderUI, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart3, CheckCircle, AlertCircle, Play, X } from 'lucide-react';

interface ABTestingPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  presets: any[];
}

// Placeholder async function for backend A/B test
async function runABTest(presetAId: string, presetBId: string) {
  // Simulate backend processing
  return new Promise<{ winner: string; details: string }>((resolve) => {
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? presetAId : presetBId;
      resolve({
        winner,
        details: `Preset ${winner} outperformed the other in accuracy and user satisfaction.`
      });
    }, 2000);
  });
}

export const ABTestingPanel = ({ isOpen = true, onClose, presets }: ABTestingPanelProps) => {
  const [open, setOpen] = useState(isOpen);
  const [selectedA, setSelectedA] = useState(presets[0]?.id || '');
  const [selectedB, setSelectedB] = useState(presets[1]?.id || '');
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | { winner: string; details: string }> (null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setOpen(isOpen); }, [isOpen]);

  const handleDialogChange = (val: boolean) => {
    setOpen(val);
    if (!val && onClose) onClose();
  };

  const handleStartTest = async () => {
    setIsTesting(true);
    setProgress(0);
    setResult(null);
    setError(null);
    try {
      // Show progress bar
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setProgress(prog);
        if (prog >= 100) clearInterval(interval);
      }, 200);
      // Call backend (placeholder)
      const res = await runABTest(selectedA, selectedB);
      setResult(res);
    } catch (e) {
      setError('A/B Test failed. Please try again.');
    } finally {
      setIsTesting(false);
      setProgress(100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl rounded-2xl shadow-2xl bg-white/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            A/B Testing Panel
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-50 rounded-xl mb-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          <TabsContent value="setup">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-slate-200 bg-slate-50">
                <CardHeaderUI>
                  <CardTitle>Preset A</CardTitle>
                </CardHeaderUI>
                <CardContent>
                  <select
                    className="w-full border rounded p-2"
                    value={selectedA}
                    onChange={e => setSelectedA(e.target.value)}
                  >
                    {presets.map(preset => (
                      <option key={preset.id} value={preset.id}>{preset.name}</option>
                    ))}
                  </select>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 bg-slate-50">
                <CardHeaderUI>
                  <CardTitle>Preset B</CardTitle>
                </CardHeaderUI>
                <CardContent>
                  <select
                    className="w-full border rounded p-2"
                    value={selectedB}
                    onChange={e => setSelectedB(e.target.value)}
                  >
                    {presets.map(preset => (
                      <option key={preset.id} value={preset.id}>{preset.name}</option>
                    ))}
                  </select>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <Button onClick={handleStartTest} disabled={isTesting || selectedA === selectedB} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
                <Play className="w-4 h-4 mr-2" />
                Start A/B Test
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
            {isTesting && (
              <div className="mt-6">
                <Progress value={progress} />
                <div className="text-sm text-slate-600 mt-2">Running A/B test...</div>
              </div>
            )}
            {error && (
              <div className="text-red-600 mt-4 text-center">{error}</div>
            )}
          </TabsContent>
          <TabsContent value="results">
            {result ? (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-700">Winner: {presets.find(p => p.id === result.winner)?.name || result.winner}</span>
                </div>
                <div className="text-slate-700 mt-2">{result.details}</div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                No results yet. Run an A/B test to compare presets.
              </div>
            )}
          </TabsContent>
        </Tabs>
        <DialogFooter>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 