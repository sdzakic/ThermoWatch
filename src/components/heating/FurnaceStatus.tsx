import { Flame, ThermometerSun, Clock, Zap } from "lucide-react";

interface FurnaceStatusProps {
  isRunning: boolean;
  furnaceTemp?: number;
  runtime?: string;
  efficiency?: number;
}

export function FurnaceStatus({
  isRunning,
  furnaceTemp = 0,
  runtime = "0h 0m",
  efficiency = 0,
}: FurnaceStatusProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Furnace Status</h3>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isRunning
              ? "bg-heating/15 text-heating"
              : "bg-idle/15 text-idle"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? "bg-heating animate-pulse" : "bg-idle"
            }`}
          />
          {isRunning ? "Running" : "Standby"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30">
          <ThermometerSun className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-semibold text-foreground">{furnaceTemp}°</span>
          <span className="text-xs text-muted-foreground">Supply</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30">
          <Clock className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-semibold text-foreground">{runtime}</span>
          <span className="text-xs text-muted-foreground">Runtime</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30">
          <Zap className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-semibold text-foreground">{efficiency}%</span>
          <span className="text-xs text-muted-foreground">Efficiency</span>
        </div>
      </div>
    </div>
  );
}
