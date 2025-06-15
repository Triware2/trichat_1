
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Brain,
  Database,
  Settings
} from 'lucide-react';

interface SOPUploadManagerProps {
  selectedBotId?: string | null;
}

interface SOPDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'processing' | 'active' | 'error';
  description?: string;
}

export const SOPUploadManager = ({ selectedBotId }: SOPUploadManagerProps) => {
  const { toast } = useToast();
  const [activeBot, setActiveBot] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [sopDocuments, setSopDocuments] = useState<SOPDocument[]>([]);

  // Update activeBot when selectedBotId changes
  useEffect(() => {
    if (selectedBotId) {
      setActiveBot(selectedBotId);
    }
  }, [selectedBotId]);

  const llmBots = [
    { id: '1', name: 'Customer Support Bot', model: 'GPT-4' },
    { id: '3', name: 'Technical Support AI', model: 'Claude-3' }
  ];

  const mockSOPs: SOPDocument[] = [
    {
      id: '1',
      name: 'Customer Service Guidelines.pdf',
      type: 'PDF',
      size: 2.4,
      uploadDate: '2024-06-14',
      status: 'active',
      description: 'Complete customer service protocols and escalation procedures'
    },
    {
      id: '2',
      name: 'Technical Support Manual.docx',
      type: 'DOCX',
      size: 1.8,
      uploadDate: '2024-06-13',
      status: 'processing',
      description: 'Technical troubleshooting steps and common solutions'
    },
    {
      id: '3',
      name: 'Billing Procedures.txt',
      type: 'TXT',
      size: 0.5,
      uploadDate: '2024-06-12',
      status: 'active',
      description: 'Billing inquiries and payment processing guidelines'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            toast({
              title: "Upload Complete",
              description: `${files[0].name} has been uploaded successfully`,
            });
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleDeleteSOP = (id: string) => {
    const sop = sopDocuments.find(s => s.id === id) || mockSOPs.find(s => s.id === id);
    setSopDocuments(sopDocuments.filter(s => s.id !== id));
    toast({
      title: "SOP Deleted",
      description: `${sop?.name} has been deleted successfully`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">SOP Document Management</h2>
          <p className="text-gray-600 mt-1">Upload and manage Standard Operating Procedures for LLM-powered chatbots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export SOPs
          </Button>
        </div>
      </div>

      {/* Bot Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select LLM Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={activeBot} onValueChange={setActiveBot}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose an LLM bot to manage SOPs" />
            </SelectTrigger>
            <SelectContent>
              {llmBots.map(bot => (
                <SelectItem key={bot.id} value={bot.id}>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    {bot.name} ({bot.model})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeBot && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                Managing SOPs for: <span className="font-semibold">{llmBots.find(b => b.id === activeBot)?.name}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {activeBot && (
        <>
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload New SOP Documents</CardTitle>
              <p className="text-sm text-gray-600">
                Supported formats: PDF, DOCX, TXT, MD. Maximum file size: 10MB
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-500">Upload your SOP documents to train the AI</p>
                </div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileUpload}
                  className="mt-4 max-w-xs mx-auto"
                />
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SOP Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded SOP Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(sopDocuments.length > 0 ? sopDocuments : mockSOPs).map(sop => (
                  <div key={sop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(sop.status)}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{sop.name}</h3>
                        <p className="text-sm text-gray-600">{sop.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{sop.type}</Badge>
                          <span className="text-xs text-gray-500">{sop.size} MB</span>
                          <span className="text-xs text-gray-500">Uploaded: {sop.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(sop.status)}>
                        {sop.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteSOP(sop.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {sopDocuments.length === 0 && mockSOPs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No SOP documents uploaded yet</p>
                    <p className="text-sm">Upload your first document above to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Training Status */}
          <Card>
            <CardHeader>
              <CardTitle>AI Training Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-900">{mockSOPs.length}</p>
                  <p className="text-sm text-blue-700">Documents Processed</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">98%</p>
                  <p className="text-sm text-green-700">Training Accuracy</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-900">Ready</p>
                  <p className="text-sm text-purple-700">AI Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
