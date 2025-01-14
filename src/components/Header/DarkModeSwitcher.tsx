import { GeneralUIContext } from "@/context/GeneralUIContext";
import useColorMode from "@/hooks/useColorMode";
import { useContext } from "react";
import { BiSun, BiSolidMoon } from "react-icons/bi";

const DarkModeSwitcher = () => {
  const {
    setTheme,
  } = useContext(GeneralUIContext);
  const [colorMode, setColorMode] = useColorMode();

  return (
      <label
        className={`relative m-0 block h-6 w-10 mr-4 rounded-full ${colorMode === "dark" ? "bg-blue-700" : "bg-stroke"
          }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(colorMode === "light" ? "dark" : "light");
              setTheme(colorMode === "light" ? "dark" : "light");
            }
          }}
          className="absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 flex h-4.5 w-4.5 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${colorMode === "dark" ? " translate-x-5" : "left-[3px] translate-x-0"}`}
        >
          <span className="dark:hidden">
            <BiSun className="w-3.5 h-3.5 fill-current" />
          </span>
          <span className="hidden dark:inline-block">
            <BiSolidMoon className="w-3.5 h-3.5 fill-current" />
          </span>
        </span>
      </label>
  );
};

export default DarkModeSwitcher;
