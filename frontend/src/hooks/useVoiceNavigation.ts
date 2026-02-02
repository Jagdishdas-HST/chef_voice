import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voiceService, parseNavigationCommand } from '@/services/voice.service';
import { useToast } from '@/hooks/use-toast';

export function useVoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!voiceService.isSupported()) {
      console.log('[Voice Navigation] Not supported in this browser');
      return;
    }

    return () => {
      voiceService.stopListening();
    };
  }, []);

  const startListening = () => {
    if (!voiceService.isSupported()) {
      toast({
        title: 'Voice navigation not supported',
        description: 'Please use Chrome, Edge, or Safari',
        variant: 'destructive',
      });
      return;
    }

    voiceService.startListening(
      (result) => {
        console.log('[Voice Navigation] Result:', result);
        setTranscript(result.transcript);

        if (result.isFinal) {
          const route = parseNavigationCommand(result.transcript);
          if (route) {
            console.log('[Voice Navigation] Navigating to:', route);
            toast({
              title: 'Navigating',
              description: `Going to ${route}`,
            });
            navigate(route);
            voiceService.stopListening();
            setIsListening(false);
            setTranscript('');
          }
        }
      },
      (error) => {
        console.error('[Voice Navigation] Error:', error);
        toast({
          title: 'Voice recognition error',
          description: error,
          variant: 'destructive',
        });
        setIsListening(false);
      }
    );

    setIsListening(true);
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
    setTranscript('');
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: voiceService.isSupported(),
  };
}