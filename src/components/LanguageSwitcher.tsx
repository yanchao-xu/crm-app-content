import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={toggleLanguage}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">{language === "zh" ? "Switch to English" : "切换到中文"}</span>
    </Button>
  );
};

export default LanguageSwitcher;
