import { DailyCheckIn, AIInsight } from './types';

// Generate sample data for the past 60 days
export const generateMockData = (): DailyCheckIn[] => {
  const data: DailyCheckIn[] = [];
  const today = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isExamWeek = i >= 15 && i <= 20;
    
    let mood = Math.floor(Math.random() * 2) + 3; // 3-4 base
    let energy = Math.floor(Math.random() * 2) + 3;
    let stress = Math.floor(Math.random() * 2) + 2;
    let sleepHours = 6 + Math.random() * 3;
    let studyHours = isWeekend ? 2 + Math.random() * 4 : 4 + Math.random() * 4;
    
    // Weekend adjustments
    if (isWeekend) {
      mood += 1;
      energy += 1;
      stress -= 1;
      sleepHours += 1;
    }
    
    // Exam week stress
    if (isExamWeek) {
      stress += 2;
      mood -= 1;
      sleepHours -= 1.5;
      studyHours += 2;
    }
    
    // Clamp values
    mood = Math.max(1, Math.min(5, mood));
    energy = Math.max(1, Math.min(5, energy));
    stress = Math.max(1, Math.min(5, stress));
    sleepHours = Math.max(3, Math.min(12, sleepHours));
    studyHours = Math.max(0, Math.min(14, studyHours));
    
    // Calculate productivity score
    const productivityScore = calculateProductivityScore(
      mood, energy, stress, sleepHours, studyHours
    );
    
    data.push({
      id: `entry-${i}`,
      date: date.toISOString().split('T')[0],
      mood,
      energy,
      stress,
      sleepHours: Math.round(sleepHours * 10) / 10,
      studyHours: Math.round(studyHours * 10) / 10,
      productivityScore,
    });
  }
  
  return data;
};

export const calculateProductivityScore = (
  mood: number,
  energy: number,
  stress: number,
  sleepHours: number,
  studyHours: number
): number => {
  // Weighted formula for productivity
  const moodWeight = 0.2;
  const energyWeight = 0.25;
  const stressWeight = 0.15; // Inverted - high stress = lower score
  const sleepWeight = 0.2;
  const studyWeight = 0.2;
  
  const moodScore = (mood / 5) * 100;
  const energyScore = (energy / 5) * 100;
  const stressScore = ((6 - stress) / 5) * 100; // Inverted
  const sleepScore = Math.min((sleepHours / 8) * 100, 100);
  const studyScore = Math.min((studyHours / 6) * 100, 100);
  
  const score = 
    moodScore * moodWeight +
    energyScore * energyWeight +
    stressScore * stressWeight +
    sleepScore * sleepWeight +
    studyScore * studyWeight;
  
  return Math.round(Math.max(0, Math.min(100, score)));
};

export const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'positive',
    title: 'Great sleep consistency!',
    message: "You've been averaging 7.5 hours of sleep this week. Keep it up! Studies show consistent sleep improves memory retention by up to 40%.",
    icon: '🌙'
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Try a study break',
    message: "Your study sessions are long but your energy dips after 3 hours. Consider the Pomodoro technique: 25 min focus, 5 min break.",
    icon: '⏰'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Watch your stress levels',
    message: "Your stress has been elevated for 3 consecutive days. Remember: taking a 15-min walk can reduce cortisol by 25%. You've got this!",
    icon: '💪'
  },
  {
    id: '4',
    type: 'positive',
    title: 'Weekend recovery win!',
    message: "Your mood and energy spike on weekends when you get extra sleep. This pattern suggests you're recharging effectively.",
    icon: '✨'
  }
];
