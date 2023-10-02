import React from 'react'
import { Crop } from 'react-image-crop'
import { RiCloseFill } from 'react-icons/ri'
import { TbCameraUp } from 'react-icons/tb'
import { getPhotoPath } from '../../../../../reusableElements/getPhotoPath'
import { Button } from '../../../../../reusableElements/button/Button'
import { CropAvatarModal } from '../cropAvatarModal/CropAvatarModal'
import { onCloseModal, onOpenModal } from '../../../../../reusableElements/forOpenModalOverflowHandler/forOpenModalOverflowHandler'
import c from './avatarBlock.module.scss'

type AvatarBlockPropsType = {
    photoValue: string | null | Blob
    onChangePhotoValueHandler: (newValue: string | null | Blob) => void
}
const AvatarBlock: React.FC<AvatarBlockPropsType> = ({ photoValue, onChangePhotoValueHandler }) => {
    const [imgSrc, setImgSrc] = React.useState('')
    const [crop, setCrop] = React.useState<Crop>()

    const [isOpenModalCrop, setIsOpenModalCrop] = React.useState(false)

    const handleOpenModal = function () {
        setIsOpenModalCrop(true)
        onOpenModal()
    }

    const handleCloseModal = function () {
        setIsOpenModalCrop(false)
        onCloseModal()
    }

    const onUploadPhotoFile = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
            reader.readAsDataURL(e.target.files[0])
            handleOpenModal()
        }
    }

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    return (
        <>
            <div className={c.photoWr}>
                <img src={getPhotoPath(photoValue)} alt='user' />
                {photoValue && (
                    <Button
                        type='button'
                        name={null}
                        Icon={RiCloseFill}
                        extraClassName={c.deletePhotoBtn}
                        isDisabled={false}
                        isLoading={false}
                        title='Удалить фото'
                        onClickHandler={() => {
                            onChangePhotoValueHandler(null)
                        }}
                    />
                )}
                {/* <Button type='button' name={null} Icon={RiImageAddFill} extraClassName={c.changePhotoBtn} isDisabled={false} isLoading={false} title='Изменить фото' /> */}

                <label className={c.changePhotoBtn}>
                    <TbCameraUp />
                    <input hidden accept='image/jpeg,image/png,image/webp' type='file' onInput={onUploadPhotoFile} ref={fileInputRef} />
                </label>
            </div>
            <CropAvatarModal
                isOpen={isOpenModalCrop}
                handleCloseModal={handleCloseModal}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                crop={crop}
                setCrop={setCrop}
                onChangePhotoValueHandler={onChangePhotoValueHandler}
                fileInputRef={fileInputRef}
            />
        </>
    )
}
export { AvatarBlock }
