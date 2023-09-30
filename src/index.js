import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Root from "./routes/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import Home from "./routes/Home";

const router = createBrowserRouter([
  {
    path: "/TestingUpload",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/AddNewPullUpBar",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
