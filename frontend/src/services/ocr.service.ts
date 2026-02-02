import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

export interface ParsedInvoice {
  supplier?: string;
  products: Array<{
    name: string;
    quantity?: string;
    temperature?: string;
    batchNumber?: string;
  }>;
  deliveryDate?: string;
}

/**
 * Extract text from an image using Tesseract OCR
 */
export async function extractTextFromImage(file: File): Promise<OCRResult> {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log('[OCR]', m),
    });

    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  } catch (error) {
    console.error('[OCR] Failed to extract text:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Parse invoice text into structured delivery data
 * This is a basic parser - can be enhanced with more sophisticated NLP
 */
export function parseInvoiceText(text: string): ParsedInvoice {
  const lines = text.split('\n').filter(line => line.trim());
  
  const parsed: ParsedInvoice = {
    products: [],
  };

  // Try to find supplier (usually at the top)
  const supplierMatch = lines[0]?.match(/^([A-Z][A-Za-z\s&]+)/);
  if (supplierMatch) {
    parsed.supplier = supplierMatch[1].trim();
  }

  // Try to find date
  const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
  if (dateMatch) {
    parsed.deliveryDate = dateMatch[1];
  }

  // Parse product lines (look for patterns like: item name, quantity, temp, batch)
  lines.forEach(line => {
    // Skip header lines
    if (line.toLowerCase().includes('invoice') || 
        line.toLowerCase().includes('delivery') ||
        line.toLowerCase().includes('total')) {
      return;
    }

    // Look for product patterns
    const productMatch = line.match(/([A-Za-z\s]+)\s+(\d+)\s*(?:kg|g|l|ml|pcs)?\s*(?:(\d+\.?\d*)\s*°?C)?\s*(?:Batch[:\s]*([A-Z0-9]+))?/i);
    
    if (productMatch) {
      parsed.products.push({
        name: productMatch[1].trim(),
        quantity: productMatch[2] || undefined,
        temperature: productMatch[3] || undefined,
        batchNumber: productMatch[4] || undefined,
      });
    }
  });

  return parsed;
}

/**
 * Process invoice image and return structured data
 */
export async function processInvoice(file: File): Promise<ParsedInvoice> {
  console.log('[OCR] Processing invoice:', file.name);
  
  const { text, confidence } = await extractTextFromImage(file);
  
  console.log('[OCR] Extracted text (confidence:', confidence + '):', text);
  
  if (confidence < 60) {
    throw new Error('Low OCR confidence. Please try a clearer image.');
  }

  const parsed = parseInvoiceText(text);
  
  console.log('[OCR] Parsed invoice:', parsed);
  
  return parsed;
}