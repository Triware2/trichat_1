
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
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg">
      {/* Canned Responses Panel - appears above input when open */}
      {showCannedResponses && (
        <div className="h-96 border-b border-slate-200 bg-white">
          <CannedResponses 
            onSelectResponse={onCannedResponseSelect}
            isSelectionMode={true}
          />
        </div>
      )}

      {/* Message Input Container */}
      <div className="bg-white">
        {/* Canned Responses Toggle */}
        <CannedResponsesToggle 
          showCannedResponses={showCannedResponses}
          onToggle={() => setShowCannedResponses(!showCannedResponses)}
        />

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
