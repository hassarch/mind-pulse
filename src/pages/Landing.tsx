import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, BarChart3, Shield, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">MindPulse</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Wellness
            </div>
            
            <h1 className="mb-5 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Track Your Wellness,<br />
              <span className="gradient-text">Boost Productivity</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground max-w-xl mx-auto">
              The smart way for students to monitor mood, energy, and study habits. Get AI insights and prevent burnout.
            </p>

            <Link to="/dashboard">
              <Button size="lg" className="glow">
                Start Journaling
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/50 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Zap, title: '30-Second Check-Ins', desc: 'Log mood, energy, stress, sleep & study time quickly.' },
              { icon: BarChart3, title: 'Visual Analytics', desc: 'Charts, heatmaps, and trends at a glance.' },
              { icon: Shield, title: 'Burnout Prevention', desc: 'AI warns you before burnout hits.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg bg-card border border-border p-5"
              >
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <p className="font-semibold text-foreground mb-1">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to thrive?</h2>
          <Link to="/dashboard">
            <Button className="glow">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-5">
        <div className="container mx-auto text-center text-xs text-muted-foreground">
          <p>Not medical advice. For wellness tracking only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
