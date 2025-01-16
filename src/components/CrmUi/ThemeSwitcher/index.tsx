import { GeneralUIContext } from "@/context/GeneralUIContext";
import "./styles.css";
import React from "react";
import useColorMode from "@/hooks/useColorMode";

export default function ThemeSwitcher() {

  const {
    theme,
    setTheme,
  } = React.useContext(GeneralUIContext);
  const [colorMode, setColorMode] = useColorMode();

  return (
    <>
      <label
      htmlFor="switcher"
        className={`switcher-container bg-gray-200 dark:bg-slate-700`}
      >
        <svg
          id="sun"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`lucide lucide-sun text-body`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>

        <svg
          id="moon"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`lucide lucide-moon dark:text-bodydark`}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>

        <input
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(colorMode === "light" ? "dark" : "light");
              setTheme(colorMode === "light" ? "dark" : "light");
            }
          }}
          checked={theme === "dark"}
          name="switcher"
          type="checkbox"
        />

        <div className="switcher-trigger" />
      </label>
    </>
  );
}
