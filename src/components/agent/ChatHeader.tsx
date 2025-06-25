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
      <div className="backdrop-blur-md bg-white/60 shadow-xl rounded-2xl px-6 py-3 flex items-center justify-between gap-x-6 border-b border-slate-200">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-5 min-w-0 flex-1">
          {/* Avatar with glow */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-blue-200/30">
            {customerName.charAt(0).toUpperCase()}
          </div>
          {/* Info Block */}
          <div className="flex flex-col min-w-0">
            {/* Name, Status, Subject Row (all inline) */}
            <div className="flex items-center gap-3 min-w-0 flex-wrap">
              <span className="font-semibold text-lg text-slate-900 truncate max-w-[160px]">{customerName}</span>
              {/* Online/Offline badge only */}
              <span className={`px-2 py-0.5 rounded-full font-semibold shadow-sm border border-slate-200 text-xs ml-0 ${customerStatus === 'Online' ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'}`}>
                {customerStatus === 'Online' ? 'Online' : 'Offline'}
              </span>
              {/* Subject (inline) */}
              {editing ? (
                <>
                  <Input
                    value={subjectInput}
                    onChange={e => setSubjectInput(e.target.value)}
                    className="w-60 text-sm h-8 bg-white/80 backdrop-blur rounded-lg shadow-sm border border-slate-200 ml-2"
                    disabled={loading}
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={saveEdit} disabled={loading}>
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEdit} disabled={loading}>
                    <X className="w-4 h-4 text-slate-400" />
                  </Button>
                  {loading && <span className="text-xs text-slate-400 ml-2">Saving...</span>}
                  {error && <span className="text-xs text-red-500 ml-2">{error}</span>}
                </>
              ) : (
                <>
                  <span className="text-sm font-medium truncate max-w-[200px] px-3 py-1 bg-white/40 rounded-lg shadow-sm backdrop-blur border border-slate-100 text-slate-800 ml-2" title={subject}>
                    {subject || 'No Subject'}
                  </span>
                  {onSubjectChange && (
                    <button
                      className="p-1 rounded hover:bg-slate-100 transition"
                      onClick={startEdit}
                      aria-label="Edit subject"
                    >
                      <Pencil className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </>
              )}
            </div>
            {/* Online/Handled by Row */}
            <div className="flex items-center gap-2 mt-1 min-w-0">
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs text-slate-500 font-medium">Handled by:</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs font-semibold shadow-sm truncate max-w-[140px]">
                {agentName}
              </span>
            </div>
          </div>
        </div>
        {/* Right: Glassy Resolve Button */}
        <div className="flex items-center w-auto justify-end">
          <div className="backdrop-blur bg-white/70 rounded-full shadow-lg">
          <ResolveButton 
            onResolve={handleResolve}
            chatStatus={chatStatus}
            disabled={chatStatus === 'resolved'}
              className="transition-transform hover:scale-105 hover:shadow-xl rounded-full px-6 py-2 text-base font-semibold"
          />
          </div>
        </div>
      </div>

      <DispositionModal
        isOpen={showDispositionModal}
        onClose={() => setShowDispositionModal(false)}
        chatId={chatId || ''}
        customerName={customerName}
        onResolve={handleChatResolution}
      />
    </>
  );
};
