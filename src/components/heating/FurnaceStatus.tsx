import { Flame, ThermometerSun, Clock, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{t("furnace.furnaceStatus")}</h3>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isRunning
              ? "bg-heating/15 text-heating"
              : "bg-idle/15 text-idle"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${isRunning ? "bg-heating animate-pulse" : "bg-idle"
              }`}
          />
          {isRunning ? t("furnace.running") : t("common.standby")}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30">
          <ThermometerSun className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-semibold text-foreground">{furnaceTemp}°</span>
          <span className="text-xs text-muted-foreground">{t("furnace.supply")}</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30">
          <Clock className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-semibold text-foreground">{runtime}</span>
          <span className="text-xs text-muted-foreground">{t("furnace.runtime")}</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30">
          <Zap className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-semibold text-foreground">{efficiency}%</span>
          <span className="text-xs text-muted-foreground">{t("furnace.efficiency")}</span>
        </div>
      </div>
    </div>
  );
}
