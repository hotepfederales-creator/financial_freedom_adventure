import { Memory } from '../types/memoryTypes';

const MEMORY_KEY = 'finmon_long_term_memory';

export const saveMemory = (category: Memory['category'], content: string) => {
  if (typeof window === 'undefined') return;
  
  const existing: Memory[] = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]');
  
  // Prevent exact duplicates
  if (existing.some(m => m.content.toLowerCase() === content.toLowerCase())) return;

  const newMemory: Memory = {
    id: crypto.randomUUID(),
    category,
    content,
    timestamp: Date.now()
  };
  
  localStorage.setItem(MEMORY_KEY, JSON.stringify([...existing, newMemory]));
  console.log("Memory Saved:", newMemory);
};

export const getRelevantContext = (userQuery: string): string => {
  if (typeof window === 'undefined') return '';

  const memories: Memory[] = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]');
  
  // Naive relevance: Just return the last 5 memories for now
  // In a real app, we would use embeddings or keyword matching against userQuery
  const relevant = memories.slice(-5);
  
  if (relevant.length === 0) return '';
  
  return `[MEMORY CONTEXT]: The user previously mentioned: ${relevant.map(m => `(${m.category}) ${m.content}`).join('; ')}.`;
};