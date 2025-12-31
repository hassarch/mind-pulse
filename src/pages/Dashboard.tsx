import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import ProductivityScore from '@/components/ProductivityScore';
import CheckInForm from '@/components/CheckInForm';
import BurnoutIndicator from '@/components/BurnoutIndicator';
import Heatmap from '@/components/Heatmap';
import TrendCharts from '@/components/TrendCharts';
import SafeBoundary from '@/components/SafeBoundary';
import WeeklyOverview from '@/components/WeeklyOverview';
import Disclaimer from '@/components/Disclaimer';
import GamifiedInsights from '@/components/GamifiedInsights';
import AIInsights from '@/components/AIInsights';
import OnboardingFlow from '@/components/OnboardingFlow';
import PlayerStats from '@/components/PlayerStats';
import { DailyCheckIn, UserProfile } from '@/lib/types';
import { calculateBurnoutRisk, calculateWeeklyStats, getHeatmapData } from '@/lib/analytics';

const STORAGE_KEY = 'mindpulse_checkins';
const PROFILE_KEY = 'mindpulse_profile';

const Dashboard = () => {
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  const handleNewCheckIn = (newCheckIn: DailyCheckIn) => {
    setCheckIns((prev) => {
      const existingIndex = prev.findIndex((c) => c.date === newCheckIn.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newCheckIn;
        return updated;
      }
      return [...prev, newCheckIn].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const todayEntry = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find((c) => c.date === today);
  }, [checkIns]);

  const yesterdayEntry = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return checkIns.find((c) => c.date === yesterday.toISOString().split('T')[0]);
  }, [checkIns]);

  const burnoutRisk = useMemo(() => calculateBurnoutRisk(checkIns), [checkIns]);
  const weeklyStats = useMemo(() => calculateWeeklyStats(checkIns), [checkIns]);
  const heatmapData = useMemo(() => getHeatmapData(checkIns), [checkIns]);

  // Show onboarding if profile doesn't exist
  if (!profile || !profile.onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <Link 
          to="/" 
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Player Stats Bar - Top of screen */}
          <PlayerStats profile={profile} checkIns={checkIns} />

          {/* Row 1: Score + Weekly Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <ProductivityScore
              score={todayEntry?.productivityScore ?? 0}
              previousScore={yesterdayEntry?.productivityScore}
            />
            <WeeklyOverview stats={weeklyStats} />
          </div>

          {/* Row 2: Check-in Form + Burnout + AI Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <SafeBoundary>
              <CheckInForm onSubmit={handleNewCheckIn} />
            </SafeBoundary>
            <div className="space-y-4">
              <SafeBoundary>
                <BurnoutIndicator risk={burnoutRisk} />
              </SafeBoundary>
              <SafeBoundary>
                <AIInsights checkIns={checkIns} />
              </SafeBoundary>
            </div>
          </div>

          {/* Row 3: Gamified Insights */}
          <SafeBoundary>
            <GamifiedInsights 
              profile={profile} 
              checkIns={checkIns} 
              onUpdateProfile={handleUpdateProfile}
            />
          </SafeBoundary>

          {/* Row 4: Charts */}
          <SafeBoundary fallback={<div className="rounded-lg bg-card border border-border p-5 text-sm text-muted-foreground">Unable to render charts</div>}>
            <TrendCharts data={checkIns} />
          </SafeBoundary>

          {/* Row 5: Heatmap */}
          <SafeBoundary fallback={<div className="rounded-lg bg-card border border-border p-5 text-sm text-muted-foreground">Unable to render heatmap</div>}>
            <Heatmap data={heatmapData} />
          </SafeBoundary>
        </motion.div>
      </main>

      <Disclaimer />
    </div>
  );
};

export default Dashboard;
