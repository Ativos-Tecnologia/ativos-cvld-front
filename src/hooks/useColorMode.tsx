"use client";
import { APP_ROUTES } from "@/constants/app-routes";
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;
    const routeIsPublic = Object.values(APP_ROUTES.public).map(
      (route) => route.name,
    );

    if (window.location.pathname === "/pricing") return;
    if (window.location.pathname === routeIsPublic.values.name) return;

    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
