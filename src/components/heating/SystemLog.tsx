import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "error" | "warning" | "info";
  code: string;
  description: string;
  startTime?: string;
  endTime?: string;
}

interface SystemLogProps {
  entries: LogEntry[];
  maxEntries?: number;
}

export function SystemLog({ entries, maxEntries = 6 }: SystemLogProps) {
  const displayEntries = entries.slice(0, maxEntries);
  const { t } = useTranslation();

  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-heating" />;
      case "info":
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getRowClass = (type: LogEntry["type"], index: number) => {
    const base = index === 0 ? "bg-opacity-20" : "";
    switch (type) {
      case "error":
        return `${base} ${index === 0 ? "bg-destructive/10 border-l-2 border-destructive" : ""}`;
      case "warning":
        return `${base} ${index === 0 ? "bg-heating/10 border-l-2 border-heating" : ""}`;
      default:
        return "";
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{t("log.systemEvents")}</h3>
        <div className="flex items-center gap-2">
          <select className="text-xs bg-secondary/50 border-none rounded px-2 py-1 text-foreground">
            <option>{t("log.allEvents")}</option>
            <option>{t("log.errorsOnly")}</option>
            <option>{t("log.warnings")}</option>
          </select>
        </div>
      </div>

      {/* Log table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">{t("log.code")}</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">{t("log.description")}</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">{t("log.start")}</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">{t("log.end")}</th>
            </tr>
          </thead>
          <tbody>
            {displayEntries.map((entry, index) => (
              <tr
                key={entry.id}
                className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${getRowClass(entry.type, index)}`}
              >
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    {getIcon(entry.type)}
                    <span className="font-mono text-foreground">{entry.code}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-foreground">{entry.description}</td>
                <td className="py-2 px-3 text-muted-foreground hidden sm:table-cell font-mono">
                  {entry.startTime || "-"}
                </td>
                <td className="py-2 px-3 text-muted-foreground hidden sm:table-cell font-mono">
                  {entry.endTime || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length > maxEntries && (
        <div className="mt-3 text-center">
          <button className="text-xs text-primary hover:underline">
            {t("log.viewAll", { count: entries.length })}
          </button>
        </div>
      )}
    </div>
  );
}
