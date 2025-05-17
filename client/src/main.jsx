import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Capacitor } from "@capacitor/core";

// Listen for device ready event when running as a mobile app
if (Capacitor.isNativePlatform()) {
  document.addEventListener(
    "deviceready",
    () => {
      console.log("Device is ready");
    },
    false
  );
}

createRoot(document.getElementById("root")).render(<App />);
