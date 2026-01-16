export interface Memory {
  id: string;
  category: 'GOAL' | 'HABIT' | 'PREFERENCE' | 'EVENT';
  content: string;
  timestamp: number;
}

export interface MemoryRetrieval {
  relevantMemories: Memory[];
  contextString: string;
}