import { IChatMessage, ICharacter } from '../types';

// Format timestamp to readable string
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  
  return date.toLocaleDateString();
}

// Generate unique ID
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Truncate text to specified length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
}

// Convert messages to API format
export function messagesToApiFormat(messages: IChatMessage[], character?: ICharacter) {
  const apiMessages = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.text,
    name: msg.name
  }));
  
  // Add system message if character is provided
  if (character) {
    const systemMessage = {
      role: 'system' as const,
      content: `You are ${character.name}. ${character.description}\n\nPersonality: ${character.personality}\n\nScenario: ${character.scenario}`
    };
    return [systemMessage, ...apiMessages];
  }
  
  return apiMessages;
}

// Estimate token count (rough approximation)
export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 0.75 words
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.3);
}

// Validate character data
export function validateCharacter(character: Partial<ICharacter>): string[] {
  const errors: string[] = [];
  
  if (!character.name?.trim()) {
    errors.push('Character name is required');
  }
  
  if (!character.description?.trim()) {
    errors.push('Character description is required');
  }
  
  if (character.name && character.name.length > 100) {
    errors.push('Character name must be less than 100 characters');
  }
  
  return errors;
}

// Clean and format message text
export function formatMessageText(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/\t/g, '  '); // Replace tabs with spaces
}

// Check if user is using dark mode
export function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Generate character greeting message
export function generateGreeting(character: ICharacter): IChatMessage {
  const greetingText = character.first_message || character.greeting || `Hello! I'm ${character.name}. How can I help you today?`;
  
  return {
    id: generateId('greeting_'),
    sender: 'character',
    name: character.name,
    text: greetingText,
    is_regenerated: false,
    timestamp: Date.now(),
    character_id: character.id
  };
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}