
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import JsonViewer from './JsonViewer';
import LoadingSpinner from './LoadingSpinner';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        You
    </div>
);

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const { sender, userText, botResponse } = message;
  const isUser = sender === 'user';

  const formatPatientMessage = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Simple markdown for bullets
      if (line.trim().startsWith('•') || line.trim().startsWith('*')) {
        return <li key={index} className="ml-4 list-disc">{line.trim().substring(1).trim()}</li>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? <UserIcon /> : <BotIcon />}
      <div
        className={`max-w-lg rounded-xl p-4 ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
        }`}
      >
        {isUser && userText}
        {!isUser && botResponse && (
            <div>
              <div className="prose prose-sm max-w-none">
                {formatPatientMessage(botResponse.patientMessage)}
              </div>
              <JsonViewer data={botResponse.jsonData} />
            </div>
        )}
        {!isUser && isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default ChatMessage;
