import { useSelector } from 'react-redux'
import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { GlobalStateType } from '../../../../store/redux/reduxStore'
import { useDispatch } from 'react-redux'
import { AdminAC } from '../../../../store/redux/admin/adminReducer'
import { Preloader } from '../../../reusableElements/preloader/Preloader'
import c from './updatePage.module.scss'
import { Button } from '../../../reusableElements/button/Button'
import { FaLongArrowAltLeft } from 'react-icons/fa'
import { UpdateCreateForm } from '../elements/updateCreateForm/UpdateCreateForm'
import { EmployeeDataToSendForUpdateOrCreate } from '../../../../store/commonTypes'
import { withAuthRedirectHOK } from '../../../reusableElements/WithAuthRedirectHOK'

const UpdatePage = withAuthRedirectHOK(() => {
   // const urlParam = typeof useParams().employeeId === 'string' ? useParams().employeeId : null
   const urlParam = useParams().employeeId
   const employeeIdFromUrl = typeof urlParam === 'undefined' ? null : isNaN(parseInt(urlParam)) ? null : parseInt(urlParam)

   const dispatch = useDispatch()

   const errOnGetInitialData = useSelector((state: GlobalStateType) => state.forErrorsData.adminErrors.errorOnGetInitialDataForUpdatePage)
   const { employeeDataForUpdate: initialData, isInProgressGetInitialData } = useSelector(
      (state: GlobalStateType) => state.forAdminData.updatePage
   )

   const isInProgressSubmit = useSelector((state: GlobalStateType) => state.forAdminData.updatePage.isInProgressUpdateEmployee)
   const errOnSubmit = useSelector((state: GlobalStateType) => state.forErrorsData.adminErrors.errOnUpdateEmployee)

   const onSubmitHandler = function (data: EmployeeDataToSendForUpdateOrCreate, id?: number) {
      if (id) dispatch(AdminAC.updateEmployee(id, data))
   }

   React.useEffect(() => {
      if (employeeIdFromUrl !== null) dispatch(AdminAC.getEmployeeDataForUpdate(employeeIdFromUrl))
   }, [])

   if (employeeIdFromUrl === null) return <Navigate to='/admin' />
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
         {isInProgressGetInitialData ? (
            <Preloader color='#2f60a5' size={150} minHeight='60vh' />
         ) : errOnGetInitialData || !initialData ? (
            <div className={c.errOnLoadEmps}>
               <span> {errOnGetInitialData}</span>
            </div>
         ) : initialData ? (
            <UpdateCreateForm
               initialData={initialData}
               isInProgressSubmit={isInProgressSubmit}
               errOnSubmit={errOnSubmit}
               successNotifyLettering='Данные обновлены'
               onSubmitHandler={onSubmitHandler}
            />
         ) : (
            <></>
         )}
      </>
   )
})

export { UpdatePage }
