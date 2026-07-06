import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const languages = [
  { code: "pt-BR", label: "Português", flag: "🇧🇷", displayText: "BR PT" },
  { code: "en-US", label: "English", flag: "🇺🇸", displayText: "EN US" },
  { code: "es", label: "Español", flag: "🇪🇸", displayText: "ES" },
  { code: "zh", label: "中文", flag: "🇨🇳", displayText: "ZH" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-primary-foreground hover:bg-white/20 hover:text-white">
          <Globe size={16} className="shrink-0" />
          <span className="text-sm font-medium">{currentLang.displayText}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] bg-white text-black z-[100]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer gap-2 ${i18n.language === lang.code ? "bg-gray-100 font-semibold" : ""}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
