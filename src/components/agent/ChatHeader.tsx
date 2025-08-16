import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ResolveButton } from './disposition/ResolveButton';
import { DispositionModal } from './disposition/DispositionModal';
import { useChatResolution } from './disposition/useChatResolution';
import { Pencil, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  customerName: string;
  customerStatus: string;
  chatId: string | null;
  agentName: string;
  subject?: string;
  onSubjectChange?: (newSubject: string) => Promise<void>;
}

export const ChatHeader = ({ customerName, customerStatus, chatId, agentName, subject, onSubjectChange }: ChatHeaderProps) => {
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const { resolveChat, isChatResolved } = useChatResolution();
  
  const chatStatus = isChatResolved(chatId) ? 'resolved' : 'active';

  const handleResolve = () => {
    setShowDispositionModal(true);
  };

  const handleChatResolution = async (resolution: any) => {
    await resolveChat(resolution);
    setShowDispositionModal(false);
  };

  // Subject editing state
  const [editing, setEditing] = useState(false);
  const [subjectInput, setSubjectInput] = useState(subject || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setSubjectInput(subject || '');
    setEditing(true);
    setError(null);
  };
  const cancelEdit = () => {
    setEditing(false);
    setSubjectInput(subject || '');
    setError(null);
  };
  const saveEdit = async () => {
    if (!onSubjectChange) return;
    if (!subjectInput.trim()) {
      setError('Subject cannot be empty');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubjectChange(subjectInput.trim());
      setEditing(false);
    } catch (e: any) {
      setError(e.message || 'Failed to update subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
              {customerName.charAt(0).toUpperCase()}
            </div>
            {/* Info Block */}
            <div className="flex flex-col min-w-0 flex-1">
              {/* Name and Status Row */}
              <div className="flex items-center gap-3 min-w-0 mb-1">
                <h2 className="text-lg font-semibold text-slate-900 truncate">{customerName}</h2>
                {/* Status badge */}
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${customerStatus === 'Online' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                >
                  {customerStatus}
                </Badge>
              </div>
              
              {/* Subject Row */}
              <div className="flex items-center gap-2 min-w-0">
                {editing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={subjectInput}
                      onChange={e => setSubjectInput(e.target.value)}
                      className="flex-1 text-sm h-8 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={loading}
                      autoFocus
                      placeholder="Enter subject..."
                    />
                    <Button size="sm" onClick={saveEdit} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} disabled={loading} className="border-slate-200 hover:bg-slate-50">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-slate-600 font-medium">
                      Subject: <span className="text-slate-900">{subject || 'No subject'}</span>
                    </span>
                    <Button size="sm" variant="ghost" onClick={startEdit} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {error && (
                  <span className="text-xs text-red-600 ml-2">{error}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Chat actions */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              Chat #{chatId}
            </Badge>
            <Badge 
              variant={chatStatus === 'resolved' ? 'default' : 'secondary'}
              className={chatStatus === 'resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}
            >
              {chatStatus === 'resolved' ? 'Resolved' : 'Active'}
            </Badge>
            <ResolveButton 
              onResolve={handleResolve} 
              disabled={chatStatus === 'resolved'}
              chatStatus={chatStatus}
            />
          </div>
        </div>
      </div>
      
      <DispositionModal
        isOpen={showDispositionModal}
        onClose={() => setShowDispositionModal(false)}
        onResolve={handleChatResolution}
        chatId={chatId || ''}
        customerName={customerName}
      />
    </>
  );
};
