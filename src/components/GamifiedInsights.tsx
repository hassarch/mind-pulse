import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Moon, Smile, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Challenge, Badge, UserProfile, DailyCheckIn } from '@/lib/types';

interface GamifiedInsightsProps {
  profile: UserProfile;
  checkIns: DailyCheckIn[];
  onUpdateProfile: (profile: UserProfile) => void;
}

const GamifiedInsights = ({ profile, checkIns }: GamifiedInsightsProps) => {
  // Calculate streak
  const calculateStreak = () => {
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
  };

  const currentStreak = calculateStreak();
  const xpPerCheckIn = 50;
  const totalXP = checkIns.length * xpPerCheckIn;
  const level = Math.floor(totalXP / 500) + 1;
  const xpToNextLevel = 500 - (totalXP % 500);
  const levelProgress = ((totalXP % 500) / 500) * 100;

  // Generate challenges based on user data
  const generateChallenges = (): Challenge[] => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIn = checkIns.find(c => c.date === today);
    
    return [
      {
        id: 'daily-checkin',
        title: 'Daily Check-in',
        description: 'Complete your wellness check-in today',
        icon: '📝',
        type: 'daily',
        progress: todayCheckIn ? 1 : 0,
        target: 1,
        completed: !!todayCheckIn,
        xpReward: 50,
      },
      {
        id: 'week-streak',
        title: '7-Day Warrior',
        description: 'Maintain a 7-day check-in streak',
        icon: '🔥',
        type: 'weekly',
        progress: Math.min(currentStreak, 7),
        target: 7,
        completed: currentStreak >= 7,
        xpReward: 200,
      },
      {
        id: 'sleep-master',
        title: 'Sleep Master',
        description: 'Log 7+ hours of sleep 5 times this week',
        icon: '😴',
        type: 'weekly',
        progress: checkIns.filter(c => c.sleepHours >= 7).slice(0, 7).length,
        target: 5,
        completed: checkIns.filter(c => c.sleepHours >= 7).slice(0, 7).length >= 5,
        xpReward: 150,
      },
      {
        id: 'zen-mode',
        title: 'Zen Mode',
        description: 'Keep stress below 4 for 3 consecutive days',
        icon: '🧘',
        type: 'weekly',
        progress: Math.min(checkIns.filter(c => c.stress < 4).slice(0, 3).length, 3),
        target: 3,
        completed: checkIns.filter(c => c.stress < 4).slice(0, 3).length >= 3,
        xpReward: 100,
      },
    ];
  };

  // Generate badges based on achievements
  const generateBadges = (): Badge[] => {
    return [
      {
        id: 'bronze-start',
        name: 'Bronze Start',
        description: 'Complete your first check-in',
        icon: '🥉',
        earned: checkIns.length >= 1,
        earnedDate: checkIns.length >= 1 ? checkIns[0]?.date : undefined,
      },
      {
        id: 'silver-streak',
        name: 'Silver Streak',
        description: '10-day streak',
        icon: '🥈',
        earned: currentStreak >= 10,
      },
      {
        id: 'gold-vibes',
        name: 'Gold Vibes',
        description: '25-day streak',
        icon: '🥇',
        earned: currentStreak >= 25,
      },
      {
        id: 'platinum-power',
        name: 'Platinum Power',
        description: '35-day streak',
        icon: '💎',
        earned: currentStreak >= 35,
      },
      {
        id: 'diamond-dreams',
        name: 'Diamond Dreams',
        description: '50-day streak',
        icon: '💠',
        earned: currentStreak >= 50,
      },
      {
        id: 'legendary',
        name: 'Legendary',
        description: '100-day streak',
        icon: '👑',
        earned: currentStreak >= 100,
      },
    ];
  };

  const challenges = generateChallenges();
  const badges = generateBadges();
  const earnedBadges = badges.filter(b => b.earned);

  return (
    <div className="space-y-6">

      {/* Daily Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-3xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Challenges</h3>
        </div>
        
        <div className="space-y-3">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                challenge.completed 
                  ? 'border-success/50 bg-success/10' 
                  : 'border-border bg-secondary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{challenge.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{challenge.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      challenge.type === 'daily' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {challenge.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(challenge.progress / challenge.target) * 100} 
                      className="h-2 flex-1 rounded-full"
                    />
                    <span className="text-xs font-medium text-foreground">
                      {challenge.progress}/{challenge.target}
                    </span>
                    <span className="text-xs text-primary font-medium">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Badges</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {earnedBadges.length}/{badges.length} earned
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl text-center transition-all ${
                badge.earned 
                  ? 'bg-primary/10 border-2 border-primary/30' 
                  : 'bg-secondary/30 border-2 border-border opacity-50'
              }`}
            >
              <span className={`text-3xl block mb-2 ${!badge.earned && 'grayscale'}`}>
                {badge.icon}
              </span>
              <p className="text-xs font-medium text-foreground truncate">{badge.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        {[
          { icon: Smile, label: 'Avg Mood', value: checkIns.length > 0 ? (checkIns.reduce((a, b) => a + b.mood, 0) / checkIns.length).toFixed(1) : '--', color: 'text-success' },
          { icon: Zap, label: 'Avg Energy', value: checkIns.length > 0 ? (checkIns.reduce((a, b) => a + b.energy, 0) / checkIns.length).toFixed(1) : '--', color: 'text-warning' },
          { icon: Moon, label: 'Avg Sleep', value: checkIns.length > 0 ? (checkIns.reduce((a, b) => a + b.sleepHours, 0) / checkIns.length).toFixed(1) + 'h' : '--', color: 'text-primary' },
          { icon: Brain, label: 'Avg Stress', value: checkIns.length > 0 ? (checkIns.reduce((a, b) => a + b.stress, 0) / checkIns.length).toFixed(1) : '--', color: 'text-destructive' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GamifiedInsights;
