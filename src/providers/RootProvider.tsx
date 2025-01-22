import React, { FC, ReactNode, Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Middleware from "../middleware";

type RouteConfig = {
  path: string;
  value: string;
  title: string;
  icon: string;
  element: ReactNode;
  requiresAuth: boolean;
};

type RootProviderProps = {
  routers: RouteConfig[];
};

const RootProvider: FC<RootProviderProps> = ({ routers }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail === "ad@123" && storedPassword === "1") {
      setIsAuthenticated(true);
    }
  }, []);

  return routers?.length > 0 ? (
    <Router>
      <Suspense fallback={<>Loading...</>}>
        <Routes>
          <Route element={<Middleware />}>
            {routers.map((route, index) => {
              // if (route.requiresAuth && !isAuthenticated) {
              //   return (
              //     <Route
              //       key={index}
              //       path={route.path}
              //       element={<Navigate to="/login" replace />}
              //     />
              //   );
              // }

              return (
                <Route key={index} path={route.path} element={route.element} />
              );
            })}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  ) : null;
};

export default RootProvider;
