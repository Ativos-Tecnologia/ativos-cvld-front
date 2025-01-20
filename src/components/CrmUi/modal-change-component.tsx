import React from "react";
import usePassword from "@/hooks/usePassword";
import { ChangePasswordProps } from "@/types/form";
import { SubmitHandler, useForm } from "react-hook-form";
import LabelPassword from "../InputLabels/LabelPassword";
import LabelConfirmPassword from "../InputLabels/LabelConfirmPassword";
import { Button } from "../ui/button";

export interface ChangeModalCompoentProps {
  onSubmit?: ((password: string) => void) | (() => void);
  onCancel?: () => void;
  setOpenModal?: (open: boolean) => void;
	openModal?: boolean;
	className?: string;
	nameUser?: string;
}

const ModalChangePasswordComponent = ({ 
	onSubmit,
	setOpenModal,
	openModal,
	className,
	nameUser,
}: ChangeModalCompoentProps) => { 

	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const onChangePassword: SubmitHandler<ChangePasswordProps> = async (data) => {
    if (data.password === data.confirm_password && passwordsMatch) {
      setIsSubmitting(true);
      try {
        await onSubmit?.(data.password);
        resetForm();
      } catch (error) {
        console.error("Erro ao alterar senha:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    clearErrors();
    resetForm();
    setOpenModal?.(false);
  };

  const resetForm = () => {
    reset();
    setIsSubmitting(false);
  };

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<ChangePasswordProps>();

  const passwordInput = watch("password");
  const confirmPasswordInput = watch("confirm_password");

  const {
    passwordsMatch,
    passwordStr,
    strengthColor,
    barWidth,
    passwordRequirements,
  } = usePassword(passwordInput, confirmPasswordInput);

	return (
    <div
      className={`${openModal ? "block" : "hidden"} fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`}
    >
      <form
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
        onSubmit={handleSubmit(onChangePassword)}
      >
        <header className="flex items-center justify-between">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h2 className="text-lg font-bold">Alterar Senha</h2>
            <p className="text-sm text-muted-foreground">
              Deseja redefinir a senha do usuário: <b>{nameUser}</b> ?
            </p>
          </div>

          <div className="flex -mt-12 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              type="button"
              className="cursor-point"
              onClick={handleCancel}
            >
              X
            </button>
          </div>
        </header>
        <main className="mt-4 gap-2">
          <LabelPassword
            title="Nova senha"
            errors={errors}
            register={register}
            clearErrors={clearErrors}
            field="password"
            passwordInput={passwordInput}
            passwordStr={passwordStr}
            strengthColor={strengthColor}
            barWidth={barWidth}
            passwordRequirements={passwordRequirements}
            htmlFor="password"
          />
          <div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <LabelConfirmPassword
            title="Repita a nova senha"
            errors={errors}
            register={register}
            clearErrors={clearErrors}
            field="confirm_password"
            passwordsMatch={passwordsMatch}
            htmlFor="confirm_password"
          />
        </main>
        <footer className="flex w-full justify-end gap-5 sm:text-left">
          <Button
            variant="ghost"
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Alterar senha
          </Button>
        </footer>
      </form>
    </div>
  );
};

export default ModalChangePasswordComponent;