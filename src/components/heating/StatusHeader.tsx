import { Wifi, Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

interface StatusHeaderProps {
  systemName?: string;
  isConnected?: boolean;
  lastUpdate?: string;
}

export function StatusHeader({
  systemName = "BioTec-L",
  isConnected = true,
  lastUpdate
}: StatusHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between p-3 sm:px-6 bg-card/50 backdrop-blur border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-base sm:text-lg font-semibold text-foreground">{systemName}</h1>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${isConnected ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          }`}>
          <Wifi className="w-3 h-3" />
          <span>{isConnected ? t("common.connected") : t("common.offline")}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <span className="text-xs text-muted-foreground hidden sm:block">{lastUpdate}</span>
        <button className="p-1.5 rounded hover:bg-secondary transition-colors">
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
