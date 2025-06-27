import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/MainRoute";
export const siteName = "Vasamilk";

const App: React.FC = () => {
  return (
    <div className="main">
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
