import statusOficio from "@/enums/statusOficio.enum";
import tipoOficio from "@/enums/tipoOficio.enum";
import tribunalOficio from "@/enums/tribunalOficio.enum";

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";
export const PROD_API_URL = "https://ativos-cvld-prod-32c6589080c0.herokuapp.com/";
export const DEV_API_URL = "https://dev-celler-app-70840ebdf4b7.herokuapp.com/";
export const LOCAL_DEV_API_URL = "http://127.0.0.1:8000/";
export const PRUSCIAN_BLUE = '#12263A'

export const ENUM_OFICIOS_LIST = Object.values(statusOficio);
export const ENUM_TIPO_OFICIOS_LIST = Object.values(tipoOficio);
export const ENUM_TRIBUNAIS_LIST = Object.values(tribunalOficio);