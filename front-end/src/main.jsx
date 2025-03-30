// import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./assets/scss/style.scss";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import AuthContext from "./context/AuthContext";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <AuthContext>
    <App />
  </AuthContext>
);
