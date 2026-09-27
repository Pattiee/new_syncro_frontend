import { ROLES } from "./roles";

// Interface defining the unified structural shape of sidebar/navigation link items
export interface NavLinkItem {
  label: string;
  to: string;
  roles: string[]; // Dynamically conforms to your existing administrative roles mapping matrix
}

export const MAIN_LINKS_FRONTEND = {
  HOME: process.env.REACT_APP_LINK_MAIN_HOME || "/",
  AUTH: process.env.REACT_APP_LINK_MAIN_AUTH || "/auth/login",
  CHECKOUT: process.env.REACT_APP_LINK_MAIN_CHECKOUT || "/checkout",
  ACCOUNT_INFO: process.env.REACT_APP_LINK_MAIN_ACCOUNT_INFO || "/account",
} as const;

export const ADMIN_LINKS_FRONTEND = {
  INDEX: process.env.REACT_APP_LINK_MANAGER_INDEX || "/manager",
  USER: process.env.REACT_APP_LINK_MANAGER_USER || "/manager/user",
  USERS: process.env.REACT_APP_LINK_MANAGER_USERS || "/manager/users",
  CATEGORIES: process.env.REACT_APP_LINK_MANAGER_CATEGORIES || "/manager/categories",
  ADD_CATEGORY: process.env.REACT_APP_LINK_MANAGER_ADD_CATEGORY || "/manager/add-category",
  ADD_PRODUCTS: process.env.REACT_APP_LINK_MANAGER_ADD_PRODUCTS || "/manager/add-product",
  BRANCHES: process.env.REACT_APP_LINK_MANAGER_BRANCHES || "/manager/branches",
  BRANCH: process.env.REACT_APP_LINK_MANAGER_BRANCH || "/manager/branch",
  ADD_BRANCH: process.env.REACT_APP_LINK_MANAGER_ADD_BRANCH || "/manager/add-branch",
} as const;

export const ceoLinks: NavLinkItem[] = [
  { label: "Dashboard", to: "/ceo/dashboard", roles: [ROLES.CEO] },
  { label: "Branches", to: "/ceo/branches", roles: [ROLES.CEO] },
  { label: "Users", to: "/ceo/users", roles: [ROLES.CEO] },
  { label: "Role Manager", to: "/ceo/role-manager", roles: [ROLES.CEO] },
];

export const managerLinks: NavLinkItem[] = [
  { label: "Dashboard", to: "/manager/dashboard", roles: [ROLES.MANAGER] },
  { label: "Categories", to: "/manager/categories", roles: [ROLES.MANAGER] },
  { label: "Branches", to: "/manager/branches", roles: [ROLES.MANAGER] },
  { label: "Users", to: "/manager/users", roles: [ROLES.MANAGER] },
];

export const vendorLinks: NavLinkItem[] = [
  { label: "Dashboard", to: "/vendor/dashboard", roles: [ROLES.VENDOR] },
  { label: "Add Product", to: "/vendor/add-product", roles: [ROLES.VENDOR] },
];