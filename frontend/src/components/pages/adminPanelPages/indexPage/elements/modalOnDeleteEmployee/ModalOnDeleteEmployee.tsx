import { AiOutlineClose } from 'react-icons/ai'
import c from '../../../../../../assets/commonStyles/modules/modalOnDelete.module.scss'
import { Button } from '../../../../../reusableElements/button/Button'
import { useDispatch } from 'react-redux'
import { AdminAC } from '../../../../../../store/redux/admin/adminReducer'

type ModalOnDeletePropsType = {
   isOpen: boolean
   closeModalHandler: () => void
   id: null | number
   name: string
}
const ModalOnDelete: React.FC<ModalOnDeletePropsType> = ({ isOpen, closeModalHandler, id, name }) => {
   const handleCloseModalWrapper = function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      //@ts-ignore
      const classListArr = Array.from(e?.target?.classList || [])
      if (classListArr.includes('close') && e.button === 0) closeModalHandler()
   }

   const dispatch = useDispatch()

   return (
      <div className={`${c.modalOnDelete}  ${isOpen ? c.visible : ''} close`} onClick={handleCloseModalWrapper}>
         <div className={c.modalContent}>
            <div className={`${c.closeBtn} close`} onClick={closeModalHandler}>
               <AiOutlineClose />
               <div className={`${c.closeBtnMask} close`}></div>
            </div>
            <div className={c.lett}>
               Удалить безвозвратно <span>{name}</span> из телефонного справочника?
            </div>
            <div className={c.btns}>
               <Button
                  type='button'
                  name='Да'
                  Icon={null}
                  isDisabled={false}
                  extraClassName={c.yesBtn}
                  isLoading={false}
                  preloaderClr='#fff'
                  onClickHandler={() => {
                     if (id) dispatch(AdminAC.deleteEmployee(id))
                     closeModalHandler()
                     //   onClickDeleteBtnHandler({ id, name })
                  }}
               />

               <Button
                  type='button'
                  name='Нет'
                  Icon={null}
                  isDisabled={false}
                  extraClassName={c.noBtn}
                  isLoading={false}
                  preloaderClr='#fff'
                  onClickHandler={() => {
                     closeModalHandler()
                     //   onClickDeleteBtnHandler({ id, name })
                  }}
               />
            </div>
         </div>
      </div>
   )
}

export { ModalOnDelete }
