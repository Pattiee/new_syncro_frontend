import AdminLayout from "./layouts/AdminLayout";
import { ShopLayout } from "./layouts/ShopLayout";
import { VendorLayout } from "./layouts/VendorLayout";
import { ManagerLayout } from "./layouts/ManagerLayout";
import { AddCategory } from "./pages/admin/AddCategory";
import AddProduct from "./pages/admin/AddProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ManagerDashboard } from "./pages/manager/ManagerDashboard";
import { RoleManager } from "./pages/manager/roles/RoleManager";
import { Categories } from "./pages/admin/Categories";
import { AddBranch } from "./pages/admin/company_branches/AddBranch";
import { BranchDetails } from "./pages/admin/company_branches/BranchDetails";
import { Branches } from "./pages/admin/company_branches/Branches";
import UserDetailsPage from "./pages/admin/UserDetailsPage";
import UsersPage from "./pages/admin/UsersPage";
import { Products } from "./sections/Products";
import Home from "./pages/Home";
import { Register } from "./pages/auth/Register";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { CreatePassword } from "./pages/auth/CreatePassword";
import { Login } from "./pages/auth/Login";
import ProductDetails from "./components/Product/ProductDetails";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Account from "./pages/account/Account";
import CartSummary from "./pages/CartSummary";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderDetails } from "./pages/orders/OrderDetails";
import { ROLES } from "./roles";
import { CEO_Layout } from "./layouts/CEO_Layout";
import { VendorDashboard } from "./pages/vendor/VendorDashboard";
import { CEO_Dashboard } from "./pages/admin/ceo/CEO_Dashboard";

export const routes = [
    {
        path: "/manager/",
        element: <ManagerLayout/>,
        roles: [ROLES.MANAGER],
        children: [
            { path: "dashboard", element: <ManagerDashboard/> },
            { path: "permissions", element: <AdminDashboard/> },
            { path: "categories", element: <Categories />},
            { path: "add-category", element: <AddCategory />},
            { path: "branch", element: <BranchDetails />},
            { path: "branches", element: <Branches />},
            { path: "add-branch", element: <AddBranch />},
            { path: "users", element: <UsersPage />},
            { path: "user", element: <UserDetailsPage />},
        ]
    },
    {
        path: "/vendor/",
        element: <VendorLayout/>,
        roles: [ROLES.VENDOR],
        children: [
            { path: "dashboard", element: <VendorDashboard/> },
            { path: "add-product", element: <AddProduct /> },
            { path: "my-products", element: <Products/> },
        ]
    },
    {
        path: "/ceo/",
        element: <AdminLayout/>,
        roles: [ROLES.CEO],
        children: [
            { path: "dashboard", element: <CEO_Dashboard/> },
            { path: "users", element: <UsersPage />},
            { path: "user", element: <UserDetailsPage /> },
            { path: "role-manager", element: <RoleManager/> },
            { path: "branches", element: <Branches/> },            
        ]
    },
]