import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  voiceService, 
  parseVoiceCommand,
  parseDeliveryVoiceInput,
  parseTemperatureVoiceInput,
  parseCookVoiceInput,
  parseHotHoldingVoiceInput,
  type VoiceAction
} from '@/services/voice.service';
import { useToast } from '@/hooks/use-toast';

export function useVoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<VoiceAction | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleVoiceCommand = useCallback((action: VoiceAction) => {
    console.log('[Voice Control] Processing action:', action);
    setLastCommand(action);

    switch (action.type) {
      case 'navigation':
        if (action.target) {
          toast({
            title: 'Navigating',
            description: `Going to ${action.target}`,
          });
          navigate(action.target);
        }
        break;

      case 'add':
        toast({
          title: 'Opening form',
          description: `Creating new ${action.target}`,
        });
        // Trigger dialog open event
        window.dispatchEvent(new CustomEvent('voice-add', { detail: action.target }));
        break;

      case 'log':
        toast({
          title: 'Logging data',
          description: `Recording ${action.target}`,
        });
        window.dispatchEvent(new CustomEvent('voice-log', { detail: action.data }));
        break;

      case 'open':
        window.dispatchEvent(new CustomEvent('voice-open-dialog'));
        break;

      case 'close':
        window.dispatchEvent(new CustomEvent('voice-close-dialog'));
        break;

      case 'submit':
        window.dispatchEvent(new CustomEvent('voice-submit-form'));
        break;

      default:
        console.log('[Voice Control] Unknown action type:', action.type);
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (!voiceService.isSupported()) {
      console.log('[Voice Control] Not supported in this browser');
      return;
    }

    return () => {
      voiceService.stopListening();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!voiceService.isSupported()) {
      toast({
        title: 'Voice control not supported',
        description: 'Please use Chrome, Edge, or Safari',
        variant: 'destructive',
      });
      return;
    }

    voiceService.startListening(
      (result) => {
        console.log('[Voice Control] Result:', result);
        setTranscript(result.transcript);

        if (result.isFinal) {
          const action = parseVoiceCommand(result.transcript);
          if (action) {
            handleVoiceCommand(action);
            
            // Auto-stop after successful command
            setTimeout(() => {
              voiceService.stopListening();
              setIsListening(false);
              setTranscript('');
            }, 1000);
          } else {
            // Try context-specific parsing based on current page
            handleContextSpecificCommand(result.transcript);
          }
        }
      },
      (error) => {
        console.error('[Voice Control] Error:', error);
        toast({
          title: 'Voice recognition error',
          description: error,
          variant: 'destructive',
        });
        setIsListening(false);
      }
    );

    setIsListening(true);
    toast({
      title: 'Listening...',
      description: 'Say a command to control the app',
    });
  }, [handleVoiceCommand, toast]);

  const handleContextSpecificCommand = useCallback((transcript: string) => {
    const currentPath = location.pathname;

    if (currentPath === '/delivery') {
      const deliveryData = parseDeliveryVoiceInput(transcript);
      if (deliveryData.supplier || deliveryData.products?.length) {
        window.dispatchEvent(new CustomEvent('voice-delivery-data', { detail: deliveryData }));
        toast({
          title: 'Delivery data captured',
          description: 'Voice input processed',
        });
      }
    } else if (currentPath === '/refrigeration') {
      const tempData = parseTemperatureVoiceInput(transcript);
      if (tempData.temperature) {
        window.dispatchEvent(new CustomEvent('voice-temperature-data', { detail: tempData }));
        toast({
          title: 'Temperature captured',
          description: `${tempData.temperature}°C`,
        });
      }
    } else if (currentPath === '/cook-cool-reheat') {
      const cookData = parseCookVoiceInput(transcript);
      if (cookData.temperature) {
        window.dispatchEvent(new CustomEvent('voice-cook-data', { detail: cookData }));
        toast({
          title: 'Cook data captured',
          description: 'Voice input processed',
        });
      }
    } else if (currentPath === '/hot-holding') {
      const hotHoldingData = parseHotHoldingVoiceInput(transcript);
      if (hotHoldingData.coreTemperature) {
        window.dispatchEvent(new CustomEvent('voice-hot-holding-data', { detail: hotHoldingData }));
        toast({
          title: 'Hot holding data captured',
          description: 'Voice input processed',
        });
      }
    }
  }, [location.pathname, toast]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    lastCommand,
    startListening,
    stopListening,
    isSupported: voiceService.isSupported(),
  };
}