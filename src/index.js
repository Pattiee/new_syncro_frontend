import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./store";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter
            future={{
              v7_relativeSplatPath: true,
              v7_startTransition: true,
            }}
          >
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>

    {/* Optional but recommended */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
