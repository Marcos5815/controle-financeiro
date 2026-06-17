"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { Translations } from "@/app/mySettings/_components/languageLocation/translations";
import { useUser } from "@clerk/nextjs";
import { useProfile } from "@/api/profile";
import { useRouter } from "next/navigation";


export type LanguageType = "pt-BR" | "en-US";
type TranslationKeys = keyof typeof Translations["pt-BR"]

interface LanguageContextData {
    language: LanguageType;
    changeLanguage: (lang: LanguageType) => Promise<void>
    t: (key: TranslationKeys) => string;
}

export const languageContext = createContext<LanguageContextData>({} as LanguageContextData);

export const LanguageProvider = ({ children }: {children: React.ReactNode}) => {
    const { user } = useUser();
    const router = useRouter();
    const [language, setLanguage] = useState<LanguageType>("pt-BR");

    useEffect(() => {
        const loadLanguage = async () => {

            if (!user?.unsafeMetadata?.language) return;
            
            if (user?.unsafeMetadata?.language) {
                setLanguage(user?.unsafeMetadata?.language);
            }
        };

        loadLanguage();
    }, [user?.unsafeMetadata?.language]);

    const changeLanguage = async (lang: LanguageType) => {
        if (!user) return;

        setLanguage(lang)

        await user.update({
            unsafeMetadata: {
                ...user.unsafeMetadata,
                language: lang
            }
        })

        router.refresh();


    }

    const t = (key: TranslationKeys) => {
        return Translations[language][key] || key;
    }

    return (
        <languageContext.Provider value={{language, changeLanguage, t}}>
            {children}
        </languageContext.Provider>
    )
};

export const useLanguage = () => useContext(languageContext);