import { APP_ROUTES } from "@/constants/app-routes";

export const checkIsPublicRoute = (pathname: string): boolean => {
  const publicRoutes = Object.values(APP_ROUTES.public).map((route) => route.name);

  return publicRoutes.includes(pathname);
};