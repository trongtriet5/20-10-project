// HTML utility functions

/**
 * Simple sanitizer to allow basic formatting and emoji
 */
export function sanitizeHtml(input: string): string {
  const template = document.createElement('template');
  template.innerHTML = input;
  const allowedTags = new Set(['B', 'I', 'U', 'BR', 'DIV', 'P', 'SPAN']);
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT, null);
  const toRemove: Element[] = [];
  
  while (walker.nextNode()) {
    const el = walker.currentNode as Element;
    if (!allowedTags.has(el.tagName)) {
      toRemove.push(el);
      continue;
    }
    // Strip all attributes except style-safe ones (we remove all for safety)
    while (el.attributes.length > 0) {
      el.removeAttribute(el.attributes[0].name);
    }
  }
  
  toRemove.forEach((el) => {
    const parent = el.parentNode;
    if (!parent) return;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  });
  
  return template.innerHTML;
}

/**
 * Convert plain text with newlines to HTML with <br> tags
 */
export function textToHtml(text: string): string {
  // Convert plain text with newlines to <div> with <br>
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\n/g, '<br>');
}

/**
 * Load Google Font dynamically
 */
export function loadGoogleFont(fontFamily: string): void {
  const fontUrl = getGoogleFontUrl(fontFamily);
  if (!fontUrl) return;
  
  const id = `gf-${btoa(fontFamily).replace(/=/g, '')}`;
  if (document.getElementById(id)) return;
  
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = fontUrl;
  document.head.appendChild(link);
}

function getGoogleFontUrl(fontFamily: string): string | null {
  const googleFontsMap: Record<string, string> = {
    "'Dancing Script', cursive": 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap',
    "'Pacifico', cursive": 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    "'Great Vibes', cursive": 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
    "'Lobster', cursive": 'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
    "'Playfair Display', serif": 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
  };
  
  return googleFontsMap[fontFamily] || null;
}
