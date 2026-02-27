import { Flame, Snowflake, RefreshCw, Power } from "lucide-react";
import { useTranslation } from "react-i18next";

export type HeatingMode = "heat" | "cool" | "auto" | "off";

interface ModeSelectorProps {
  currentMode: HeatingMode;
  onModeChange: (mode: HeatingMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const { t } = useTranslation();

  const modes: { id: HeatingMode; labelKey: string; icon: typeof Flame }[] = [
    { id: "heat", labelKey: "mode.heat", icon: Flame },
    { id: "cool", labelKey: "mode.cool", icon: Snowflake },
    { id: "auto", labelKey: "mode.auto", icon: RefreshCw },
    { id: "off", labelKey: "mode.off", icon: Power },
  ];

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">{t("mode.title")}</h3>
      <div className="grid grid-cols-4 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={isActive ? "mode-btn-active" : "mode-btn"}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{t(mode.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
