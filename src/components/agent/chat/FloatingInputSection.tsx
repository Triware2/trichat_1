import { MessageInputArea } from '../MessageInputArea';

interface FloatingInputSectionProps {
  message: string;
  setMessage: (message: string) => void;
  isPrivateNoteMode: boolean;
  setIsPrivateNoteMode: (mode: boolean) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
  onImageUpload: () => void;
  setShowCannedResponses: (show: boolean) => void;
}

export const FloatingInputSection = ({
  message,
  setMessage,
  isPrivateNoteMode,
  setIsPrivateNoteMode,
  onSendMessage,
  onFileUpload,
  onImageUpload,
  setShowCannedResponses,
}: FloatingInputSectionProps) => {
  return (
    <div className="bg-white p-4 border-t border-slate-100">
        {/* Message Input */}
        <MessageInputArea
          message={message}
          setMessage={setMessage}
          isPrivateNoteMode={isPrivateNoteMode}
          setIsPrivateNoteMode={setIsPrivateNoteMode}
          onSendMessage={onSendMessage}
          onFileUpload={onFileUpload}
          onImageUpload={onImageUpload}
        setShowCannedResponses={setShowCannedResponses}
        />
    </div>
  );
};
