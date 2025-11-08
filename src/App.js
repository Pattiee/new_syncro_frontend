import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { routes } from "./routes";
import { useCart } from "./hooks/useCart";
import ProtectedRoute from "./utils/ProtectedRoute";

import Navbar from "./components/nav/NavBar";
import { ContactsNavbar } from "./components/nav/ContactsNavbar";
import FloatingCart from "./components/FloatingCart";
import FloatingCheckoutButton from "./components/FloatingCheckoutButton";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import { CategoryNav } from "./components/nav/CategoryNav";

const App = () => {
  const { pathname } = useLocation();
  const { cartItems } = useCart();

  // Paths controlling visibility
  const hidden = {
    footer: ["/auth", "/checkout"],
    cart: ["/auth", "/checkout", "/cart"],
    navbar: ["/auth", "/manager", "/ceo", "/account"],
    contactNav: ["/auth"],
  };
  
  const visible = {
    checkoutButton: ["/checkout", "/product", "/cart", "/"],
  }

  // Visibility flags
  const isFooterVisible = !hidden.footer.some(r => pathname.startsWith(r));
  const isNavbarVisible = !hidden.navbar.some(r => pathname.startsWith(r));
  const isContactNavVisible = !hidden.contactNav.some(r => pathname.startsWith(r));
  const isFloatingCartVisible = !hidden.cart.some(r => pathname.startsWith(r)) && cartItems?.length > 0;
  const isFloatingCheckoutBtnVisible = visible.checkoutButton.some(r => pathname.startsWith(r));

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800">
      <Toaster position="bottom-left" />

      {isContactNavVisible && <ContactsNavbar />}
      {isNavbarVisible && <Navbar />}

      <main className="flex-1">
        <Routes>
          {routes.map(({ path, roles, children, element }) => (
            <Route
              key={path}
              path={path}
              element={ roles?.length > 0 ? ( <ProtectedRoute roles={roles}>{element}</ProtectedRoute>) : ( element )}
            >
              {children.map(({ index, path, element }) =>
                index ? (
                  <Route key={`${path}`} index element={element} />
                ) : (
                  <Route key={path} path={path} element={element} />
                )
              )}
            </Route>
          ))}

          <Route path={"/"} index element={<Home/>}/>
        </Routes>
      </main>

      {isFloatingCartVisible && <FloatingCart />}
      {/* {isFloatingCheckoutBtnVisible && <FloatingCheckoutButton />} */}
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default App;
