import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, TrendingUp, Calendar, Moon, Smile, Zap, Brain, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Header from '@/components/Header';
import { DailyCheckIn, UserProfile } from '@/lib/types';

const STORAGE_KEY = 'mindpulse_checkins';
const PROFILE_KEY = 'mindpulse_profile';

// Level-based avatars with unlock requirements
const avatarTiers = [
  { level: 1, emoji: '🐣', bg: 'from-primary to-primary/60', title: 'Hatchling', desc: 'Starting your journey' },
  { level: 3, emoji: '🐱', bg: 'from-emerald-500 to-teal-600', title: 'Cat', desc: 'Curious explorer' },
  { level: 5, emoji: '🐺', bg: 'from-slate-500 to-zinc-600', title: 'Wolf', desc: 'Pack leader' },
  { level: 7, emoji: '🦊', bg: 'from-orange-500 to-red-600', title: 'Fox', desc: 'Clever strategist' },
  { level: 10, emoji: '🦅', bg: 'from-blue-500 to-cyan-600', title: 'Eagle', desc: 'Soaring high' },
  { level: 15, emoji: '🐉', bg: 'from-purple-500 to-pink-600', title: 'Dragon', desc: 'Mythical power' },
  { level: 20, emoji: '👑', bg: 'from-yellow-500 to-amber-600', title: 'Legend', desc: 'Ultimate mastery' },
];

// Badge definitions
const allBadges = [
  { id: 'bronze', icon: '🥉', name: 'Bronze Start', desc: 'Complete your first check-in', requirement: (c: DailyCheckIn[]) => c.length >= 1 },
  { id: 'silver', icon: '🥈', name: 'Silver Streak', desc: '10-day streak', requirement: (_: DailyCheckIn[], streak: number) => streak >= 10 },
  { id: 'gold', icon: '🥇', name: 'Gold Vibes', desc: '25-day streak', requirement: (_: DailyCheckIn[], streak: number) => streak >= 25 },
  { id: 'platinum', icon: '💎', name: 'Platinum Power', desc: '35-day streak', requirement: (_: DailyCheckIn[], streak: number) => streak >= 35 },
  { id: 'diamond', icon: '💠', name: 'Diamond Dreams', desc: '50-day streak', requirement: (_: DailyCheckIn[], streak: number) => streak >= 50 },
  { id: 'legendary', icon: '👑', name: 'Legendary', desc: '100-day streak', requirement: (_: DailyCheckIn[], streak: number) => streak >= 100 },
];

