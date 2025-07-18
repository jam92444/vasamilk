import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./Styles/main.scss";
import { AuthProvider } from "./Context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
