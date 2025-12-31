import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserProfile, DailyCheckIn } from '@/lib/types';

interface PlayerStatsProps {
  profile: UserProfile;
  checkIns: DailyCheckIn[];
}

// Level-based avatars
const getAvatar = (level: number) => {
  if (level >= 20) return { emoji: '👑', bg: 'from-yellow-500 to-amber-600', title: 'Legend' };
  if (level >= 15) return { emoji: '🐉', bg: 'from-purple-500 to-pink-600', title: 'Dragon' };
  if (level >= 10) return { emoji: '🦅', bg: 'from-blue-500 to-cyan-600', title: 'Eagle' };
  if (level >= 7) return { emoji: '🦊', bg: 'from-orange-500 to-red-600', title: 'Fox' };
  if (level >= 5) return { emoji: '🐺', bg: 'from-slate-500 to-zinc-600', title: 'Wolf' };
  if (level >= 3) return { emoji: '🐱', bg: 'from-emerald-500 to-teal-600', title: 'Cat' };
  return { emoji: '🐣', bg: 'from-primary to-primary/60', title: 'Hatchling' };
};

// Badge definitions
const getBadges = (checkIns: DailyCheckIn[], currentStreak: number) => {
  const badges = [];
  
  if (checkIns.length >= 1) {
    badges.push({ id: 'bronze', icon: '🥉', name: 'Bronze Start' });
  }
  if (currentStreak >= 10) {
    badges.push({ id: 'silver', icon: '🥈', name: 'Silver Streak' });
  }
  if (currentStreak >= 25) {
    badges.push({ id: 'gold', icon: '🥇', name: 'Gold Vibes' });
  }
  if (currentStreak >= 35) {
    badges.push({ id: 'platinum', icon: '💎', name: 'Platinum Power' });
  }
  if (currentStreak >= 50) {
    badges.push({ id: 'diamond', icon: '💠', name: 'Diamond Dreams' });
  }
  if (currentStreak >= 100) {
    badges.push({ id: 'legendary', icon: '👑', name: 'Legendary' });
  }
  
  return badges;
};

const PlayerStats = ({ profile, checkIns }: PlayerStatsProps) => {
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

  const avatar = getAvatar(level);
  const earnedBadges = getBadges(checkIns, currentStreak);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-3xl p-5"
    >
      <div className="flex items-center gap-4 flex-wrap">
        {/* Avatar & Name with Badges */}
        <div className="flex items-center gap-3 flex-1 min-w-[250px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className={`p-3 rounded-2xl bg-gradient-to-br ${avatar.bg} cursor-pointer`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{avatar.emoji}</span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{avatar.title}</p>
              <p className="text-xs text-muted-foreground">Level {level} Avatar</p>
            </TooltipContent>
          </Tooltip>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground">
                {profile.name || 'Wellness Warrior'}
              </h2>
              {/* Earned Badges */}
              {earnedBadges.length > 0 && (
                <div className="flex items-center gap-1">
                  {earnedBadges.slice(0, 4).map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <motion.span 
                          className="text-sm cursor-pointer"
                          whileHover={{ scale: 1.2 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {badge.icon}
                        </motion.span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{badge.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {earnedBadges.length > 4 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-pointer">
                          +{earnedBadges.length - 4}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{earnedBadges.length - 4} more badges</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Level {level} • {avatar.title}</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="flex-1 min-w-[180px]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Level {level + 1}</span>
            <span className="text-primary font-medium">{totalXP} XP</span>
          </div>
          <Progress value={levelProgress} className="h-2 rounded-full" />
          <p className="text-xs text-muted-foreground mt-1">{xpToNextLevel} XP to next level</p>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-secondary/50">
          <div className="p-2 rounded-xl bg-warning/20">
            <Flame className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">day streak</p>
          </div>
          {currentStreak >= 3 && (
            <span className="text-xl animate-bounce">🔥</span>
          )}
        </div>

        {/* Profile Link */}
        <Link to="/profile">
          <motion.div 
            className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default PlayerStats;
