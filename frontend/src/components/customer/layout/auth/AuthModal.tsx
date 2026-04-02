import { memo } from "react";
import Overplay from "../../ui/Overplay";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../redux/Store";
import {
  closeAuthModal,
  switchAuthModal,
} from "../../../../redux/slices/AuthModalSlice";

function AuthModal() {
  const type = useSelector((state: RootState) => state.authModal.type);
  const dispatch = useDispatch();

  if (!type) return null;

  return (
    <>
      {type === "login" && (
        <LoginModal
          onClose={() => dispatch(closeAuthModal())}
          onSwitchRegister={() => dispatch(switchAuthModal("register"))}
        />
      )}
      {type === "register" && (
        <RegisterModal
          onClose={() => dispatch(closeAuthModal())}
          onSwitchLogin={() => dispatch(switchAuthModal("login"))}
        />
      )}
      <Overplay onClose={() => dispatch(closeAuthModal())} IndexForZ={97} />
    </>
  );
}

export default memo(AuthModal);
