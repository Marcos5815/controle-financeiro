"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { Translations } from "@/app/mySettings/components/languageLocation/translations";

type LanguageType = "pt-BR" | "en-US";
type TranslationKeys = keyof typeof Translations["pt-BR"]

const storage = localStorage;
const savedLanguage = storage.getItem("showLanguage") as "pt-BR" | "en-US"

const getInitialLanguage = () => {
    if(typeof window !== undefined) {
        const saveLanguage = storage.getItem("showLanguage")
        return (saveLanguage === "pt-BR" || saveLanguage === "en-US") ? savedLanguage : "pt-BR";
    }
    return "pt-BR";
}

interface LanguageContextData {
    language: LanguageType;
    setLanguage: (lang: LanguageType) => void;
    t: (key: TranslationKeys) => string;
}

export const languageContext = createContext<LanguageContextData>({} as LanguageContextData);

export const LanguageProvider = ({ children }: {children: React.ReactNode}) => {
    const [language, setLanguage] = useState<LanguageType>(getInitialLanguage);

    const t = (key: TranslationKeys) => {
        return Translations[language][key] || key;
    }

    useEffect(() => {
        storage.setItem("showLanguage", language)
    }, [language])

    return (
        <languageContext.Provider value={{language, setLanguage, t}}>
            {children}
        </languageContext.Provider>
    )
};

export const useLanguage = () => useContext(languageContext);