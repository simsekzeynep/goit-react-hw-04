import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./components/App/App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "12px",
          padding: "14px 18px",
          background: "#20243b",
          color: "#ffffff",
          fontSize: "14px",
        },
      }}
    />
  </React.StrictMode>,
);
