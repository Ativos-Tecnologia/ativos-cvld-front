"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import UseMySwal from "@/hooks/useMySwal"
import usePassword from "@/hooks/usePassword"
import { cn } from "@/lib/utils"
import { ChangePasswordProps } from "@/types/form"
import * as React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import LabelConfirmPassword from "../InputLabels/LabelConfirmPassword"
import LabelPassword from "../InputLabels/LabelPassword"

export interface DialogProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
  onSubmit?: ((password: string) => void) | (() => void)
  onCancel?: () => void
  onOpenChange?: (open: boolean) => void;
  submitText?: string
  cancelText?: string
  className?: string
  open?: boolean
}

export function ChangePasswordDialog({
  trigger = <Button variant="outline"></Button>,
  title,
  description,
  onSubmit,
  onCancel,
  submitText = "Enviar",
  cancelText = "Cancelar",
  className,
  onOpenChange,
  open,
}: DialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const MySwal = UseMySwal();

  const onChangePassword: SubmitHandler<ChangePasswordProps> = async (data) => {
    if (data.password === data.confirm_password && passwordsMatch) {
      try {
        setIsSubmitting(true)
        await onSubmit?.(data.password)
        resetForm()
        MySwal.fire({
              icon: "success",
              title: "Tudo certo",
              text: "A Senha foi alterada com sucesso!",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              willClose: () => {
            onOpenChange?.(false);
              }
          });
      } catch (error) {
        console.error('Erro ao alterar senha:', error)
        MySwal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "Erro ao alterar senha.",
                    showConfirmButton: true,
                    confirmButtonColor: "#1A56DB"
                });
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleCancel = () => {
    onCancel?.()
    resetForm()
    reset()
  }

  const resetForm = () => {
   setIsSubmitting(false)
   reset()
  }
  

  const { register, reset, handleSubmit, watch, formState: { errors }, clearErrors } = useForm<ChangePasswordProps>();
  
  const passwordInput = watch('password');
  const confirmPasswordInput = watch('confirm_password');

  const { passwordsMatch, passwordStr, strengthColor, barWidth, passwordRequirements } = usePassword(passwordInput, confirmPasswordInput);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form className="w-full flex flex-col" onSubmit={handleSubmit(onChangePassword)}>
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

            <LabelConfirmPassword
              title="Repita a nova senha"
              errors={errors}
              register={register}
              clearErrors={clearErrors}
              field="confirm_password"
              passwordsMatch={passwordsMatch}
              htmlFor="confirm_password"
            />
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button 
              disabled={isSubmitting}
              type="submit"
          >
            {submitText}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}