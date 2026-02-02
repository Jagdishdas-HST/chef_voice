export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export type VoiceCallback = (result: VoiceRecognitionResult) => void;

class VoiceRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  startListening(onResult: VoiceCallback, onError?: (error: string) => void): void {
    if (!this.isSupported()) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    if (this.isListening) {
      console.log('[Voice] Already listening');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const result = event.results[last];
      
      onResult({
        transcript: result[0].transcript,
        confidence: result[0].confidence,
        isFinal: result.isFinal,
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('[Voice] Recognition error:', event.error);
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      console.log('[Voice] Recognition ended');
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
      console.log('[Voice] Started listening');
    } catch (error) {
      console.error('[Voice] Failed to start:', error);
      onError?.('Failed to start voice recognition');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('[Voice] Stopped listening');
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = new VoiceRecognitionService();

/**
 * Parse voice command for navigation
 */
export function parseNavigationCommand(transcript: string): string | null {
  const normalized = transcript.toLowerCase().trim();
  
  const routes: Record<string, string> = {
    'dashboard': '/dashboard',
    'refrigeration': '/refrigeration',
    'delivery': '/delivery',
    'deliveries': '/delivery',
    'cooking': '/cook-cool-reheat',
    'cook': '/cook-cool-reheat',
    'hot holding': '/hot-holding',
    'hygiene': '/hygiene-inspection',
    'training': '/training',
    'fitness': '/fitness-to-work',
    'thermometer': '/thermometer-check',
    'reports': '/reports',
    'compliance': '/compliance',
    'settings': '/settings',
  };

  // Look for "go to [page]" pattern
  const goToMatch = normalized.match(/go\s+to\s+(.+)/);
  if (goToMatch) {
    const page = goToMatch[1].trim();
    return routes[page] || null;
  }

  // Direct page name
  return routes[normalized] || null;
}

/**
 * Parse voice input for delivery logging
 */
export interface VoiceDeliveryData {
  supplier?: string;
  staffMember?: string;
  products: Array<{
    name: string;
    quantity?: string;
    temperature?: string;
    category?: 'Frozen' | 'Chilled' | 'Ambient';
    batchNumber?: string;
  }>;
}

export function parseDeliveryVoiceInput(transcript: string): Partial<VoiceDeliveryData> {
  const normalized = transcript.toLowerCase();
  const data: Partial<VoiceDeliveryData> = {
    products: [],
  };

  // Extract supplier
  const supplierMatch = normalized.match(/supplier\s+(?:is\s+)?([a-z\s&]+?)(?:\s+staff|\s+received|\s+product|$)/i);
  if (supplierMatch) {
    data.supplier = supplierMatch[1].trim();
  }

  // Extract staff member
  const staffMatch = normalized.match(/(?:received\s+by|staff\s+member)\s+([a-z\s]+?)(?:\s+product|$)/i);
  if (staffMatch) {
    data.staffMember = staffMatch[1].trim();
  }

  // Extract products (basic pattern)
  const productMatches = normalized.matchAll(/product\s+([a-z\s]+?)(?:\s+(\d+)\s*(?:kg|g|l|ml|pcs))?\s*(?:(\d+\.?\d*)\s*degrees?)?\s*(?:batch\s+([a-z0-9]+))?/gi);
  
  for (const match of productMatches) {
    data.products?.push({
      name: match[1].trim(),
      quantity: match[2] || undefined,
      temperature: match[3] || undefined,
      batchNumber: match[4] || undefined,
    });
  }

  return data;
}