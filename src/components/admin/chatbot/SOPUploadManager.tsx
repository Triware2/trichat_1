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
import { chatbotService, Chatbot, ChatbotSOP } from '@/services/chatbotService';
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

export const SOPUploadManager = ({ selectedBotId }: SOPUploadManagerProps) => {
  const { toast } = useToast();
  const [activeBot, setActiveBot] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [sopDocuments, setSopDocuments] = useState<ChatbotSOP[]>([]);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  // Load chatbots and SOPs
  useEffect(() => {
    loadChatbots();
  }, []);

  useEffect(() => {
    if (activeBot) {
      loadSOPs(activeBot);
    }
  }, [activeBot]);

  // Update activeBot when selectedBotId changes
  useEffect(() => {
    if (selectedBotId) {
      setActiveBot(selectedBotId);
    }
  }, [selectedBotId]);

  const loadChatbots = async () => {
    try {
      setLoading(true);
      const data = await chatbotService.getChatbots();
      const llmBots = data.filter(bot => bot.type === 'llm');
      setChatbots(llmBots);
    } catch (error) {
      console.error('Error loading chatbots:', error);
      toast({
        title: "Error",
        description: "Failed to load chatbots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSOPs = async (chatbotId: string) => {
    try {
      const data = await chatbotService.getChatbotSOPs(chatbotId);
      setSopDocuments(data);
    } catch (error) {
      console.error('Error loading SOPs:', error);
      toast({
        title: "Error",
        description: "Failed to load SOP documents. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && activeBot) {
      setIsUploading(true);
      setUploadProgress(0);
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Upload file to Supabase
        const uploadedSOP = await chatbotService.uploadSOPFile(files[0], activeBot);
        
        // Update SOP status to active
        await chatbotService.updateChatbotSOP(uploadedSOP.id, { status: 'active' });
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Add to local state
        setSopDocuments(prev => [uploadedSOP, ...prev]);
        
        // Update chatbot SOP count
        await chatbotService.updateChatbot(activeBot, {
          sop_count: (sopDocuments.length + 1)
        });
        
        toast({
          title: "Upload Complete",
          description: `${files[0].name} has been uploaded and processed successfully`,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload file. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleDeleteSOP = async (id: string) => {
    try {
      const sop = sopDocuments.find(s => s.id === id);
      if (!sop) return;

      await chatbotService.deleteChatbotSOP(id);
      setSopDocuments(prev => prev.filter(s => s.id !== id));
      
      // Update chatbot SOP count
      if (activeBot) {
        await chatbotService.updateChatbot(activeBot, {
          sop_count: Math.max(0, (sopDocuments.length - 1))
        });
      }
      
      toast({
        title: "SOP Deleted",
        description: `${sop.name} has been deleted successfully`,
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting SOP:', error);
      toast({
        title: "Error",
        description: "Failed to delete SOP. Please try again.",
        variant: "destructive"
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-96 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">SOP Upload & Training</h2>
            <p className="text-sm text-slate-600 mt-1">Upload and train your AI with knowledge documents</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Training Data
            </Button>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt,.md,.csv"
                multiple={false}
                disabled={!activeBot || isUploading}
              />
              <Button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!activeBot || isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Documents'}
              </Button>
            </div>
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
                {chatbots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">{bot.name}</span>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {bot.model || 'LLM'}
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
                      Managing: {chatbots.find(b => b.id === activeBot)?.name}
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
                    disabled={isUploading}
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
                  {sopDocuments.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Database className="w-10 h-10 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Documents Yet</h3>
                      <p className="text-slate-600 mb-6">Upload your first document to start building your AI knowledge base.</p>
                    </div>
                  ) : (
                    sopDocuments.map(sop => (
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
                              <span className="text-xs text-gray-600 font-medium">{sop.size?.toFixed(2)} MB</span>
                              <span className="text-xs text-blue-600 font-medium">
                                Processed: {sop.upload_date ? new Date(sop.upload_date).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteSOP(sop.id)}
                            className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
