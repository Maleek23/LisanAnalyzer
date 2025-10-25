import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface UsageStat {
  meaning: string;
  count: number;
  percentage: number;
  color: string;
}

interface UsageStatisticsProps {
  data: UsageStat[];
  totalOccurrences: number;
}

const COLORS = {
  physical: '#8B0000',      // Burgundy for physical strike
  metaphorical: '#0F5F4E',  // Emerald for metaphorical
  controversial: '#D4AF37',  // Gold for controversial
  travel: '#2C5F2D',        // Dark green for travel
  separate: '#4A5568',      // Gray for separate
  example: '#2C5282',       // Blue for set forth example
};

export default function UsageStatistics({ data, totalOccurrences }: UsageStatisticsProps) {
  // Prepare data for pie chart
  const chartData = data.map(stat => ({
    name: stat.meaning,
    value: stat.count,
    percentage: stat.percentage,
    color: stat.color
  }));

  return (
    <Card className="border-primary/20" data-testid="card-usage-statistics">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          Usage Distribution Across {totalOccurrences} Occurrences
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Understanding how this word is used throughout the Qur'an
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ payload }) => {
                    if (!payload?.[0]) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                        <p className="font-semibold text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value} occurrences ({data.percentage.toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stat Cards */}
          <div className="space-y-3">
            {data.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate"
                style={{ borderLeft: `4px solid ${stat.color}` }}
                data-testid={`stat-card-${index}`}
              >
                <div>
                  <h4 className="font-semibold text-foreground">{stat.meaning}</h4>
                  <p className="text-sm text-muted-foreground">
                    {stat.count} {stat.count === 1 ? 'occurrence' : 'occurrences'}
                  </p>
                </div>
                <div className="text-right">
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insight */}
        <div className="mt-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
          <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Key Linguistic Insight
          </h4>
          <p className="text-sm text-foreground/90 leading-relaxed">
            The dominant usage pattern reveals the word's primary semantic field. 
            Context indicators (qualifiers, prepositions, surrounding words) determine which meaning applies in each verse.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
