import { ShopLayout } from "./layouts/ShopLayout";
import { ManagerLayout } from "./layouts/ManagerLayout";
import { VendorLayout } from "./layouts/VendorLayout";
import { CEO_Layout } from "./layouts/CEO_Layout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import { Products } from "./sections/Products";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartSummary from "./pages/CartSummary";
import { CheckoutPage } from "./pages/CheckoutPage";
import Account from "./pages/account/Account";
import { OrderDetails } from "./pages/orders/OrderDetails";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { CreatePassword } from "./pages/auth/CreatePassword";

import { ManagerDashboard } from "./pages/manager/ManagerDashboard";
import { RoleManager } from "./pages/manager/roles/RoleManager";
import { VendorDashboard } from "./pages/vendor/VendorDashboard";
import { CEO_Dashboard } from "./pages/admin/ceo/CEO_Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Categories } from "./pages/admin/Categories";
import { AddCategory } from "./pages/admin/AddCategory";
import AddProduct from "./pages/admin/AddProduct";
import { Branches } from "./pages/admin/company_branches/Branches";
import { AddBranch } from "./pages/admin/company_branches/AddBranch";
import { BranchDetails } from "./pages/admin/company_branches/BranchDetails";
import UsersPage from "./pages/admin/UsersPage";
import UserDetailsPage from "./pages/admin/UserDetailsPage";

import { ROLES } from "./roles";

export const routes = [
  {
    path: "/",
    element: <ShopLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "product", element: <ProductDetailsPage /> },
      { path: "cart", element: <CartSummary /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "account", element: <Account /> },
      { path: "order/:id", element: <OrderDetails /> },
    ],
  },
  {
    path: "/auth/",
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "create-password", element: <CreatePassword /> },
    ],
  },
  {
    path: "/manager/",
    element: <ManagerLayout />,
    roles: [ROLES.MANAGER],
    children: [
      { path: "dashboard", element: <ManagerDashboard /> },
      { path: "role-manager", element: <RoleManager /> },
      { path: "categories", element: <Categories /> },
      { path: "add-category", element: <AddCategory /> },
      { path: "branches", element: <Branches /> },
      { path: "branch/:id", element: <BranchDetails /> },
      { path: "add-branch", element: <AddBranch /> },
      { path: "users", element: <UsersPage /> },
      { path: "user/:id", element: <UserDetailsPage /> },
    ],
  },
  {
    path: "/vendor/",
    element: <VendorLayout />,
    roles: [ROLES.VENDOR],
    children: [
      { path: "dashboard", element: <VendorDashboard /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "my-products", element: <Products /> },
    ],
  },
  {
    path: "/ceo/",
    element: <CEO_Layout />,
    roles: [ROLES.CEO],
    children: [
      { path: "dashboard", element: <CEO_Dashboard /> },
      { path: "users", element: <UsersPage /> },
      { path: "user", element: <UserDetailsPage /> },
      { path: "role-manager", element: <RoleManager /> },
      { path: "branches", element: <Branches /> },
    ],
  },
];
