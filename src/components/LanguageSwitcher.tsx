import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = [
    { code: "en", label: "EN" },
    { code: "hr", label: "HR" },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const handleChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem("lang", langCode);
    };

    return (
        <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            {languages.map((lang, idx) => (
                <span key={lang.code} className="flex items-center">
                    {idx > 0 && <span className="text-muted-foreground/40 text-xs mx-0.5">/</span>}
                    <button
                        onClick={() => handleChange(lang.code)}
                        className={`text-xs px-1 py-0.5 rounded transition-colors ${i18n.language === lang.code
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {lang.label}
                    </button>
                </span>
            ))}
        </div>
    );
}
