import { DailyCheckIn, BurnoutRisk, WeeklyStats } from './types';

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
  const weeks: { date: string; value: number }[][] = [];
  let currentWeek: { date: string; value: number }[] = [];
  
  // Get last 12 weeks
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 84);
  
  const filteredData = data.filter(d => new Date(d.date) >= cutoff);
  
  filteredData.forEach((entry, index) => {
    const dayOfWeek = new Date(entry.date).getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push({
      date: entry.date,
      value: entry.productivityScore,
    });
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks;
};
