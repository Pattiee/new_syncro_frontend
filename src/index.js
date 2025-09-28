import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { AuthProvider } from "./contexts/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import { initStore } from "./store";
import keycloak, { initKeycloak } from "./config/keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { clearAuth, setAuth, setLoading } from "./slices/authSlice";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { setStore } from "./services/apiClient";

const root = ReactDOM.createRoot(document.getElementById("root"));

const bootstrap = async () => {

  // 2. Use token to load store from Redis
  const store = await initStore(keycloak.token);
  
  setStore(store); // inject store into apiClient

  const onKeycloakEvent = (event) => {
    if (event === "onAuthSuccess" || event === "onAuthRefreshSuccess") {
      store.dispatch(
        setAuth({
          isAuthenticated: keycloak.authenticated ?? false,
          token: keycloak?.token ?? "",
          refreshToken: keycloak?.refreshToken ?? "",
          userProfile: keycloak?.tokenParsed,
        })
      );
    } else if (event === "onAuthLogout") {
      store.dispatch(clearAuth());
    } else if (event === "onReady") {
      store.dispatch(setLoading(false));
    }
  };

  // 3. Render App
  root.render(
    <Provider store={store}>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={initKeycloak}
        onEvent={onKeycloakEvent}
      >
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </ReactKeycloakProvider>
    </Provider>
  );
};

bootstrap();