import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface JwtPayload {
  id: string;
  role: "admin" | "customer";
  exp: number;
}

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath: string;
  type: "admin" | "customer";
}

const PrivateRoute = ({
  children,
  allowedRoles,
  redirectPath = "/login",
  type,
}: PrivateRouteProps) => {
  const token =
    type === "admin"
      ? Cookies.get("token-admin")
      : Cookies.get("token-customer");

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // kiểm tra token hết hạn
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      Cookies.remove("token");
      return <Navigate to={redirectPath} replace />;
    }

    // kiểm tra quyền truy cập
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
  } catch {
    Cookies.remove("token");
    return <Navigate to={redirectPath} replace />;
  }
};

export default PrivateRoute;
