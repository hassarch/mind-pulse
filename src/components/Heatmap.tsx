import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface HeatmapProps {
  // Expect a 53x7 grid (weeks x days) of ISO date strings and values
  data: { date: string; value: number }[][];
}

function brandBgFor(value: number): string {
  // Map to CSS variables defined in index.css -> tailwind.config theme.extend.colors.heatmap
  if (value <= 0) return 'hsl(var(--heatmap-empty))';
  if (value < 25) return 'hsl(var(--heatmap-low))';
  if (value < 50) return 'hsl(var(--heatmap-medium))';
  if (value < 75) return 'hsl(var(--heatmap-high))';
  return 'hsl(var(--heatmap-max))';
}

const Heatmap = ({ data }: HeatmapProps) => {
  // Normalize incoming data into Date objects and clamp to valid shape
  const fullWeeks = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    return safe.map((week) =>
      (Array.isArray(week) ? week : []).map((d) => ({
        date: new Date(d?.date ?? ''),
        value: Number.isFinite(d?.value as number) ? (d!.value as number) : 0,
      }))
    );
  }, [data]);

  // Compact mode on small screens
  const [weeksToShow, setWeeksToShow] = useState(53);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setWeeksToShow(mq.matches ? 28 : 53);
    update();
    // add/remove event listeners for compatibility
    if (mq.addEventListener) mq.addEventListener('change', update);
    // @ts-ignore legacy
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      // @ts-ignore legacy
      else mq.removeListener(update);
    };
  }, []);

  const weeks = useMemo(() => fullWeeks.slice(-weeksToShow), [fullWeeks, weeksToShow]);
  const todayISO = new Date().toISOString().split('T')[0];

  // Month labels based on first day of each visible week
  const monthLabels: { label: string; colStart: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0]?.date;
    if (!firstDay || isNaN(firstDay.getTime())) return;
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: format(firstDay, 'MMM'), colStart: weekIndex });
      lastMonth = month;
    }
  });

  // Show Mon, Wed, Fri only to reduce clutter
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Detect empty data (all zeros)
  const isAllEmpty = weeks.flat().every((d) => !d || !Number.isFinite(d.value) || d.value <= 0);

  return (
    <div className="rounded-3xl bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          {/* Month labels */}
          <div className="flex mb-2 ml-10 select-none">
            {monthLabels.map((m, i) => (
              <span
                key={`${m.label}-${i}`}
                className="text-xs text-muted-foreground"
                style={{
                  marginLeft:
                    i === 0 ? m.colStart * 16 : (m.colStart - monthLabels[i - 1]!.colStart) * 16 - 24,
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2 pt-[2px] select-none">
              {dayLabels.map((day, i) => (
                <span
                  key={`dl-${i}`}
                  className={`text-xs text-muted-foreground h-[12px] leading-[12px] ${
                    i % 2 === 0 ? 'opacity-0' : ''
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={`w-${wi}`} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    const iso = isNaN(day.date.getTime())
                      ? ''
                      : day.date.toISOString().split('T')[0];
                    const isToday = iso === todayISO;
                    const isFuture = !iso || day.date.getTime() > Date.now();
                    const bg = isFuture ? 'transparent' : brandBgFor(day.value);

                    return (
                      <Tooltip key={`d-${wi}-${di}`}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: wi * 0.008 + di * 0.005 }}
                            className="h-[13px] w-[13px] rounded-[3px] cursor-pointer"
                            style={{
                              backgroundColor: bg,
                              outline: isToday ? '2px solid hsl(var(--primary))' : undefined,
                              outlineOffset: isToday ? 1 : undefined,
                            }}
                          />
                        </TooltipTrigger>
                        {!isFuture && (
                          <TooltipContent>
                            <p className="font-medium">{format(day.date, 'MMM d, yyyy')}</p>
                            {day.value > 0 ? (
                              <p className="text-muted-foreground">Score: {day.value}</p>
                            ) : (
                              <p className="text-muted-foreground">No check-in</p>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-2 select-none">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {['var(--heatmap-empty)','var(--heatmap-low)','var(--heatmap-medium)','var(--heatmap-high)','var(--heatmap-max)'].map((cssVar, i) => (
                <div key={`lg-${i}`} className="h-[12px] w-[12px] rounded-[3px]" style={{ backgroundColor: `hsl(${cssVar})` }} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>

          {isAllEmpty && (
            <p className="mt-3 text-xs text-muted-foreground">No activity yet. Start logging check-ins to see your activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
