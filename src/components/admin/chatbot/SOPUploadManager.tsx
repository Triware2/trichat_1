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
  Settings,
  Cloud,
  Shield,
  Zap
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Knowledge Base Management</h2>
            <p className="text-blue-600 font-medium mt-2 text-lg">AI Document Intelligence & Training Platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Download className="w-4 h-4 mr-2" />
              Export Knowledge Base
            </Button>
          </div>
        </div>

        {/* Bot Selection */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Select AI Assistant</CardTitle>
                <p className="text-blue-600 font-medium mt-1">Choose the chatbot to manage knowledge base</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Select value={activeBot} onValueChange={setActiveBot}>
              <SelectTrigger className="w-full max-w-md border-blue-200 focus:border-blue-400 focus:ring-blue-200">
                <SelectValue placeholder="Choose an AI-powered assistant" />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200 shadow-xl">
                {llmBots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">{bot.name}</span>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {bot.model}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeBot && (
              <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl border border-purple-100/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800">
                      Managing: {llmBots.find(b => b.id === activeBot)?.name}
                    </p>
                    <p className="text-sm text-blue-600">AI Services Integration Active</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="text-xs bg-white/70 border-emerald-200 text-emerald-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure Processing
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-white/70 border-blue-200 text-blue-700">
                    <Cloud className="w-3 h-3 mr-1" />
                    Cloud Intelligence
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {activeBot && (
          <>
            {/* Upload Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-md">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Document Upload</CardTitle>
                    <p className="text-blue-600 font-medium mt-1">AI Document Intelligence Processing</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-blue-400 transition-all duration-300 group">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mx-auto w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold text-gray-800">Upload Knowledge Documents</p>
                    <p className="text-blue-600 font-medium">Drag & drop or click to browse files</p>
                    <p className="text-sm text-gray-600">
                      Supported: PDF, DOCX, TXT, MD • Maximum: 10MB per file
                    </p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleFileUpload}
                    className="mt-6 max-w-xs mx-auto border-blue-200 focus:border-blue-400"
                  />
                </div>

                {isUploading && (
                  <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-blue-800">Processing with AI...</span>
                      <span className="text-blue-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full h-3 bg-blue-100" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SOP Documents List */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Knowledge Base Documents</CardTitle>
                    <p className="text-blue-600 font-medium mt-1">AI-processed documentation library</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(sopDocuments.length > 0 ? sopDocuments : mockSOPs).map(sop => (
                    <div key={sop.id} className="flex items-center justify-between p-6 border border-blue-100 rounded-xl bg-gradient-to-r from-white to-blue-50/30 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                          {getStatusIcon(sop.status)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{sop.name}</h3>
                          <p className="text-blue-600 font-medium">{sop.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-700 font-medium">
                              {sop.type}
                            </Badge>
                            <span className="text-xs text-gray-600 font-medium">{sop.size} MB</span>
                            <span className="text-xs text-blue-600 font-medium">Processed: {sop.uploadDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(sop.status)} font-medium px-3 py-1.5 rounded-full`}>
                          {sop.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteSOP(sop.id)} className="border-red-200 text-red-700 hover:bg-red-50">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {sopDocuments.length === 0 && mockSOPs.length === 0 && (
                    <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mx-auto w-fit mb-6">
                        <Database className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-xl font-semibold text-gray-800 mb-2">No documents uploaded yet</p>
                      <p className="text-blue-600 font-medium">Upload your first knowledge document to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Training Status */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">AI Training Status</CardTitle>
                    <p className="text-blue-600 font-medium mt-1">Real-time model performance metrics</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-sm">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-md mx-auto w-fit mb-4">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-blue-700 mb-2">{mockSOPs.length}</p>
                    <p className="text-blue-600 font-medium">Documents Processed</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 shadow-sm">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md mx-auto w-fit mb-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-700 mb-2">98%</p>
                    <p className="text-emerald-600 font-medium">Training Accuracy</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 shadow-sm">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md mx-auto w-fit mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-purple-700 mb-2">Ready</p>
                    <p className="text-purple-600 font-medium">AI Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
