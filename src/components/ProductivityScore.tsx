import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProductivityScoreProps {
  score: number;
  previousScore?: number;
}

const ProductivityScore = ({ score, previousScore }: ProductivityScoreProps) => {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreColor = () => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-primary';
    if (score >= 30) return 'text-warning';
    return 'text-destructive';
  };
  
  const getStrokeColor = () => {
    if (score >= 70) return 'stroke-success';
    if (score >= 50) return 'stroke-primary';
    if (score >= 30) return 'stroke-warning';
    return 'stroke-destructive';
  };
  
  const diff = previousScore !== undefined ? score - previousScore : 0;
  const getTrend = () => {
    if (diff > 3) return { icon: TrendingUp, color: 'text-success' };
    if (diff < -3) return { icon: TrendingDown, color: 'text-destructive' };
    return { icon: Minus, color: 'text-muted-foreground' };
  };
  const trend = getTrend();

  return (
    <div className="rounded-lg bg-card border border-border p-6">
      <p className="text-sm font-medium text-muted-foreground mb-4">Today's Score</p>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <svg className="h-32 w-32 -rotate-90 transform">
            <circle cx="64" cy="64" r={radius} className="fill-none stroke-secondary" strokeWidth="8" />
            <motion.circle
              cx="64" cy="64" r={radius}
              className={`fill-none ${getStrokeColor()}`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-4xl font-bold ${getScoreColor()}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {score}
            </motion.span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-xl font-semibold text-foreground mb-1">
            {score === 0 ? 'Not logged' : score >= 70 ? 'Great!' : score >= 50 ? 'Good' : 'Keep going'}
          </p>
          {previousScore !== undefined && diff !== 0 && (
            <div className={`flex items-center gap-1 ${trend.color}`}>
              <trend.icon className="h-4 w-4" />
              <span className="text-sm">{diff > 0 ? '+' : ''}{diff} from yesterday</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductivityScore;
