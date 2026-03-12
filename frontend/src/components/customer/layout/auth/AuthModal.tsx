import { memo } from "react";
import Overplay from "../../ui/Overplay";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

type AuthType = "login" | "register" | null;

type Props = {
  type: AuthType;
  onClose: () => void;
  onSwitch: (type: Exclude<AuthType, null>) => void;
};

function AuthModal({ type, onClose, onSwitch }: Props) {
  if (!type) return null;

  return (
    <>
      {type === "login" && (
        <LoginModal
          onClose={onClose}
          onSwitchRegister={() => onSwitch("register")}
        />
      )}
      {type === "register" && (
        <RegisterModal
          onClose={onClose}
          onSwitchLogin={() => onSwitch("login")}
        />
      )}
      <Overplay onClose={onClose} IndexForZ={97} />
    </>
  );
}

export default memo(AuthModal);
