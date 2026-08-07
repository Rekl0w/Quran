import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "./lib/router";
import App from "./App.jsx";
import "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
