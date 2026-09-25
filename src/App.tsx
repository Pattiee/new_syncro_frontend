import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { routes } from "./routes";
import { useCart } from "./hooks/useCart";
import ProtectedRoute from "./utils/ProtectedRoute"; // Note: Swap with RequireAuth if you fully migrate to our layout guard

import Navbar from "./components/nav/NavBar";
import { ContactsNavbar } from "./components/nav/ContactsNavbar";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import { useThemeSync } from "./hooks/useThemeSync"; // 🟢 Injected your new theme synchronization hook

// 1. Define explicit structure interfaces for dynamic app routing tables
export interface RouteChildConfig {
  index?: boolean;
  path: string;
  element: React.ReactNode;
}

export interface RouteConfig {
  path: string;
  roles?: string[];
  element: React.ReactNode;
  children: RouteChildConfig[];
}

interface VisibilityMap {
  footer: string[];
  cart: string[];
  navbar: string[];
  contactNav: string[];
}

const App: React.FC = () => {
  const { pathname } = useLocation();
  const { cartItems } = useCart();

  // 🟢 Initialize theme classes on the HTML document node automatically
  useThemeSync();

  // 2. Map route visibility exclusions using strict typing
  const hidden: VisibilityMap = {
    footer: ["/auth", "/checkout"],
    cart: ["/auth", "/checkout", "/cart"],
    navbar: ["/auth", "/manager", "/ceo", "/account"],
    contactNav: ["/auth"],
  };

  const visibleCheckoutButton: string[] = ["/checkout", "/product", "/cart", "/"];

  // 3. Compute visibility layout conditions
  const isFooterVisible = !hidden.footer.some((r) => pathname.startsWith(r));
  const isNavbarVisible = !hidden.navbar.some((r) => pathname.startsWith(r));
  const isContactNavVisible = !hidden.contactNav.some((r) => pathname.startsWith(r));
  
  // Note: These fallback on optional lengths in case your useCart hook initializes empty arrays
  const isFloatingCartVisible =
    !hidden.cart.some((r) => pathname.startsWith(r)) && (cartItems?.length ?? 0) > 0;
    
  const isFloatingCheckoutBtnVisible = visibleCheckoutButton.some((r) => pathname.startsWith(r));

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Toaster position="bottom-left" />

      {isContactNavVisible && <ContactsNavbar />}
      {isNavbarVisible && <Navbar />}

      {/* Changed flex-grow configuration to ensure footer settles neatly on small viewports */}
      <main className="flex-grow">
        <Routes>
          {(routes as RouteConfig[]).map(({ path, roles, children, element }) => (
            <Route
              key={path}
              path={path}
              element={
                roles && roles.length > 0 ? (
                  <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
                ) : (
                  element
                )
              }
            >
              {children?.map(({ index, path: childPath, element: childElement }) =>
                index ? (
                  <Route key="index-route" index element={childElement} />
                ) : (
                  <Route key={childPath} path={childPath} element={childElement} />
                )
              )}
            </Route>
          ))}

          <Route path="/" element={<Home />} />
        </Routes>
      </main>

      {/* {isFloatingCartVisible && <FloatingCart />} */}
      {/* {isFloatingCheckoutBtnVisible && <FloatingCheckoutButton />} */}
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default App;