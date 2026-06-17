import { SignUp } from "@clerk/nextjs";
import { headers } from "next/headers";

export default async function Page() {

    const headersList = await headers();
    const acceptLanguage = (headersList.get("accept-language") || "").toLowerCase();
    const browserLanguage = acceptLanguage.includes("pt") ? "pt-BR" : "en-US";

    return (
        <div className="flex min-h-screen items-center justify-center isolation-auto">
        <SignUp 
            unsafeMetadata={{
                language: browserLanguage
            }}
        />
        </div>
    );
}