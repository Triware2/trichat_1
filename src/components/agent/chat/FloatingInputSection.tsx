
import { CannedResponses } from '../CannedResponses';
import { MessageInputArea } from '../MessageInputArea';
import { CannedResponsesToggle } from './CannedResponsesToggle';

interface CannedResponse {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: string;
}

interface FloatingInputSectionProps {
  showCannedResponses: boolean;
  setShowCannedResponses: (show: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  isPrivateNoteMode: boolean;
  setIsPrivateNoteMode: (mode: boolean) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
  onImageUpload: () => void;
  onCannedResponseSelect: (response: CannedResponse) => void;
}

export const FloatingInputSection = ({
  showCannedResponses,
  setShowCannedResponses,
  message,
  setMessage,
  isPrivateNoteMode,
  setIsPrivateNoteMode,
  onSendMessage,
  onFileUpload,
  onImageUpload,
  onCannedResponseSelect
}: FloatingInputSectionProps) => {
  return (
    <div className="w-full bg-white">
      {/* Canned Responses Panel - slides up from bottom */}
      {showCannedResponses && (
        <div className="border-b border-slate-200 bg-white shadow-inner">
          <div className="h-80 overflow-y-auto">
            <CannedResponses 
              onSelectResponse={onCannedResponseSelect}
              isSelectionMode={true}
            />
          </div>
        </div>
      )}

      {/* Input Container - Always visible at bottom */}
      <div className="bg-white border-t border-slate-100">
        {/* Canned Responses Toggle */}
        <CannedResponsesToggle 
          showCannedResponses={showCannedResponses}
          onToggle={() => setShowCannedResponses(!showCannedResponses)}
        />

        {/* Message Input */}
        <MessageInputArea
          message={message}
          setMessage={setMessage}
          isPrivateNoteMode={isPrivateNoteMode}
          setIsPrivateNoteMode={setIsPrivateNoteMode}
          onSendMessage={onSendMessage}
          onFileUpload={onFileUpload}
          onImageUpload={onImageUpload}
        />
      </div>
    </div>
  );
};
