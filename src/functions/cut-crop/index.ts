import { centerCrop, Crop, makeAspectCrop } from "react-image-crop";

/**
 * @description - Função para cortar a imagem
 * @param mediaWidth - Medida de largura do corte da imagem em porcentagem
 * @param mediaHeight - Medida de Altura do corte da imagem em porcentagem
 * @param aspect - Aspecto da imagem
 * @returns - Retorna o corte centralizado
 */
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}