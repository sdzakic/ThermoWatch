import { Clock, Edit2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ScheduleItem {
  id: string;
  time: string;
  temp: number;
  label: string;
  active?: boolean;
}

interface ScheduleCardProps {
  schedules: ScheduleItem[];
  onEdit?: () => void;
}

export function ScheduleCard({ schedules, onEdit }: ScheduleCardProps) {
  const { t } = useTranslation();

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">{t("schedule.todaysSchedule")}</h3>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={schedule.active ? "schedule-card-active" : "schedule-card"}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${schedule.active ? "bg-primary" : "bg-muted"
                    }`}
                />
                <div>
                  <div className="font-medium text-foreground">{schedule.time}</div>
                  <div className="text-xs text-muted-foreground">{schedule.label}</div>
                </div>
              </div>
              <div className="text-lg font-semibold text-primary">{schedule.temp}°</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
