import { getStorageItem } from "@/utils/localStorage";

export const checkUserAuthenticated = () => {
  const userToken = getStorageItem(process.env.ACCESS_TOKEN_KEY!);

  return !!userToken;
};