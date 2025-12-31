import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { BurnoutRisk } from '@/lib/types';

interface BurnoutIndicatorProps {
  risk: BurnoutRisk;
}

const BurnoutIndicator = ({ risk }: BurnoutIndicatorProps) => {
  const config = {
    Low: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
    Medium: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
    High: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
  }[risk.level];

  return (
    <motion.div 
      className={`rounded-lg ${config.bg} border ${config.border} p-5`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
          <config.icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Burnout Risk</p>
          <p className={`text-lg font-bold ${config.color}`}>{risk.level}</p>
        </div>
      </div>
      
      {risk.factors.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {risk.factors.map((factor, i) => (
            <span key={i} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              {factor}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BurnoutIndicator;
