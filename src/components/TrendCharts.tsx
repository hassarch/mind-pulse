import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DailyCheckIn } from '@/lib/types';

interface TrendChartsProps {
  data: DailyCheckIn[];
}

const TrendCharts = ({ data }: TrendChartsProps) => {
  const last14Days = data.slice(-14);
  const hasData = last14Days.length > 0;

  const chartData = last14Days.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: d.mood, energy: d.energy, stress: d.stress, productivity: d.productivityScore,
  }));

  const placeholderData = Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`, mood: 0, energy: 0, stress: 0, productivity: 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-2.5 shadow-lg text-sm">
          <p className="font-medium text-foreground mb-1">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} style={{ color: entry.color }} className="text-xs">{entry.name}: {entry.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg bg-card border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Trends</h3>
      </div>

      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary mb-4">
          <TabsTrigger value="mood" className="data-[state=active]:bg-card">Mood & Energy</TabsTrigger>
          <TabsTrigger value="productivity" className="data-[state=active]:bg-card">Productivity</TabsTrigger>
        </TabsList>

        <TabsContent value="mood">
          <div className="h-48 relative">
            {!hasData && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10">
                <p className="text-muted-foreground text-sm">Log entries to see trends</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hasData ? chartData : placeholderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <YAxis domain={[1, 5]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="mood" name="Mood" stroke="hsl(var(--chart-mood))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="energy" name="Energy" stroke="hsl(var(--chart-energy))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-chart-mood" /><span className="text-xs text-muted-foreground">Mood</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-chart-energy" /><span className="text-xs text-muted-foreground">Energy</span></div>
          </div>
        </TabsContent>

        <TabsContent value="productivity">
          <div className="h-48 relative">
            {!hasData && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10">
                <p className="text-muted-foreground text-sm">Log entries to see trends</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hasData ? chartData : placeholderData}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="productivity" name="Score" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#prodGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendCharts;
