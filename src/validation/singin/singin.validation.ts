/* eslint-disable @typescript-eslint/no-explicit-any */
import { APP_ROUTES } from "@/constants/app-routes";

interface UserValidation {
  userProduct: string;
  userApprovation: boolean;
  userConfirmation: boolean;
}

export function ValidateSignIn({ userProduct, userApprovation, userConfirmation}: UserValidation, router: any) : void{

		if (!userConfirmation) { 
			throw new Error("Confirmação Pendente");
		}

	 if (userProduct === "wallet" && userApprovation === true) {
        router.push(APP_ROUTES.private.wallet.name);
      } else if (userProduct === "wallet" && userApprovation === false) {
        router.push(APP_ROUTES.private.marketplace.name);
      } else if (userProduct === "crm") {
        router.push(APP_ROUTES.private.broker.name);
      } else {
        router.push(APP_ROUTES.private.dashboard.name);
      }
}