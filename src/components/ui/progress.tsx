import * as React from 'react';
import clsx from 'clsx';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 - 100
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, className, ...props }, ref) => {
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        className={clsx(
          'w-full overflow-hidden bg-secondary/40 border border-border rounded-full',
          className
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress;
