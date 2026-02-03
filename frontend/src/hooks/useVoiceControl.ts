import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  parseVoiceCommand,
  parseDeliveryVoiceInput,
  parseTemperatureVoiceInput,
  parseCookVoiceInput,
  parseHotHoldingVoiceInput,
  type VoiceAction
} from '@/services/voice.service';
import { whisperRecorder, transcribeAudio } from '@/services/whisper.service';
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

  const startListening = useCallback(async () => {
    try {
      await whisperRecorder.startRecording();
      setIsListening(true);
      toast({
        title: 'Recording...',
        description: 'Speak your command clearly',
      });
    } catch (error) {
      console.error('[Voice Control] Failed to start recording:', error);
      toast({
        title: 'Microphone access denied',
        description: 'Please allow microphone access',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const stopListening = useCallback(async () => {
    if (!whisperRecorder.isRecording()) {
      return;
    }

    try {
      toast({
        title: 'Processing...',
        description: 'Transcribing your voice command',
      });

      const audioBlob = await whisperRecorder.stopRecording();
      setIsListening(false);

      const result = await transcribeAudio(audioBlob);
      const transcribedText = result.text;
      
      console.log('[Voice Control] Transcription:', transcribedText);
      setTranscript(transcribedText);

      // Parse and execute command
      const action = parseVoiceCommand(transcribedText);
      if (action) {
        handleVoiceCommand(action);
      } else {
        handleContextSpecificCommand(transcribedText);
      }

      // Clear transcript after 3 seconds
      setTimeout(() => setTranscript(''), 3000);
    } catch (error) {
      console.error('[Voice Control] Error:', error);
      toast({
        title: 'Voice recognition failed',
        description: String(error),
        variant: 'destructive',
      });
      setIsListening(false);
    }
  }, [handleVoiceCommand, handleContextSpecificCommand, toast]);

  return {
    isListening,
    transcript,
    lastCommand,
    startListening,
    stopListening,
    isSupported: true, // Whisper is always supported
  };
}