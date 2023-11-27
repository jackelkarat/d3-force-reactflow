import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import LayoutFlow from "./LayoutFlow";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <LayoutFlow />
  </StrictMode>
);