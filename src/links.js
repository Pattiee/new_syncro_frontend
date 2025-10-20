import { ROLES } from "./roles";

export const MAIN_LINKS_FRONTEND = {
    HOME: process.env.REACT_APP_LINK_MAIN_HOME,
    AUTH: process.env.REACT_APP_LINK_MAIN_AUTH,
    CHECKOUT: process.env.REACT_APP_LINK_MAIN_CHECKOUT,
    ACCOUNT_INFO: process.env.REACT_APP_LINK_MAIN_ACCOUNT_INFO,
}

export const ADMIN_LINKS_FRONTEND = {
    INDEX: process.env.REACT_APP_LINK_MANAGER_INDEX,
    USER: process.env.REACT_APP_LINK_MANAGER_USER,
    USERS: process.env.REACT_APP_LINK_MANAGER_USERS,
    CATEGORIES: process.env.REACT_APP_LINK_MANAGER_CATEGORIES,
    ADD_CATEGORY: process.env.REACT_APP_LINK_MANAGER_ADD_CATEGORY,
    ADD_PRODUCTS: process.env.REACT_APP_LINK_MANAGER_ADD_PRODUCTS,
    BRANCHES: process.env.REACT_APP_LINK_MANAGER_BRANCHES,
    BRANCH: process.env.REACT_APP_LINK_MANAGER_BRANCH,
    ADD_BRANCH: process.env.REACT_APP_LINK_MANAGER_ADD_BRANCH,
}

export const ceoLinks = [
    { label: "Dashboard", to: "/ceo/dashboard", roles: [ROLES.CEO] },
    { label: "Branches", to: "/ceo/branches", roles: [ROLES.CEO] },
    { label: "Users", to: "/ceo/users", roles: [ROLES.CEO] },
    { label: "Role Manager", to: "/ceo/role-manager", roles: [ROLES.CEO] },
];

export const managerLinks = [
    { label: "Dashboard", to: "/manager/dashboard", roles: [ROLES.MANAGER] },
    { label: "Categories", to: "/manager/categories", roles: [ROLES.MANAGER] },
    { label: "Branches", to: "/manager/branches", roles: [ROLES.MANAGER] },
    { label: "Users", to: "/manager/users", roles: [ROLES.MANAGER] },
];

export const vendorLinks = [
    { label: "Dashboard", to: "/vendor/dashboard", roles: [ROLES.VENDOR] },
    { label: "Add Product", to: "/vendor/add-product", roles: [ROLES.VENDOR] },
];