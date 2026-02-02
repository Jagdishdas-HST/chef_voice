export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export type VoiceCallback = (result: VoiceRecognitionResult) => void;

export interface VoiceCommand {
  pattern: RegExp;
  action: string;
  params?: Record<string, any>;
}

class VoiceRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private commandHandlers: Map<string, (params: any) => void> = new Map();

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

  registerCommandHandler(action: string, handler: (params: any) => void): void {
    this.commandHandlers.set(action, handler);
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
    'home': '/dashboard',
    'refrigeration': '/refrigeration',
    'fridge': '/refrigeration',
    'freezer': '/refrigeration',
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

  // Look for "go to [page]" or "open [page]" or "show [page]" pattern
  const navigationPatterns = [
    /(?:go\s+to|open|show|navigate\s+to)\s+(.+)/,
    /^(.+?)(?:\s+page)?$/
  ];

  for (const pattern of navigationPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      const page = match[1].trim();
      if (routes[page]) {
        return routes[page];
      }
    }
  }

  return null;
}

/**
 * Parse voice commands for app actions
 */
export interface VoiceAction {
  type: 'navigation' | 'add' | 'log' | 'open' | 'close' | 'submit' | 'cancel';
  target?: string;
  data?: Record<string, any>;
}

export function parseVoiceCommand(transcript: string): VoiceAction | null {
  const normalized = transcript.toLowerCase().trim();

  // Navigation commands
  const navRoute = parseNavigationCommand(transcript);
  if (navRoute) {
    return { type: 'navigation', target: navRoute };
  }

  // Add/Create commands
  if (normalized.match(/(?:add|create|new)\s+(unit|delivery|temperature|cook|hot\s+holding)/)) {
    const match = normalized.match(/(?:add|create|new)\s+(unit|delivery|temperature|cook|hot\s+holding)/);
    return { type: 'add', target: match![1].replace(/\s+/g, '-') };
  }

  // Log temperature command
  const tempMatch = normalized.match(/log\s+temperature\s+(?:of\s+)?(.+?)\s+(?:at\s+)?(\d+(?:\.\d+)?)\s*degrees?/);
  if (tempMatch) {
    return {
      type: 'log',
      target: 'temperature',
      data: {
        unit: tempMatch[1],
        temperature: parseFloat(tempMatch[2])
      }
    };
  }

  // Open dialog commands
  if (normalized.match(/open\s+(dialog|form|modal)/)) {
    return { type: 'open', target: 'dialog' };
  }

  // Close dialog commands
  if (normalized.match(/close|cancel|dismiss/)) {
    return { type: 'close' };
  }

  // Submit commands
  if (normalized.match(/submit|save|confirm/)) {
    return { type: 'submit' };
  }

  return null;
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
  const supplierMatch = normalized.match(/supplier\s+(?:is\s+)?([a-z\s&]+?)(?:\s+staff|received|product|$)/i);
  if (supplierMatch) {
    data.supplier = supplierMatch[1].trim();
  }

  // Extract staff member
  const staffMatch = normalized.match(/(?:received\s+by|staff\s+member)\s+([a-z\s]+?)(?:\s+product|$)/i);
  if (staffMatch) {
    data.staffMember = staffMatch[1].trim();
  }

  // Extract products
  const productMatches = normalized.matchAll(/product\s+([a-z\s]+?)(?:\s+(\d+)\s*(?:kg|g|l|ml|pcs))?(?:\s+(\d+\.?\d*)\s*degrees?)?(?:\s+batch\s+([a-z0-9]+))?/gi);
  
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

/**
 * Parse voice input for temperature logging
 */
export interface VoiceTemperatureData {
  unitName?: string;
  temperature?: number;
  notes?: string;
}

export function parseTemperatureVoiceInput(transcript: string): Partial<VoiceTemperatureData> {
  const normalized = transcript.toLowerCase();
  const data: Partial<VoiceTemperatureData> = {};

  // Extract unit name
  const unitMatch = normalized.match(/(?:unit|fridge|freezer)\s+([a-z0-9\s-]+?)(?:\s+(?:is|at|temperature))/i);
  if (unitMatch) {
    data.unitName = unitMatch[1].trim();
  }

  // Extract temperature
  const tempMatch = normalized.match(/(\d+(?:\.\d+)?)\s*degrees?/i);
  if (tempMatch) {
    data.temperature = parseFloat(tempMatch[1]);
  }

  // Extract notes
  const notesMatch = normalized.match(/notes?\s+(.+)$/i);
  if (notesMatch) {
    data.notes = notesMatch[1].trim();
  }

  return data;
}

/**
 * Parse voice input for cook records
 */
export interface VoiceCookData {
  productName?: string;
  staffName?: string;
  temperature?: number;
}

export function parseCookVoiceInput(transcript: string): Partial<VoiceCookData> {
  const normalized = transcript.toLowerCase();
  const data: Partial<VoiceCookData> = {};

  // Extract product name
  const productMatch = normalized.match(/(?:cooked|cooking)\s+([a-z\s]+?)(?:\s+(?:by|at|temperature))/i);
  if (productMatch) {
    data.productName = productMatch[1].trim();
  }

  // Extract staff name
  const staffMatch = normalized.match(/(?:by|cooked\s+by)\s+([a-z\s]+?)(?:\s+(?:at|temperature)|$)/i);
  if (staffMatch) {
    data.staffName = staffMatch[1].trim();
  }

  // Extract temperature
  const tempMatch = normalized.match(/(\d+(?:\.\d+)?)\s*degrees?/i);
  if (tempMatch) {
    data.temperature = parseFloat(tempMatch[1]);
  }

  return data;
}

/**
 * Parse voice input for hot holding records
 */
export interface VoiceHotHoldingData {
  foodItem?: string;
  timeIntoHotHold?: string;
  coreTemperature?: number;
  checkedBy?: string;
  comments?: string;
}

export function parseHotHoldingVoiceInput(transcript: string): Partial<VoiceHotHoldingData> {
  const normalized = transcript.toLowerCase();
  const data: Partial<VoiceHotHoldingData> = {};

  // Extract food item
  const foodMatch = normalized.match(/(?:hot\s+holding|holding)\s+([a-z\s]+?)(?:\s+(?:at|time|temperature))/i);
  if (foodMatch) {
    data.foodItem = foodMatch[1].trim();
  }

  // Extract time
  const timeMatch = normalized.match(/(?:time|at)\s+(\d{1,2}:\d{2}(?:\s*[ap]m)?)/i);
  if (timeMatch) {
    data.timeIntoHotHold = timeMatch[1].trim();
  }

  // Extract temperature
  const tempMatch = normalized.match(/(\d+(?:\.\d+)?)\s*degrees?/i);
  if (tempMatch) {
    data.coreTemperature = parseFloat(tempMatch[1]);
  }

  // Extract checked by
  const checkedMatch = normalized.match(/(?:checked\s+by|by)\s+([a-z\s]+?)(?:\s+(?:comments?|notes?)|$)/i);
  if (checkedMatch) {
    data.checkedBy = checkedMatch[1].trim();
  }

  // Extract comments
  const commentsMatch = normalized.match(/(?:comments?|notes?)\s+(.+)$/i);
  if (commentsMatch) {
    data.comments = commentsMatch[1].trim();
  }

  return data;
}