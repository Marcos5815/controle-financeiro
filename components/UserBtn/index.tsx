import MySettings from "@/app/mySettings/page";
import { useLanguage } from "@/contexts/languageContext";
import { Show, UserButton } from "@clerk/nextjs";
import { useState } from "react";

export const UserBtn = () => {

  const { t } = useLanguage()
  const [ open, setOpen ] = useState(false)

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
        <UserButton.MenuItems>
          <UserButton.Action
            label={t("settings")}
            labelIcon={<span>⚙️</span>}
            onClick={() => setOpen(true)}
          />
        </UserButton.MenuItems>
      </UserButton>

      <MySettings open={open} onClose={() => setOpen(false)} />
    </Show>
  );
};


