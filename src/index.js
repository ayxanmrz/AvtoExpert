import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import global_en from "./translations/en/global.json";
import global_az from "./translations/az/global.json";
import global_ru from "./translations/ru/global.json";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";

let langSelected = localStorage.getItem("lang");

i18next.init({
  interpolation: { escapevalue: false },
  lng: ["az", "en", "ru"].includes(langSelected) ? langSelected : "az",
  resources: {
    en: {
      global: global_en,
    },
    az: {
      global: global_az,
    },
    ru: {
      global: global_ru,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <HelmetProvider>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </HelmetProvider>
  </BrowserRouter>
);
