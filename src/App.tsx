import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/MainRoute";
export const siteName = "Vasamilk";

const App: React.FC = () => {
  const originalAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === "wheel" || type === "touchstart" || type === "touchmove") {
      if (typeof options === "object") {
        options = { ...options, passive: false };
      } else if (options === true) {
        options = { passive: false };
      }
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  return (
    <div className="main">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName={() => "custom-toast"} // ✅ Safe + typed
        progressClassName="custom-toast-progress" // TS may still warn, but works
        className="custom-toast-container"
      />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
