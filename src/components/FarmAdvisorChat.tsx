import { useState } from 'react';
import { Send, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
  needsOpenAI?: boolean;
}

interface ConfirmationRequest {
  toolCall: {
    id: string;
    name: string;
    args: Record<string, unknown>;
  };
  confirmationData: {
    action: string;
    details: Record<string, unknown>;
    preview: string;
  };
  question: string;
}

export default function FarmAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "👋 G'day! I'm your Farm Advisor. Ask me about your mobs, breeding statistics, or farm management advice.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationRequest | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBaseUrl}/farm-advisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Check if this requires confirmation
      if (data.requiresConfirmation) {
        setPendingConfirmation(data);
        const confirmMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: `⚠️ Confirmation Required: ${data.confirmationData.preview}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMessage]);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response || "Sorry, I couldn't process that question.",
        timestamp: new Date(),
        toolsUsed: data.toolsUsed,
        needsOpenAI: data.needsOpenAI,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Farm Advisor error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          "Sorry, I'm having trouble connecting right now. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleConfirmation = async (confirmed: boolean) => {
    if (!pendingConfirmation) return;

    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBaseUrl}/farm-advisor/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolCall: pendingConfirmation.toolCall,
          confirmed,
        }),
      });

      const data = await response.json();

      let statusMessage: Message;
      if (confirmed && data.success) {
        statusMessage = {
          id: Date.now().toString(),
          type: 'system',
          content: `✅ ${data.message}`,
          timestamp: new Date(),
        };
      } else if (!confirmed) {
        statusMessage = {
          id: Date.now().toString(),
          type: 'system',
          content: '❌ Operation cancelled',
          timestamp: new Date(),
        };
      } else {
        throw new Error(data.error || 'Failed to execute operation');
      }

      setMessages((prev) => [...prev, statusMessage]);
      setPendingConfirmation(null);
    } catch (error) {
      console.error('Confirmation error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: '⚠️ Error executing operation. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What's my best performing mob?",
    "What's my average scanning percentage?",
    'How many mobs do I have?',
    'Which mob is struggling?',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg p-3 max-w-[85%] ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.toolsUsed && message.toolsUsed.length > 0 && (
                <div className="text-xs mt-2 pt-2 border-t border-gray-300 text-gray-600">
                  🛠️ Tools used: {message.toolsUsed.join(', ')}
                </div>
              )}
              {message.needsOpenAI && (
                <div className="text-xs mt-2 pt-2 border-t border-blue-300 text-blue-600">
                  💡 OpenAI integration available for advanced features
                </div>
              )}
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString('en-AU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 text-gray-800 border border-gray-200 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && !isLoading && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInput(question)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {pendingConfirmation && (
        <div className="mb-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 text-sm mb-1">
                {pendingConfirmation.confirmationData.action}
              </h4>
              <p className="text-sm text-yellow-800 mb-2">
                {pendingConfirmation.confirmationData.preview}
              </p>
              <div className="text-xs text-yellow-700 space-y-1">
                {Object.entries(pendingConfirmation.confirmationData.details).map(
                  ([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {String(value)}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleConfirmation(false)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center gap-1 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={() => handleConfirmation(true)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your flock..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Send</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