const Profile = () => {
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // Calculate streak
  const currentStreak = useMemo(() => {
    if (checkIns.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    const sortedCheckIns = [...checkIns].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const checkIn of sortedCheckIns) {
      const checkInDate = new Date(checkIn.date).toISOString().split('T')[0];
      const expectedDate = currentDate.toISOString().split('T')[0];
      
      if (checkInDate === expectedDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [checkIns]);

  const xpPerCheckIn = 50;
  const totalXP = checkIns.length * xpPerCheckIn;
  const level = Math.floor(totalXP / 500) + 1;
  const xpToNextLevel = 500 - (totalXP % 500);
  const levelProgress = ((totalXP % 500) / 500) * 100;

  const currentAvatar = avatarTiers.filter(a => a.level <= level).pop() || avatarTiers[0];

  // Calculate stats
  const stats = useMemo(() => {
    if (checkIns.length === 0) return null;
    return {
      totalCheckIns: checkIns.length,
      avgMood: (checkIns.reduce((a, b) => a + b.mood, 0) / checkIns.length).toFixed(1),
      avgEnergy: (checkIns.reduce((a, b) => a + b.energy, 0) / checkIns.length).toFixed(1),
      avgSleep: (checkIns.reduce((a, b) => a + b.sleepHours, 0) / checkIns.length).toFixed(1),
      avgStress: (checkIns.reduce((a, b) => a + b.stress, 0) / checkIns.length).toFixed(1),
      bestMood: Math.max(...checkIns.map(c => c.mood)),
      bestEnergy: Math.max(...checkIns.map(c => c.energy)),
      bestSleep: Math.max(...checkIns.map(c => c.sleepHours)),
      lowestStress: Math.min(...checkIns.map(c => c.stress)),
    };
  }, [checkIns]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Complete onboarding first</p>
          <Link to="/dashboard" className="text-primary hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Link 
          to="/dashboard" 
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center gap-6 flex-wrap">
              <motion.div 
                className={`p-6 rounded-3xl bg-gradient-to-br ${currentAvatar.bg}`}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-5xl">{currentAvatar.emoji}</span>
              </motion.div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {profile.name || 'Wellness Warrior'}
                </h1>
                <p className="text-muted-foreground mb-3">
                  Level {level} • {currentAvatar.title}
                </p>
                
                <div className="max-w-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress to Level {level + 1}</span>
                    <span className="text-primary font-medium">{totalXP} XP</span>
                  </div>
                  <Progress value={levelProgress} className="h-3 rounded-full" />
                  <p className="text-xs text-muted-foreground mt-1">{xpToNextLevel} XP to next level</p>
                </div>
              </div>

              <div className="text-center px-6 py-4 rounded-2xl bg-secondary/50">
                <p className="text-3xl font-bold text-foreground">{currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Avatar Progression */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Avatar Progression</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {avatarTiers.map((avatar) => {
                const unlocked = level >= avatar.level;
                return (
                  <Tooltip key={avatar.level}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`p-4 rounded-2xl text-center transition-all cursor-pointer ${
                          unlocked 
                            ? `bg-gradient-to-br ${avatar.bg}` 
                            : 'bg-secondary/30 opacity-50'
                        }`}
                        whileHover={{ scale: unlocked ? 1.05 : 1 }}
                      >
                        <span className={`text-3xl block mb-1 ${!unlocked && 'grayscale'}`}>
                          {avatar.emoji}
                        </span>
                        <p className="text-xs font-medium text-foreground">{avatar.title}</p>
                        <p className="text-xs text-muted-foreground">Lv. {avatar.level}</p>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{avatar.title}</p>
                      <p className="text-xs text-muted-foreground">{avatar.desc}</p>
                      <p className="text-xs text-primary mt-1">
                        {unlocked ? '✓ Unlocked' : `Unlock at Level ${avatar.level}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* All Badges */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Badges</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {allBadges.filter(b => b.requirement(checkIns, currentStreak)).length}/{allBadges.length} earned
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {allBadges.map((badge) => {
                const earned = badge.requirement(checkIns, currentStreak);
                return (
                  <motion.div
                    key={badge.id}
                    className={`p-5 rounded-2xl transition-all ${
                      earned 
                        ? 'bg-primary/10 border-2 border-primary/30' 
                        : 'bg-secondary/30 border-2 border-border opacity-60'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-3xl ${!earned && 'grayscale'}`}>{badge.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.desc}</p>
                        {earned && (
                          <p className="text-xs text-success mt-1">✓ Earned</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Lifetime Stats */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Lifetime Stats</h2>
            </div>
            
            {stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <Calendar className="h-5 w-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.totalCheckIns}</p>
                  <p className="text-xs text-muted-foreground">Total Check-ins</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <Smile className="h-5 w-5 text-success mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.avgMood}</p>
                  <p className="text-xs text-muted-foreground">Avg Mood</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <Zap className="h-5 w-5 text-warning mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.avgEnergy}</p>
                  <p className="text-xs text-muted-foreground">Avg Energy</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <Moon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.avgSleep}h</p>
                  <p className="text-xs text-muted-foreground">Avg Sleep</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <Brain className="h-5 w-5 text-destructive mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.avgStress}</p>
                  <p className="text-xs text-muted-foreground">Avg Stress</p>
                </div>
                <div className="p-4 rounded-2xl bg-success/10 border border-success/30">
                  <p className="text-2xl font-bold text-success">{stats.bestMood}/5</p>
                  <p className="text-xs text-muted-foreground">Best Mood</p>
                </div>
                <div className="p-4 rounded-2xl bg-warning/10 border border-warning/30">
                  <p className="text-2xl font-bold text-warning">{stats.bestSleep}h</p>
                  <p className="text-xs text-muted-foreground">Best Sleep</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
                  <p className="text-2xl font-bold text-primary">{stats.lowestStress}/5</p>
                  <p className="text-xs text-muted-foreground">Lowest Stress</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Complete check-ins to see your stats</p>
            )}
          </div>

          {/* Goals */}
          {profile.goals && profile.goals.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Your Goals</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.goals.map((goal) => (
                  <span key={goal} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                    {goal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
