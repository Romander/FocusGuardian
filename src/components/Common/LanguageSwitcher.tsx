import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { LANGUAGES, LangType } from "../../types/lang";
import { Button } from "./Button";

type LanguageSwitcher = {
  onChange: (langCode: LangType) => void;
};

const LanguageSwitcher: React.FC<LanguageSwitcher> = (props) => {
  const { onChange } = props;
  const { t, i18n } = useTranslation();

  const switchLanguage = useCallback(() => {
    const currentIndex = LANGUAGES.indexOf(i18n.language as LangType);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    const nextLanguage = LANGUAGES[nextIndex];

    i18n.changeLanguage(nextLanguage).catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Error changing language:", error);
    });

    onChange(nextLanguage);
  }, [i18n, onChange]);

  return (
    <Button title={t("LanguageSwitcher/title")} onClick={switchLanguage}>
      {t("lang")}
    </Button>
  );
};

export { LanguageSwitcher };
