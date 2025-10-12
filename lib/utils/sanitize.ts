/**
 * Input sanitization utilities
 * Protects against XSS and injection attacks
 */

/**
 * Sanitizes a string by removing potentially dangerous HTML/script content
 * and trimming whitespace
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove leading/trailing whitespace
  let sanitized = input.trim();

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

/**
 * Sanitizes email input
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  // Basic email sanitization
  const sanitized = email.trim().toLowerCase();

  // Remove any characters that aren't valid in emails
  return sanitized.replace(/[^a-z0-9@._+-]/g, '');
}

/**
 * Sanitizes text for display (allows basic formatting but removes scripts)
 */
export function sanitizeDisplayText(text: string): string {
  if (!text) return '';

  let sanitized = text.trim();

  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove dangerous event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: and data: protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (!text) return '';

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Validates and sanitizes URL input
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const sanitized = url.trim();

  // Only allow http:// and https:// protocols
  if (!sanitized.match(/^https?:\/\//i)) {
    return '';
  }

  // Remove javascript: and data: protocols if somehow they got through
  return sanitized.replace(/javascript:/gi, '').replace(/data:/gi, '');
}

/**
 * Sanitizes form data object
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data } as any;

  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];

    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('url')) {
        sanitized[key] = sanitizeUrl(value);
      } else {
        sanitized[key] = sanitizeInput(value);
      }
    }
  });

  return sanitized as T;
}
