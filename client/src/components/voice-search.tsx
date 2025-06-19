import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export default function VoiceSearch({ onSearch, isSearching = false, isPremium, onUpgrade }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          onSearch(finalTranscript);
          setTranscript('');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSearch]);

  const startListening = () => {
    if (!isPremium) {
      onUpgrade?.();
      return;
    }

    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Voice search is not supported in this browser. Try Chrome, Safari, or Edge.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isSearching}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className={cn(
                "relative",
                isListening && "animate-pulse",
                !isPremium && "opacity-75"
              )}
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
              {isListening ? "Stop Listening" : "Start Voice Search"}
              {!isPremium && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1 rounded">
                  PRO
                </span>
              )}
            </Button>
          </div>

          {isListening && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Listening... speak your wine preferences
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {transcript && (
            <div className="w-full p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Heard:</div>
              <div className="text-sm">{transcript}</div>
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground max-w-sm">
            Try saying: "Find me a smooth red wine under $30" or "I want a crisp white wine for seafood"
          </div>

          {!isPremium && (
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                Premium Feature
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                Voice search is available with Premium subscription
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}