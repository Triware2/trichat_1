
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  File, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Download,
  Eye,
  Brain,
  Database
} from 'lucide-react';

interface SOPDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'markdown';
  size: string;
  status: 'processing' | 'ready' | 'error';
  uploadDate: string;
  chunks: number;
  embedding_status?: string;
}

export const SOPUploadManager = () => {
  const [sopDocuments, setSopDocuments] = useState<SOPDocument[]>([
    {
      id: '1',
      name: 'Customer Support SOP.pdf',
      type: 'pdf',
      size: '2.4 MB',
      status: 'ready',
      uploadDate: '2024-06-14',
      chunks: 45,
      embedding_status: 'completed'
    },
    {
      id: '2',
      name: 'Technical Troubleshooting Guide.docx',
      type: 'docx',
      size: '1.8 MB',
      status: 'processing',
      uploadDate: '2024-06-14',
      chunks: 32,
      embedding_status: 'in_progress'
    },
    {
      id: '3',
      name: 'Billing Procedures.md',
      type: 'markdown',
      size: '0.5 MB',
      status: 'ready',
      uploadDate: '2024-06-13',
      chunks: 18,
      embedding_status: 'completed'
    }
  ]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
            // Add new document to list
            const newDoc: SOPDocument = {
              id: Date.now().toString(),
              name: files[0].name,
              type: files[0].name.split('.').pop() as 'pdf' | 'docx' | 'markdown',
              size: `${(files[0].size / 1024 / 1024).toFixed(1)} MB`,
              status: 'processing',
              uploadDate: new Date().toISOString().split('T')[0],
              chunks: 0,
              embedding_status: 'pending'
            };
            setSopDocuments(prev => [newDoc, ...prev]);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'docx':
        return <File className="w-5 h-5 text-blue-600" />;
      case 'markdown':
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">SOP Document Management</h2>
          <p className="text-gray-600 mt-1">Upload and manage your Support Standard Operating Procedures</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload SOP Documents</h3>
            <p className="text-gray-600 mb-4">
              Support for PDF, DOCX, and Markdown files up to 10MB each
            </p>
            
            {isUploading ? (
              <div className="space-y-4">
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-gray-600">Processing document... {uploadProgress}%</p>
              </div>
            ) : (
              <div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx,.md"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  or drag and drop files here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Processing Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Document Processing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">1. Upload</h4>
              <p className="text-sm text-blue-700">File validation & storage</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-purple-900">2. Parse</h4>
              <p className="text-sm text-purple-700">Text extraction & chunking</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-900">3. Embed</h4>
              <p className="text-sm text-green-700">Vector embeddings generation</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium text-orange-900">4. Index</h4>
              <p className="text-sm text-orange-700">Knowledge base integration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sopDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.chunks} chunks</span>
                      <span>•</span>
                      <span>Uploaded {doc.uploadDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  
                  {doc.status === 'processing' && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-blue-600">Processing...</span>
                    </div>
                  )}
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{sopDocuments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Text Chunks</p>
                <p className="text-2xl font-bold">{sopDocuments.reduce((acc, doc) => acc + doc.chunks, 0)}</p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready Documents</p>
                <p className="text-2xl font-bold text-green-600">
                  {sopDocuments.filter(doc => doc.status === 'ready').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
