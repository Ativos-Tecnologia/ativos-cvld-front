"use client"

import React, { useContext, useRef, useState, type SyntheticEvent } from "react"

import ReactCrop, {
  type Crop,
  type PixelCrop
} from "react-image-crop"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"


import { FileWithPreview } from "@/app/profile/page"
import { UserInfoAPIContext } from "@/context/UserInfoContext"
import { centerAspectCrop } from "@/functions/cut-crop"
import UseMySwal from "@/hooks/useMySwal"
import { CropIcon, Trash2Icon } from "lucide-react"
import { BiPencil } from "react-icons/bi"
import "react-image-crop/dist/ReactCrop.css"

interface ImageCropperProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFile: FileWithPreview | null
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>
}

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
}: ImageCropperProps) {
  const aspect = 1

  const imgRef = useRef<HTMLImageElement | null>(null)

  const [crop, setCrop] = useState<Crop>()
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("")
  const [croppedImage, setCroppedImage] = useState<string>("")
   const {data, updateProfilePicture } = useContext(UserInfoAPIContext);

  /**
   * @description Atualiza o crop da imagem de acordo com o aspecto da imagem.
   * @param e 
   * @returns {void}
   */
  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }
  /**
   * @description Atualiza a imagem cortada e exibe a imagem cortada no componente.
   * @param crop 
   * @returns {void}
   */
  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop)
      setCroppedImageUrl(croppedImageUrl)
    }
  }
  /**
   * @description Corta a imagem de acordo com o crop e retorna a imagem cortada antes de ser enviada para o back-end.
   * @param image 
   * @param crop 
   * @returns {string}
   */
  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      )
    }

    return canvas.toDataURL("image/png", 1.0)
  }
  /**
   * @description Atualiza a foto de perfil do usuário
   * @async
   * @function onCrop
   * @returns {Promise<void>}
   */
  async function onCrop() {
    try {
      // Verificar o tipo do arquivo, permitindo apenas PNG, JPG e JPEG.
      const fileType = selectedFile?.type;
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      
      if (!fileType || !allowedTypes.includes(fileType)) {
        UseMySwal().fire({
                  title: "Formato de imagem não suportado. Use apenas PNG, JPG ou JPEG.",
                  icon: "error",
                });
        return;
      }

      // Converte base64 para blob para que seja aceito no back-end, pois antes estava sendo enviado como base64 e gerava erro.
      const base64Data = croppedImageUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Criar arquivo com nome do usuárrio e data atual para diferenciar de outros arquivos.
      const fileName = `profile_${data.id}_${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Preparar e enviar FormData que está dentro do contexto.
      const formData = new FormData();
      formData.append('profile_picture', file);

      await updateProfilePicture(`${data.id}`, formData);
      setDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
				<label
				htmlFor="profile"
				className="flex cursor-pointer items-center "
					>
				<BiPencil className="mr-2 h-4 w-4" />
				Mudar foto
			</label>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0">
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={aspect}
            className="w-full"
          >
            <Avatar className="size-full rounded-none">
              <AvatarImage
                ref={imgRef}
                className="size-full rounded-none "
                alt="Image Cropper Shell"
                src={selectedFile?.preview}
                onLoad={onImageLoad}
              />
              <AvatarFallback className="size-full min-h-[460px] rounded-none">
                Carregando...
              </AvatarFallback>
            </Avatar>
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-center ">
          <DialogClose asChild>
            <Button
              size={"sm"}
              type="reset"
              className="w-fit"
              variant={"outline"}
              onClick={() => {
                setSelectedFile(null)
              }}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" size={"sm"} className="w-fit" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Trocar Foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


