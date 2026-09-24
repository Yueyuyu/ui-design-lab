import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./gallery/fonts/public-font.css";
import "./gallery/catalog.css";
import "./gallery/public-header.css";
import "./gallery/public-layout.css";
import "./gallery/cover/cover.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
