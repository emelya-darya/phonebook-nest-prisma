import { EmployeesAC } from './../../redux/employees/employeesReducer'
import { call, put, select, takeLeading } from 'redux-saga/effects'
import { GET_EMPLOYEE_IN_MODAL } from '../../redux/employees/constants'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { cutText } from '../assets/cutText'
import { GlobalStateType } from '../../redux/reduxStore'
import { EmployeeData } from '../../commonTypes'
import { employeesFetchingAPI } from '../../DAL/fetchingAPI'

const sagaWorkerOnOpenEmployeeModal = function* (action: ReturnType<typeof EmployeesAC.getEmployeeForModal>) {
   yield put(ErrorsAC.setErrOnLoadEmployeeInModal(null))
   yield put(EmployeesAC.setIsLoadingEmployeeModalData(true))

   try {
      const listOfAlreadyLoadedEmployees: Array<EmployeeData> = yield select((state: GlobalStateType) => state.forEmpsData.empsItems)

      const desiredEmployee = listOfAlreadyLoadedEmployees.find(emp => emp.employee_id === action.id)

      if (desiredEmployee) yield put(EmployeesAC.setEmployeeForModal(desiredEmployee))
      else {
         const { statusCode, data, message } = yield call(employeesFetchingAPI.getOneEmp, action.id)

         if (statusCode === 200) {
            yield put(EmployeesAC.setEmployeeForModal(data))
         } else throw new Error(message)
      }
   } catch (err: any) {
      yield put(ErrorsAC.setErrOnLoadEmployeeInModal(cutText(err.response?.data?.message || err.message, 200, 'Ошибка при загрузке информации о сотруднике')))
   }
   yield put(EmployeesAC.setIsLoadingEmployeeModalData(false))
}

export const sagaWatcherOnOpenEmployeeModal = function* () {
   yield takeLeading(GET_EMPLOYEE_IN_MODAL, sagaWorkerOnOpenEmployeeModal)
}
