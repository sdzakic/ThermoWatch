import { Flame, Snowflake, Power } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TemperatureDisplayProps {
  currentTemp: number;
  targetTemp: number;
  status: "heating" | "cooling" | "idle" | "off";
  onIncrease: () => void;
  onDecrease: () => void;
}

export function TemperatureDisplay({
  currentTemp,
  targetTemp,
  status,
  onIncrease,
  onDecrease,
}: TemperatureDisplayProps) {
  const { t } = useTranslation();

  const statusConfig = {
    heating: {
      icon: Flame,
      label: t("tempDisplay.heating"),
      ringClass: "temp-ring-heating animate-glow",
      iconColor: "text-heating",
    },
    cooling: {
      icon: Snowflake,
      label: t("tempDisplay.cooling"),
      ringClass: "temp-ring-cooling",
      iconColor: "text-cooling",
    },
    idle: {
      icon: Power,
      label: t("tempDisplay.idle"),
      ringClass: "",
      iconColor: "text-idle",
    },
    off: {
      icon: Power,
      label: t("tempDisplay.off"),
      ringClass: "",
      iconColor: "text-muted-foreground",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Status indicator */}
      <div
        className={`status-badge ${status === "heating"
            ? "status-badge-heating"
            : status === "cooling"
              ? "status-badge-cooling"
              : "status-badge-idle"
          }`}
      >
        <StatusIcon className="w-4 h-4" />
        <span>{config.label}</span>
      </div>

      {/* Main temperature ring */}
      <div className={`temp-ring ${config.ringClass} w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          {/* Current temperature */}
          <div className="text-7xl sm:text-8xl font-light text-foreground tracking-tight">
            {currentTemp}°
          </div>

          {/* Target temperature */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground text-sm">{t("common.target")}</span>
            <span className="text-xl font-medium text-primary">{targetTemp}°</span>
          </div>
        </div>
      </div>

      {/* Temperature controls */}
      <div className="flex items-center gap-8">
        <button
          onClick={onDecrease}
          className="control-btn group"
          aria-label={t("tempDisplay.decreaseTemp")}
        >
          <span className="text-2xl text-muted-foreground group-hover:text-primary transition-colors">−</span>
        </button>

        <div className="text-center">
          <div className="text-3xl font-semibold text-foreground">{targetTemp}°C</div>
          <div className="text-sm text-muted-foreground">{t("tempDisplay.setTemperature")}</div>
        </div>

        <button
          onClick={onIncrease}
          className="control-btn group"
          aria-label={t("tempDisplay.increaseTemp")}
        >
          <span className="text-2xl text-muted-foreground group-hover:text-primary transition-colors">+</span>
        </button>
      </div>
    </div>
  );
}
