"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";

const SettingsPage = () => {
  const user = useCurrentUser();

  const [value, setValue] = useState("");
  console.log(value);
  return (
    <div className="">
      {JSON.stringify(user, null, 4)}
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" checked={user?.isTwoFactorEnabled} />
      </div>
    </div>
  );
};

export default SettingsPage;
