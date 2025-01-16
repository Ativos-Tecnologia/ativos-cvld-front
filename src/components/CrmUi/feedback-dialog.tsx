"use client"

import * as React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface FeedbackDialogProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
  reactions?: string[]
  onSubmit?: (data: { reaction: string | null; feedback: string }) => Promise<void> | void
  onCancel?: () => void
  submitText?: string
  cancelText?: string
  textareaPlaceholder?: string
  className?: string
}

export function FeedbackDialog({
  trigger = <Button variant="outline">Deixe um feedback</Button>,
  title = "Deixe um feedback",
  description = "Sua opinião é muito importante para nós. Por favor, deixe um feedback sobre sua experiência.",
  reactions = ["🙂", "😐", "☹️"],
  onSubmit,
  onCancel,
  submitText = "Enviar",
  cancelText = "Cancelar",
  textareaPlaceholder = "Deixe seu feedback aqui...",
  className,
}: FeedbackDialogProps) {
  const [selectedReaction, setSelectedReaction] = React.useState<number | null>(null)
  const [feedback, setFeedback] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await onSubmit?.({
        reaction: selectedReaction !== null ? reactions[selectedReaction] : null,
        feedback
      })
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao enviar o feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedReaction(null)
    setFeedback("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={textareaPlaceholder}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex gap-2">
            {reactions.map((reaction, index) => (
              <Button
                key={reaction}
                variant="outline"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full text-lg",
                  selectedReaction === index && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedReaction(index)}
              >
                {reaction}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

