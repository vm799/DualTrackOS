/**
 * Metrics and tracking type definitions
 */

export interface DailyMetrics {
  hydration: {
    current: number;
    target: number;
    log: Date[];
  };
  movement: {
    current: number;
    target: number;
    completions: Array<{ timestamp: Date; type: string }>;
  };
  focus: {
    current: number;
    target: number;
    sessions: Array<{ duration: number; timestamp: Date }>;
  };
  ndms: {
    current: number;
    target: number;
  };
  tasks: {
    done: number;
    total: number;
    pipeline: KanbanTask[];
  };
  wins: Array<{ text: string; timestamp: Date }>;
}

export interface NDMStatus {
  nutrition: boolean;
  movement: boolean;
  mindfulness: boolean;
  brainDump: boolean;
}

export interface KanbanTask {
  id: string;
  text: string;
  createdAt: Date;
}

export interface KanbanBoard {
  backlog: KanbanTask[];
  inProgress: KanbanTask[];
  done: KanbanTask[];
}

export interface SpiritAnimalData {
  score: number; // 0-100
  stage: 'egg' | 'kit' | 'youngFox' | 'spiritFox' | 'nineTailed';
  balanceHistory: Array<{
    action: string;
    timestamp: Date;
    scoreChange: number;
  }>;
}
