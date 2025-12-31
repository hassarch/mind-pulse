export interface DailyCheckIn {
  id: string;
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  stress: number; // 1-5
  sleepHours: number; // 0-12
  studyHours: number; // 0-16
  productivityScore: number; // 0-100
  notes?: string;
}

export interface BurnoutRisk {
  level: 'Low' | 'Medium' | 'High';
  score: number;
  factors: string[];
}

export interface AIInsight {
  id: string;
  type: 'positive' | 'suggestion' | 'warning';
  title: string;
  message: string;
  icon: string;
}

export interface WeeklyStats {
  avgMood: number;
  avgEnergy: number;
  avgStress: number;
  avgSleep: number;
  avgStudy: number;
  avgProductivity: number;
  totalCheckIns: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly';
  progress: number;
  target: number;
  completed: boolean;
  xpReward: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface UserProfile {
  name: string;
  goals: string[];
  wakeTime: string;
  sleepTime: string;
  stressTriggers: string[];
  checkInTime: string;
  onboardingComplete: boolean;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
}
