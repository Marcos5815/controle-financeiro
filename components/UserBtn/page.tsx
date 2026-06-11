import MySettings from "@/app/mySettings/page";
import { useLanguage } from "@/contexts/languageContext/page";
import { Show, UserButton } from "@clerk/nextjs";

export const UserBtn = () => {

  const { t } = useLanguage()

  return (
    <Show when="signed-in">
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "w-12! h-12!",

            userButtonTrigger:
              "hover:scale-105 transition-transform duration-200",
          },
        }}
      >
        <UserButton.UserProfilePage
          label={t("settings")}
          url="Config"
          labelIcon={<span>⚙️</span>}
        >
          <MySettings />
        </UserButton.UserProfilePage>
      </UserButton>
    </Show>
  );
};


