import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Zap, Brain, BookOpen, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DailyCheckIn } from '@/lib/types';
import { calculateProductivityScore } from '@/lib/mockData';

interface CheckInFormProps {
  onSubmit: (checkIn: DailyCheckIn) => void;
}

const moodEmojis = ['😫', '😔', '😐', '🙂', '😊'];

const CheckInForm = ({ onSubmit }: CheckInFormProps) => {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(2);
  const [sleepHours, setSleepHours] = useState(7);
  const [studyHours, setStudyHours] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    const productivityScore = calculateProductivityScore(mood, energy, stress, sleepHours, studyHours);
    const checkIn: DailyCheckIn = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood, energy, stress, sleepHours, studyHours, productivityScore,
    };
    setTimeout(() => {
      onSubmit(checkIn);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="rounded-lg bg-card border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-5">Daily Check-In</h3>
      
      <div className="space-y-5">
        {/* Mood */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-chart-mood" />
            <span className="text-sm font-medium text-foreground">Mood</span>
          </div>
          <div className="flex gap-2">
            {moodEmojis.map((emoji, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMood(i + 1)}
                className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl transition-all ${
                  mood === i + 1 ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-chart-energy" />
              <span className="text-sm font-medium text-foreground">Energy</span>
            </div>
            <span className="text-sm font-semibold text-primary">{energy}/5</span>
          </div>
          <Slider value={[energy]} onValueChange={(v) => setEnergy(v[0])} min={1} max={5} step={1} />
        </div>

        {/* Stress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-chart-stress" />
              <span className="text-sm font-medium text-foreground">Stress</span>
            </div>
            <span className="text-sm font-semibold text-primary">{stress}/5</span>
          </div>
          <Slider value={[stress]} onValueChange={(v) => setStress(v[0])} min={1} max={5} step={1} />
        </div>

        {/* Sleep */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-chart-sleep" />
              <span className="text-sm font-medium text-foreground">Sleep</span>
            </div>
            <span className="text-sm font-semibold text-primary">{sleepHours}h</span>
          </div>
          <Slider value={[sleepHours]} onValueChange={(v) => setSleepHours(v[0])} min={0} max={12} step={0.5} />
        </div>

        {/* Study */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Study Time</span>
            </div>
            <span className="text-sm font-semibold text-primary">{studyHours}h</span>
          </div>
          <Slider value={[studyHours]} onValueChange={(v) => setStudyHours(v[0])} min={0} max={14} step={0.5} />
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? 'Saving...' : <><Check className="h-4 w-4 mr-2" /> Log Check-In</>}
        </Button>
      </div>
    </div>
  );
};

export default CheckInForm;
