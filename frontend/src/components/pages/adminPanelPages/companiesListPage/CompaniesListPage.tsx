import { FaLongArrowAltLeft } from 'react-icons/fa'
import { Button } from '../../../reusableElements/button/Button'
import c from './companiesListPage.module.scss'
import { useSelector } from 'react-redux'
import { GlobalStateType } from '../../../../store/redux/reduxStore'
import shortid from 'shortid'
import { RiCloseFill } from 'react-icons/ri'
import { BiEditAlt } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import React from 'react'
import { useDispatch } from 'react-redux'
import { CompaniesAC } from '../../../../store/redux/companies/companiesReducer'
import { Preloader } from '../../../reusableElements/preloader/Preloader'
import { CompanyItem } from './elements/companyItem/CompanyItem'
import { AddNewCompanyForm } from './elements/addNewCompanyForm/AddNewCompanyForm'
import { ErrorsAC } from '../../../../store/redux/errors/errorsReducer'
import { ModalOnDeleteCompany } from './elements/ModalOnDeleteCompany'
import { onCloseModal, onOpenModal } from '../../../reusableElements/forOpenModalOverflowHandler/forOpenModalOverflowHandler'

import { withAuthRedirectHOK } from '../../../reusableElements/WithAuthRedirectHOK'


export const initialDataForDeleteModal = {
   company_id: null as number | null,
   company_name: '' as string,
}

const CompaniesListPage = withAuthRedirectHOK(() => {
   const { companiesList, isLoadingCompaniesList } = useSelector((state: GlobalStateType) => state.forCompaniesData)

   const { errOnGetCompaniesList } = useSelector((state: GlobalStateType) => state.forErrorsData.adminErrors)

   const dispatch = useDispatch()

   React.useEffect(() => {
      if (!companiesList.length) dispatch(CompaniesAC.getCompaniesList())
      dispatch(ErrorsAC.setErrOnCreateNewCompany(null))
   }, [])


   const [isOpenModalOnDelete, setIsOpenModalOnDelete] = React.useState(false)
   const [dataForModalOnDelete, setDataForModalOnDelete] = React.useState(initialDataForDeleteModal)

   const onClickDeleteBtnHandler = function (data: typeof initialDataForDeleteModal) {
      onOpenModal()
      setIsOpenModalOnDelete(true)
      setDataForModalOnDelete(data)
   }

   const closeModalOnDeleteHandler = function () {
      onCloseModal()
      setIsOpenModalOnDelete(false)
   }

   return (
      <>
         <Button
            tag='link'
            linkPath='/admin'
            type='button'
            name='Назад к списку сотрудников'
            Icon={FaLongArrowAltLeft}
            isDisabled={false}
            isLoading={false}
            extraClassName={c.backBtn}
         />
         <div className={c.companiesList}>
            {isLoadingCompaniesList ? (
               <Preloader color='#2f60a5' size={100} minHeight='200px' />
            ) : errOnGetCompaniesList ? (
               <div className={c.errOnGetList}>
                  <span>{errOnGetCompaniesList}</span>
               </div>
            ) : !companiesList.length ? (
               <div className={c.noitems}>
                  <span>Список компаний пуст</span>
               </div>
            ) : (
               <>
                  {companiesList.map(comp => (
                     <CompanyItem key={shortid.generate()} {...comp} onClickDeleteBtnHandler={onClickDeleteBtnHandler}/>
                  ))}
               </>
            )}
         </div>

         {!errOnGetCompaniesList && <AddNewCompanyForm />}

         <ModalOnDeleteCompany isOpen={isOpenModalOnDelete} closeModalHandler={closeModalOnDeleteHandler} {...dataForModalOnDelete}/>
         
      </>
   )
})

export { CompaniesListPage }
