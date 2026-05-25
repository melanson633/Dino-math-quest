import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    });
  } else {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
  }
}

createRoot(document.getElementById("root")!).render(<App />);
