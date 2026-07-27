import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { publicAssetUrl } from "./lib/assets";

if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    });
  } else {
    window.addEventListener('load', () => navigator.serviceWorker.register(publicAssetUrl('/sw.js')));
  }
}

createRoot(document.getElementById("root")!).render(<App />);
