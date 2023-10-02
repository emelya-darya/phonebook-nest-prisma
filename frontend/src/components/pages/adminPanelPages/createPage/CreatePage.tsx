import { FaLongArrowAltLeft } from 'react-icons/fa'
import { Button } from '../../../reusableElements/button/Button'
import c from './createPage.module.scss'
import { UpdateCreateForm } from '../elements/updateCreateForm/UpdateCreateForm'
import { EmployeeDataToSendForUpdateOrCreate } from '../../../../store/commonTypes'
import { useSelector } from 'react-redux'
import { GlobalStateType } from '../../../../store/redux/reduxStore'
import { useDispatch } from 'react-redux'
import { AdminAC } from '../../../../store/redux/admin/adminReducer'
import React from 'react'
import { withAuthRedirectHOK } from '../../../reusableElements/WithAuthRedirectHOK'

const CreatePage = withAuthRedirectHOK(() => {
   const { initialEmployeeData, isInProgressCreateEmployee } = useSelector((state: GlobalStateType) => state.forAdminData.createPage)

   const errOnSubmit = useSelector((state: GlobalStateType) => state.forErrorsData.adminErrors.errOnCreateEmployee)

   const dispatch = useDispatch()
   const onSubmitHandler = function (data: EmployeeDataToSendForUpdateOrCreate) {
      dispatch(AdminAC.createEmployee(data))
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
         <UpdateCreateForm
            initialData={initialEmployeeData}
            isInProgressSubmit={isInProgressCreateEmployee}
            successNotifyLettering='Новая запись создана'
            errOnSubmit={errOnSubmit}
            onSubmitHandler={onSubmitHandler}
         />
      </>
   )
})

export { CreatePage }
