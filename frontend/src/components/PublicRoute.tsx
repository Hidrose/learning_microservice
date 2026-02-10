import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  role: "admin" | "customer";
  exp: number;
}

interface PublicRouteProps {
  children: React.ReactNode;
  redirectPath: string;
  type: "admin" | "customer";
}

const PublicRoute = ({ children, redirectPath, type }: PublicRouteProps) => {
  const token =
    type === "admin"
      ? Cookies.get("token-admin")
      : Cookies.get("token-customer");

  if (!token) return <>{children}</>;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const role = decoded.role;
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      Cookies.remove("token");
      return <>{children}</>;
    }

    // Nếu đã login redirect theo role
    if (type === "admin" && role === "admin") {
      return <Navigate to={redirectPath} replace />;
    } else if (type === "customer" && role === "customer") {
      return <Navigate to="/" replace />;
    }
  } catch {
    Cookies.remove("token");
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default PublicRoute;
