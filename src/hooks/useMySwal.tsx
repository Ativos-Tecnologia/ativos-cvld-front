import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useColorMode from "./useColorMode";

const MySwal = withReactContent(Swal);

export default function UseMySwal() {

  const [colorMode, setColorMode] = useColorMode();

  const preConfiguredSwal = MySwal.mixin({
    color: `${colorMode === "light" ? "#64748B" : "#AEB7C0"}`,
    background: `${colorMode === "light" ? "#FFF" : "#24303F"}`,
    confirmButtonColor: "#1c64f2"
  })
  return preConfiguredSwal;
}