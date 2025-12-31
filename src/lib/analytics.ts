import { DailyCheckIn, BurnoutRisk, WeeklyStats } from './types';
import { startOfWeek, subDays } from 'date-fns';

export const calculateBurnoutRisk = (data: DailyCheckIn[]): BurnoutRisk => {
  if (data.length < 3) {
    return { level: 'Low', score: 0, factors: [] };
  }
  
  const recent = data.slice(-7);
  const factors: string[] = [];
  let riskScore = 0;
  
  // Check stress levels
  const avgStress = recent.reduce((sum, d) => sum + d.stress, 0) / recent.length;
  if (avgStress >= 4) {
    riskScore += 30;
    factors.push('High sustained stress levels');
  } else if (avgStress >= 3) {
    riskScore += 15;
  }
  
  // Check sleep deprivation
  const avgSleep = recent.reduce((sum, d) => sum + d.sleepHours, 0) / recent.length;
  if (avgSleep < 5.5) {
    riskScore += 35;
    factors.push('Severe sleep deprivation');
  } else if (avgSleep < 6.5) {
    riskScore += 20;
    factors.push('Insufficient sleep');
  }
  
  // Check declining mood trend
  if (recent.length >= 5) {
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.mood, 0) / secondHalf.length;
    
    if (secondAvg < firstAvg - 0.5) {
      riskScore += 20;
      factors.push('Declining mood trend');
    }
  }
  
  // Check overworking
  const avgStudy = recent.reduce((sum, d) => sum + d.studyHours, 0) / recent.length;
  if (avgStudy > 10) {
    riskScore += 15;
    factors.push('Excessive study hours');
  }
  
  // Check low energy
  const avgEnergy = recent.reduce((sum, d) => sum + d.energy, 0) / recent.length;
  if (avgEnergy < 2.5) {
    riskScore += 25;
    factors.push('Consistently low energy');
  }
  
  let level: 'Low' | 'Medium' | 'High' = 'Low';
  if (riskScore >= 60) level = 'High';
  else if (riskScore >= 30) level = 'Medium';
  
  return { level, score: Math.min(riskScore, 100), factors };
};

export const calculateWeeklyStats = (data: DailyCheckIn[]): WeeklyStats => {
  const recent = data.slice(-7);
  
  if (recent.length === 0) {
    return {
      avgMood: 0,
      avgEnergy: 0,
      avgStress: 0,
      avgSleep: 0,
      avgStudy: 0,
      avgProductivity: 0,
      totalCheckIns: 0,
    };
  }
  
  return {
    avgMood: Math.round((recent.reduce((sum, d) => sum + d.mood, 0) / recent.length) * 10) / 10,
    avgEnergy: Math.round((recent.reduce((sum, d) => sum + d.energy, 0) / recent.length) * 10) / 10,
    avgStress: Math.round((recent.reduce((sum, d) => sum + d.stress, 0) / recent.length) * 10) / 10,
    avgSleep: Math.round((recent.reduce((sum, d) => sum + d.sleepHours, 0) / recent.length) * 10) / 10,
    avgStudy: Math.round((recent.reduce((sum, d) => sum + d.studyHours, 0) / recent.length) * 10) / 10,
    avgProductivity: Math.round(recent.reduce((sum, d) => sum + d.productivityScore, 0) / recent.length),
    totalCheckIns: recent.length,
  };
};

export const getHeatmapData = (data: DailyCheckIn[]) => {
  // Build a map of date -> value (use productivityScore; if multiple entries per day, average them)
  const byDate = new Map<string, { sum: number; count: number }>();
  for (const d of data) {
    const key = new Date(d.date).toISOString().split('T')[0];
    const prev = byDate.get(key) || { sum: 0, count: 0 };
    byDate.set(key, { sum: prev.sum + (d.productivityScore ?? 0), count: prev.count + 1 });
  }

  const valueFor = (isoDate: string) => {
    const agg = byDate.get(isoDate);
    if (!agg) return 0;
    return Math.round(agg.sum / Math.max(1, agg.count));
  };

  // Generate last ~53 weeks aligned to Sunday, GitHub-style
  const today = new Date();
  const start = startOfWeek(subDays(today, 364), { weekStartsOn: 0 }); // 52 weeks back

  const weeks: { date: string; value: number }[][] = [];
  for (let w = 0; w < 53; w++) {
    const week: { date: string; value: number }[] = [];
    for (let dIdx = 0; dIdx < 7; dIdx++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + dIdx);
      const iso = date.toISOString().split('T')[0];
      week.push({ date: iso, value: valueFor(iso) });
    }
    weeks.push(week);
  }

  return weeks;
};
