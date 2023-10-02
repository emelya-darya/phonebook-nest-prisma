import { BiEditAlt } from 'react-icons/bi'
import { CompanyData } from '../../../../../../store/commonTypes'
import { Button } from '../../../../../reusableElements/button/Button'
import c from './companyItem.module.scss'
import { RiCloseFill } from 'react-icons/ri'
import { initialDataForDeleteModal } from '../../CompaniesListPage'
import { GlobalStateType } from '../../../../../../store/redux/reduxStore'
import { useSelector } from 'react-redux'
import React from 'react'
import { TfiSave } from 'react-icons/tfi'
import { CompaniesAC } from '../../../../../../store/redux/companies/companiesReducer'
import { useDispatch } from 'react-redux'

type CompanyItemPropsType = CompanyData & {
   onClickDeleteBtnHandler: (data: typeof initialDataForDeleteModal) => void
}

const CompanyItem: React.FC<CompanyItemPropsType> = ({ company_id, company_name, onClickDeleteBtnHandler }) => {
   const { nowInProgressDeleteCompanies, nowInProgressUpdateCompanies } = useSelector((state: GlobalStateType) => state.forCompaniesData)
   const isInProgressDeleting = nowInProgressDeleteCompanies.includes(company_id)
   const isInProgressUpdating = nowInProgressUpdateCompanies.includes(company_id)

   const errorsOnDeleteUpadeteCompanies = useSelector(
      (state: GlobalStateType) => state.forErrorsData.adminErrors.errorsOnDeleteUpdateCompanies
   )
   const requiredErrObj = errorsOnDeleteUpadeteCompanies.find(item => item.company_id === company_id)

   const [isEditMode, setIsEditMode] = React.useState(false)

   const [inputNameValue, setInputNameValue] = React.useState(company_name)

   const dispatch = useDispatch()
   const handleSubmitNewCompanyName = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (inputNameValue.trim() !== company_name) dispatch(CompaniesAC.updateCompany(company_id, inputNameValue.trim()))
      setIsEditMode(false)
   }

   return (
      <div className={c.companyItem}>
         {isEditMode ? (
            <form className={c.updateForm} onSubmit={handleSubmitNewCompanyName}>
               <div className={`${c.inputGroup}`}>
                  <input
                     type='text'
                     placeholder='Название компании'
                     autoFocus={true}
                     value={inputNameValue}
                     onInput={e => {
                        setInputNameValue(e.currentTarget.value)
                     }}
                  />
               </div>

               <Button
                  type='submit'
                  name={null}
                  isLoading={isInProgressUpdating}
                  isDisabled={!inputNameValue.trim().length}
                  Icon={TfiSave}
                  extraClassName={c.saveNewNameBtn}
               />
            </form>
         ) : (
            <div className={c.name}>
               <span>{company_name}</span>
            </div>
         )}

         <div className={c.buttonsWr}>
            {!isEditMode && (
               <Button
                  title='Редактировать'
                  type='button'
                  name={null}
                  Icon={BiEditAlt}
                  isDisabled={isInProgressUpdating}
                  extraClassName={c.editBtn}
                  isLoading={isInProgressUpdating}
                  onClickHandler={() => {
                     setIsEditMode(true)
                  }}
               />
            )}
            <Button
               title='Удалить'
               type='button'
               name={null}
               Icon={RiCloseFill}
               isDisabled={false}
               extraClassName={c.deleteBtn}
               isLoading={isInProgressDeleting}
               preloaderClr='#fff'
               onClickHandler={() => {
                  onClickDeleteBtnHandler({ company_id, company_name })
               }}
            />
         </div>
         <div className={c.errOnDeleteUpdate}>{requiredErrObj?.message || ''}</div>
      </div>
   )
}

export { CompanyItem }
