import { AiOutlineClose } from 'react-icons/ai'
import c from '../../../../../assets/commonStyles/modules/modalOnDelete.module.scss'
import { useDispatch } from 'react-redux'
import { Button } from '../../../../reusableElements/button/Button'
import { AdminAC } from '../../../../../store/redux/admin/adminReducer'
import { CompaniesAC } from '../../../../../store/redux/companies/companiesReducer'

type ModalOnDeleteCompanyPropsType = {
   isOpen: boolean
   closeModalHandler: () => void
   company_id: null | number
   company_name: string
}
const ModalOnDeleteCompany: React.FC<ModalOnDeleteCompanyPropsType> = ({ isOpen, closeModalHandler, company_id, company_name }) => {
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
               Удалить безвозвратно <span>{company_name}</span> из списка компаний?{' '}
               <div className={c.notify} style={{}}>(у сотрудников, числящихся в ней, значение поля «Компания» обнулится)</div>
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
                     if (company_id) dispatch(CompaniesAC.deleteCompany(company_id))
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

export { ModalOnDeleteCompany }
