import { AiOutlineClose } from 'react-icons/ai'
import c from './cropAvatarModal.module.scss'
import React, { SetStateAction } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import { centerAspectCrop } from './assets/centerAspectCrop'
import { useDebounceEffect } from './assets/useDebounceEffect'
import { canvasPreview } from './assets/canvasPreview'
import 'react-image-crop/src/ReactCrop.scss'
import { Button } from '../../../../../reusableElements/button/Button'
import { RxUpdate } from 'react-icons/rx'

type CropAvatarModalPropsType = {
   isOpen: boolean
   handleCloseModal: () => void
   imgSrc: string
   setImgSrc: React.Dispatch<SetStateAction<string>>
   crop: Crop | undefined
   setCrop: React.Dispatch<SetStateAction<Crop | undefined>>
   onChangePhotoValueHandler: (newValue: string | null | Blob) => void
   fileInputRef: React.RefObject<HTMLInputElement>
}

const aspectRatio = 1 / 1

const CropAvatarModal: React.FC<CropAvatarModalPropsType> = ({ isOpen, handleCloseModal, imgSrc, crop, setCrop, onChangePhotoValueHandler, fileInputRef }) => {
   const previewCanvasRefBig = React.useRef<HTMLCanvasElement>(null)
   const previewCanvasRefSmall = React.useRef<HTMLCanvasElement>(null)
   const imgRef = React.useRef<HTMLImageElement>(null)
   const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()

   // функция, срабатывающая, кода в image для модалки подгрузилась
   function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspectRatio))
   }

   useDebounceEffect(
      async () => {
         if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRefBig.current && previewCanvasRefSmall.current) {
            canvasPreview(imgRef.current, previewCanvasRefBig.current, completedCrop, 1, 0)
            canvasPreview(imgRef.current, previewCanvasRefSmall.current, completedCrop, 1, 0)
         }
      },
      100,
      [completedCrop]
   )

   const onUpdatePhoto = function () {
      // if (!previewCanvasRefBig.current) throw new Error('Crop canvas does not exist')
      if (previewCanvasRefBig.current) {
         previewCanvasRefBig.current.toBlob(blob => {
            // if (!blob) throw new Error('Failed to create blob')
            if (blob) onChangePhotoValueHandler(blob)
            handleCloseModal()
            if (fileInputRef.current) fileInputRef.current.value = ''
         })
      }
   }

   const handleCloseWrapper = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      //@ts-ignore
      const classListArr = Array.from(e?.target?.classList || [])
      if (classListArr.includes('close') && e.button === 0) handleCloseModal()
   }

   return (
      <div className={`${c.cropAvatarModal} ${isOpen ? c.visible : ''} close`} onClick={handleCloseWrapper}>
         <div className={c.modalContent}>
            <p className={c.title}>Обрезка изображения (выберите область)</p>
            <div className={`${c.closeBtn} close`} onClick={handleCloseModal}>
               <AiOutlineClose />
               <div className={`${c.closeBtnMask} close`}></div>
            </div>
            {!!imgSrc && (
               <div className={c.cropWr}>
                  <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={c => setCompletedCrop(c)} aspect={aspectRatio} className={c.cropBlock}>
                     <img ref={imgRef} alt='Crop me' src={imgSrc} onLoad={onImageLoad} />
                  </ReactCrop>
               </div>
            )}

            {!!completedCrop && (
               <>
                  <p className={c.lett}>Предпросмотр:</p>
                  <div className={c.thumbs}>
                     <canvas className={c.canvasBig} ref={previewCanvasRefBig} />
                     <canvas className={c.canvasSmall} ref={previewCanvasRefSmall} />
                  </div>
                  <Button type='button' name='Обновить' extraClassName={c.updatePhotoBtn} isDisabled={false} isLoading={false} Icon={RxUpdate} onClickHandler={onUpdatePhoto} />
               </>
            )}
         </div>
      </div>
   )
}

export { CropAvatarModal }
