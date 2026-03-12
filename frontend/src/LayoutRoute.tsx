import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/customer/HomePage";
import ProductListCategoryPage from "./pages/customer/ProductListCategoryPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import AccountPage from "./pages/customer/AccountPage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import OrderResultPage from "./pages/customer/OrderResultPage";
import LoginPage from "./pages/admin/LoginPage";
import PaymentListPage from "./pages/admin/PaymentListPage";
import AccountAdminPage from "./pages/admin/AccountPage";
import AdminListPage from "./pages/admin/AdminListPage";
import CustomerListPage from "./pages/admin/CustomerListPage";
import AddAdminPage from "./pages/admin/AddAdminPage";
import EditAdminPage from "./pages/admin/EditAdminPage";
import BrandListPage from "./pages/admin/BrandListPage";
import AddBrandPage from "./pages/admin/AddBrandPage";
import EditBrandPage from "./pages/admin/EditBrandPage";
import CategoryListPage from "./pages/admin/CategoryListPage";
import AddCategoryPage from "./pages/admin/AddCategoryPage";
import EditCategoryPage from "./pages/admin/EditCategoryPage";
import OrderListPage from "./pages/admin/OrderListPage";
import OrderDetailAdmin from "./pages/admin/OrderDetailPage";
import ProductListPage from "./pages/admin/ProductListPage";
import AddProductPage from "./pages/admin/AddProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import ProductListDiscountPage from "./pages/customer/ProductListDiscountPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
function LayoutRoute() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:slug" element={<ProductListCategoryPage />} />
      <Route path="/products/sale" element={<ProductListDiscountPage />} />
      <Route path="/product/:slug" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />

      <Route
        path="/account/profile"
        element={
          <PrivateRoute
            type="customer"
            allowedRoles={["customer"]}
            redirectPath="/"
          >
            <AccountPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/order/history"
        element={
          <PrivateRoute
            type="customer"
            allowedRoles={["customer"]}
            redirectPath="/"
          >
            <OrderHistoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/order/history/:code"
        element={
          <PrivateRoute
            type="customer"
            allowedRoles={["customer"]}
            redirectPath="/"
          >
            <OrderDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute
            type="customer"
            allowedRoles={["customer"]}
            redirectPath="/"
          >
            <CheckoutPage />
          </PrivateRoute>
        }
      />

      <Route path="/order-result" element={<OrderResultPage />} />

      <Route
        path="/admin/login"
        element={
          <PublicRoute type="admin" redirectPath="/admin/account/profile">
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/admin/account/profile"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <AccountAdminPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <PaymentListPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/admins"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <AdminListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/add-admin"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <AddAdminPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-admin/:id"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <EditAdminPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/customers"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <CustomerListPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <ProductListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <AddProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-product/:id"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <EditProductPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/brands"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <BrandListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/add-brand"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <AddBrandPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-brand/:id"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <EditBrandPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <CategoryListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/add-category"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <AddCategoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-category/:id"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <EditCategoryPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <OrderListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/order/:id"
        element={
          <PrivateRoute
            type="admin"
            allowedRoles={["admin"]}
            redirectPath="/admin/login"
          >
            <OrderDetailAdmin />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default LayoutRoute;
