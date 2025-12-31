import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Target, Clock, Zap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/lib/types';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

const goals = [
  { id: 'reduce-stress', label: 'Reduce stress', icon: '🧘' },
  { id: 'better-sleep', label: 'Sleep better', icon: '😴' },
  { id: 'more-energy', label: 'More energy', icon: '⚡' },
  { id: 'mood-tracking', label: 'Track my mood', icon: '📊' },
  { id: 'mindfulness', label: 'Practice mindfulness', icon: '🌿' },
  { id: 'work-balance', label: 'Work-life balance', icon: '⚖️' },
];

const stressTriggers = [
  { id: 'work', label: 'Work pressure', icon: '💼' },
  { id: 'relationships', label: 'Relationships', icon: '💔' },
  { id: 'health', label: 'Health concerns', icon: '🏥' },
  { id: 'finances', label: 'Finances', icon: '💰' },
  { id: 'time', label: 'Time management', icon: '⏰' },
  { id: 'uncertainty', label: 'Uncertainty', icon: '❓' },
];

const checkInTimes = [
  { id: 'morning', label: 'Morning', time: '8:00 AM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '2:00 PM', icon: '☀️' },
  { id: 'evening', label: 'Evening', time: '8:00 PM', icon: '🌙' },
];

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    goals: [],
    wakeTime: '07:00',
    sleepTime: '23:00',
    stressTriggers: [],
    checkInTime: 'evening',
  });

  const steps = [
    {
      icon: Sparkles,
      title: "What should we call you?",
      subtitle: "Let's make this personal",
    },
    {
      icon: Target,
      title: "What are your wellness goals?",
      subtitle: "Select all that apply",
    },
    {
      icon: Clock,
      title: "What's your sleep schedule?",
      subtitle: "This helps us understand your patterns",
    },
    {
      icon: Zap,
      title: "What triggers your stress?",
      subtitle: "We'll help you manage these",
    },
    {
      icon: Bell,
      title: "When should we check in?",
      subtitle: "Pick your ideal time for daily reflection",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const completeProfile: UserProfile = {
        name: profile.name || 'Friend',
        goals: profile.goals || [],
        wakeTime: profile.wakeTime || '07:00',
        sleepTime: profile.sleepTime || '23:00',
        stressTriggers: profile.stressTriggers || [],
        checkInTime: profile.checkInTime || 'evening',
        onboardingComplete: true,
        currentStreak: 0,
        longestStreak: 0,
        totalXP: 0,
        level: 1,
      };
      onComplete(completeProfile);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleGoal = (goalId: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals?.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...(prev.goals || []), goalId],
    }));
  };

  const toggleTrigger = (triggerId: string) => {
    setProfile(prev => ({
      ...prev,
      stressTriggers: prev.stressTriggers?.includes(triggerId)
        ? prev.stressTriggers.filter(t => t !== triggerId)
        : [...(prev.stressTriggers || []), triggerId],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return (profile.name?.trim().length || 0) > 0;
      case 1: return (profile.goals?.length || 0) > 0;
      case 2: return true;
      case 3: return (profile.stressTriggers?.length || 0) > 0;
      case 4: return true;
      default: return false;
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed progress bar at top */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <CurrentIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Step {step + 1} of {steps.length}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-1">{steps[step].title}</h2>
            <p className="text-muted-foreground mb-6">{steps[step].subtitle}</p>

            {/* Step 0: Name */}
            {step === 0 && (
              <Input
                placeholder="Enter your name..."
                value={profile.name || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="text-lg py-6 bg-secondary border-border"
                autoFocus
              />
            )}

            {/* Step 1: Goals */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      profile.goals?.includes(goal.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{goal.icon}</span>
                    <span className="text-sm font-medium text-foreground">{goal.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Sleep Schedule */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Wake up time</label>
                  <Input
                    type="time"
                    value={profile.wakeTime || '07:00'}
                    onChange={(e) => setProfile(prev => ({ ...prev, wakeTime: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Bedtime</label>
                  <Input
                    type="time"
                    value={profile.sleepTime || '23:00'}
                    onChange={(e) => setProfile(prev => ({ ...prev, sleepTime: e.target.value }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Stress Triggers */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-3">
                {stressTriggers.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => toggleTrigger(trigger.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      profile.stressTriggers?.includes(trigger.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{trigger.icon}</span>
                    <span className="text-sm font-medium text-foreground">{trigger.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Check-in Time */}
            {step === 4 && (
              <div className="space-y-3">
                {checkInTimes.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => setProfile(prev => ({ ...prev, checkInTime: time.id }))}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                      profile.checkInTime === time.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    <span className="text-3xl">{time.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{time.label}</p>
                      <p className="text-sm text-muted-foreground">Around {time.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 py-6 rounded-2xl border-border"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 py-6 rounded-2xl bg-primary hover:bg-primary/90"
              >
                {step === steps.length - 1 ? "Let's Begin" : 'Continue'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
