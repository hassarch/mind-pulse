import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar } from 'lucide-react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';

interface HeatmapProps {
  data: { date: string; value: number }[][];
}

const Heatmap = ({ data }: HeatmapProps) => {
  // Flatten data for easy lookup
  const dataMap = new Map<string, number>();
  data.forEach(week => {
    week.forEach(day => {
      if (day.date) {
        dataMap.set(day.date, day.value);
      }
    });
  });

  const hasData = dataMap.size > 0;

  // Generate GitHub-style grid: 52 weeks x 7 days
  const today = new Date();
  const weeks: { date: Date; value: number }[][] = [];
  
  // Start from 52 weeks ago, aligned to Sunday
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 });
  
  for (let w = 0; w < 53; w++) {
    const week: { date: Date; value: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(startDate, w * 7 + d);
      const dateStr = format(date, 'yyyy-MM-dd');
      const value = dataMap.get(dateStr) || 0;
      week.push({ date, value });
    }
    weeks.push(week);
  }

  const getColor = (value: number) => {
    if (value === 0) return 'bg-heatmap-empty';
    if (value < 40) return 'bg-heatmap-low';
    if (value < 60) return 'bg-heatmap-medium';
    if (value < 80) return 'bg-heatmap-high';
    return 'bg-heatmap-max';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get month labels for the header
  const monthLabels: { label: string; colStart: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = week[0].date;
    const month = firstDayOfWeek.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        label: format(firstDayOfWeek, 'MMM'),
        colStart: weekIndex,
      });
      lastMonth = month;
    }
  });

  return (
    <div className="rounded-3xl bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Month labels */}
          <div className="flex mb-2 ml-10">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-xs text-muted-foreground"
                style={{ 
                  marginLeft: i === 0 ? m.colStart * 14 : (m.colStart - (monthLabels[i-1]?.colStart || 0)) * 14 - 24
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2 pt-[2px]">
              {dayLabels.map((day, i) => (
                <span
                  key={day}
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
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    const isToday = format(day.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                    const isFuture = day.date > today;
                    
                    return (
                      <Tooltip key={di}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: wi * 0.008 + di * 0.005 }}
                            className={`h-[12px] w-[12px] rounded-sm cursor-pointer transition-all ${
                              isFuture 
                                ? 'bg-transparent' 
                                : getColor(day.value)
                            } ${
                              isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
                            } ${
                              !isFuture ? 'hover:ring-1 hover:ring-primary/50' : ''
                            }`}
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
          <div className="mt-4 flex items-center justify-end gap-2">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {['bg-heatmap-empty', 'bg-heatmap-low', 'bg-heatmap-medium', 'bg-heatmap-high', 'bg-heatmap-max'].map((c, i) => (
                <div key={i} className={`h-[12px] w-[12px] rounded-sm ${c}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
