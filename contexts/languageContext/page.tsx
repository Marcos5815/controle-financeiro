"use client"

import { createContext, useContext, useState } from "react";
import { Translations } from "@/app/mySettings/components/language/translations";

type LanguageType = "pt-BR" | "en-US";
type TranslationKeys = keyof typeof Translations["pt-BR"]

interface LanguageContextData {
    language: LanguageType;
    setLanguage: (lang: LanguageType) => void;
    t: (key: TranslationKeys) => string;
}

export const languageContext = createContext<LanguageContextData>({} as LanguageContextData);

export const LanguageProvider = ({ children }: {children: React.ReactNode}) => {
    const [language, setLanguage] = useState<LanguageType>("pt-BR");

    const t = (key: TranslationKeys) => {
        return Translations[language][key] || key;
    }

    return (
        <languageContext.Provider value={{language, setLanguage, t}}>
            {children}
        </languageContext.Provider>
    )
};

export const useLanguage = () => useContext(languageContext);