import { motion } from 'framer-motion';
import { Moon, Zap, Brain, BookOpen, Target } from 'lucide-react';
import { WeeklyStats } from '@/lib/types';

interface WeeklyOverviewProps {
  stats: WeeklyStats;
}

const WeeklyOverview = ({ stats }: WeeklyOverviewProps) => {
  const items = [
    { label: 'Mood', value: stats.avgMood.toFixed(1), icon: Brain, color: 'text-chart-mood', bg: 'bg-chart-mood/10' },
    { label: 'Energy', value: stats.avgEnergy.toFixed(1), icon: Zap, color: 'text-chart-energy', bg: 'bg-chart-energy/10' },
    { label: 'Sleep', value: `${stats.avgSleep.toFixed(1)}h`, icon: Moon, color: 'text-chart-sleep', bg: 'bg-chart-sleep/10' },
    { label: 'Study', value: `${stats.avgStudy.toFixed(1)}h`, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Score', value: stats.avgProductivity.toString(), icon: Target, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="rounded-lg bg-card border border-border p-5">
      <p className="text-sm font-medium text-muted-foreground mb-4">This Week</p>
      <div className="grid grid-cols-5 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-lg ${item.bg} p-3 text-center`}
          >
            <item.icon className={`h-4 w-4 mx-auto mb-1.5 ${item.color}`} />
            <p className="text-lg font-bold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyOverview;
