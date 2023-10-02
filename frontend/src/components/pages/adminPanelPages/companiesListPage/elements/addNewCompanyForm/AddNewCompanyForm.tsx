import { TfiSave } from 'react-icons/tfi'
import { Button } from '../../../../../reusableElements/button/Button'
import c from './addNewCompanyForm.module.scss'
import React from 'react'
import { useDispatch } from 'react-redux'
import { CompaniesAC } from '../../../../../../store/redux/companies/companiesReducer'
import { useSelector } from 'react-redux'
import { GlobalStateType } from '../../../../../../store/redux/reduxStore'
import { AiOutlinePlus } from 'react-icons/ai'

const AddNewCompanyForm = () => {
   const dispatch = useDispatch()
   const {isInProgressCreateCompany, companiesList} = useSelector((state: GlobalStateType) => state.forCompaniesData)
   const errOnCreateCompany = useSelector((state: GlobalStateType) => state.forErrorsData.adminErrors.errOnCreateCompany)

   const [newCompanyInputValue, setNewCompanyInputValue] = React.useState('')

   const [isEditMode, setEditMode] = React.useState(false)

   const handleSubmitNewCompany = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      dispatch(CompaniesAC.createNewCompany(newCompanyInputValue.trim()))
   }

   React.useEffect(() => {
      if (!errOnCreateCompany) {
         setNewCompanyInputValue('')
         setEditMode(false)
      }
   }, [companiesList])

   return (
      <>
         {isEditMode ? (
            <form className={`${c.createNewForm} ${c.companyItem}`} onSubmit={handleSubmitNewCompany}>
               <div className={`${c.inputGroup}`}>
                  <input
                     type='text'
                     placeholder='Название компании'
                     autoFocus={true}
                     value={newCompanyInputValue}
                     onInput={e => {
                        setNewCompanyInputValue(e.currentTarget.value)
                     }}
                  />
               </div>
               <Button
                  type='submit'
                  name='Сохранить'
                  isDisabled={!newCompanyInputValue.trim().length}
                  isLoading={isInProgressCreateCompany}
                  Icon={TfiSave}
                  extraClassName={c.saveNewBtn}
               />
            </form>
         ) : (
            <Button
               onClickHandler={() => {
                  setEditMode(true)
               }}
               type='button'
               name='Добавить компанию'
               Icon={AiOutlinePlus}
               isDisabled={false}
               isLoading={false}
               extraClassName={c.createNewBtn}
            />
         )}
         {errOnCreateCompany && <p className={c.errOnAddCompany}>{errOnCreateCompany}</p>}
      </>
   )
}

export { AddNewCompanyForm }
