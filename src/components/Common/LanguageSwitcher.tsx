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

    void i18n.changeLanguage(nextLanguage).then(() => {
      onChange(nextLanguage);
    });
  }, [i18n, onChange]);

  return (
    <Button title={t("language_switcher_title")} onClick={switchLanguage}>
      {t("lang_flag")}
    </Button>
  );
};

export { LanguageSwitcher };
