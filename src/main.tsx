import ReactDOM from "react-dom/client";
import { App } from "./App";
import { AppearanceProvider } from "./appearance/AppearanceContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppearanceProvider>
    <App />
  </AppearanceProvider>,
);
