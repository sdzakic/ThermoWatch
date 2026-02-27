import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataPoint {
  time: string;
  boilerTemp: number;
  bufferTop: number;
  bufferBottom: number;
  roomTemp: number;
}

interface TemperatureChartProps {
  data: DataPoint[];
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

const timeRanges = ["30 min", "1 hour", "6 hours", "24 hours"];

export function TemperatureChart({ data, timeRange = "30 min", onTimeRangeChange }: TemperatureChartProps) {
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{t("chart.temperatureHistory")}</h3>

        {/* Time range selector */}
        <div className="relative">
          <button
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-foreground transition-colors"
          >
            {timeRange}
            <ChevronDown className={`w-4 h-4 transition-transform ${isRangeOpen ? "rotate-180" : ""}`} />
          </button>

          {isRangeOpen && (
            <div className="absolute right-0 top-full mt-1 py-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-24">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    onTimeRangeChange?.(range);
                    setIsRangeOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-sm hover:bg-secondary transition-colors ${range === timeRange ? "text-primary font-medium" : "text-foreground"
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              domain={[0, 200]}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "var(--shadow-md)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
              itemStyle={{ fontSize: 12 }}
              formatter={(value: number) => [`${value}°C`]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="boilerTemp"
              name={t("chart.boiler")}
              stroke="hsl(var(--heating))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="bufferTop"
              name={t("chart.bufferTop")}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="bufferBottom"
              name={t("chart.bufferBottom")}
              stroke="hsl(var(--cooling))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="roomTemp"
              name={t("chart.room")}
              stroke="hsl(var(--success))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time range indicator */}
      <div className="mt-3 text-center text-xs text-muted-foreground">
        02.02.2026 17:31 - 02.02.2026 18:01
      </div>
    </div>
  );
}
