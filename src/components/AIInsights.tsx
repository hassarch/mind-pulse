import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { DailyCheckIn } from '@/lib/types';

interface AIInsight {
  id: string;
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  message: string;
  icon: string;
}

interface AIInsightsProps {
  checkIns: DailyCheckIn[];
}

const generateInsights = (data: DailyCheckIn[]): AIInsight[] => {
  if (data.length === 0) {
    return [{
      id: 'welcome',
      type: 'suggestion',
      title: 'Start Your Journey',
      message: 'Complete your first check-in to get personalized AI insights about your wellness patterns.',
      icon: '🚀'
    }];
  }
  
  const insights: AIInsight[] = [];
  const recent = data.slice(-7);
  
  if (recent.length >= 3) {
    const avgSleep = recent.reduce((sum, d) => sum + d.sleepHours, 0) / recent.length;
    const avgMood = recent.reduce((sum, d) => sum + d.mood, 0) / recent.length;
    const avgStress = recent.reduce((sum, d) => sum + d.stress, 0) / recent.length;
    const avgEnergy = recent.reduce((sum, d) => sum + d.energy, 0) / recent.length;
    
    // Sleep insights
    if (avgSleep >= 7.5) {
      insights.push({ 
        id: 'sleep-great', 
        type: 'positive', 
        title: 'Excellent Sleep!', 
        message: `Averaging ${avgSleep.toFixed(1)}h of sleep. This is boosting your energy and focus.`, 
        icon: '🌙' 
      });
    } else if (avgSleep >= 6.5) {
      insights.push({ 
        id: 'sleep-ok', 
        type: 'suggestion', 
        title: 'Sleep Could Improve', 
        message: `You're getting ${avgSleep.toFixed(1)}h on average. Try winding down 30 min earlier.`, 
        icon: '😴' 
      });
    } else {
      insights.push({ 
        id: 'sleep-low', 
        type: 'warning', 
        title: 'Sleep Deficit Detected', 
        message: `Only ${avgSleep.toFixed(1)}h average sleep. This may be affecting your mood and productivity.`, 
        icon: '⚠️' 
      });
    }
    
    // Stress insights
    if (avgStress >= 4) {
      insights.push({ 
        id: 'stress-high', 
        type: 'warning', 
        title: 'High Stress Alert', 
        message: 'Your stress levels have been elevated. Consider taking short breaks or practicing deep breathing.', 
        icon: '💆' 
      });
    } else if (avgStress <= 2) {
      insights.push({ 
        id: 'stress-low', 
        type: 'positive', 
        title: 'Great Stress Management', 
        message: "Your stress levels are well-controlled. Keep up whatever you're doing!", 
        icon: '🧘' 
      });
    }
    
    // Mood insights
    if (avgMood >= 4) {
      insights.push({ 
        id: 'mood-good', 
        type: 'positive', 
        title: 'Positive Mood Trend', 
        message: 'Your mood has been consistently high. Your habits are working well for you!', 
        icon: '✨' 
      });
    } else if (avgMood < 3) {
      insights.push({ 
        id: 'mood-low', 
        type: 'suggestion', 
        title: 'Mood Could Use a Boost', 
        message: 'Try adding enjoyable activities to your day. Small wins can lift your spirits.', 
        icon: '💪' 
      });
    }

    // Energy insights
    if (avgEnergy >= 4) {
      insights.push({ 
        id: 'energy-good', 
        type: 'positive', 
        title: 'High Energy Levels', 
        message: 'You\'re maintaining great energy! This helps with productivity and focus.', 
        icon: '⚡' 
      });
    } else if (avgEnergy < 3) {
      insights.push({ 
        id: 'energy-low', 
        type: 'suggestion', 
        title: 'Energy Running Low', 
        message: 'Consider a short walk, hydration, or a healthy snack to boost your energy.', 
        icon: '🔋' 
      });
    }

    // Correlation insights
    if (avgSleep < 6.5 && avgMood < 3) {
      insights.push({ 
        id: 'sleep-mood-correlation', 
        type: 'suggestion', 
        title: 'Sleep-Mood Connection', 
        message: 'Your low sleep may be affecting your mood. Prioritizing rest could help both.', 
        icon: '🔗' 
      });
    }
  } else if (data.length >= 1) {
    insights.push({ 
      id: 'keep-going', 
      type: 'suggestion', 
      title: 'Building Your Profile', 
      message: `${3 - data.length} more check-ins to unlock personalized insights!`, 
      icon: '📊' 
    });
  }
  
  return insights.slice(0, 4);
};

const AIInsights = ({ checkIns }: AIInsightsProps) => {
  const insights = generateInsights(checkIns);

  const getIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'positive': return CheckCircle;
      case 'suggestion': return Lightbulb;
      case 'warning': return AlertCircle;
    }
  };

  const getColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'positive': return 'text-success';
      case 'suggestion': return 'text-primary';
      case 'warning': return 'text-warning';
    }
  };

  const getBgColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'positive': return 'bg-success/10 border-success/20';
      case 'suggestion': return 'bg-primary/10 border-primary/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = getIcon(insight.type);
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-4 rounded-2xl border p-4 ${getBgColor(insight.type)}`}
            >
              <span className="text-2xl">{insight.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${getColor(insight.type)}`} />
                  <p className="font-semibold text-foreground">{insight.title}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
