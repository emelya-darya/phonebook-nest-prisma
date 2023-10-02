import { call, put, select, throttle } from 'redux-saga/effects'
import { SET_CURRENT_COMPANY, SET_CURRENT_PAGE, SET_SEARCH_REQUEST } from '../../redux/employees/constants'
import { GlobalStateType } from '../../redux/reduxStore'
import { EmployeesAC } from '../../redux/employees/employeesReducer'
import { employeesFetchingAPI } from '../../DAL/fetchingAPI'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { cutText } from '../assets/cutText'

const handleGetEmployees = function* (currentPage: number, pageSize: number, searchRequest: string, currentCompany: string) {
   yield put(ErrorsAC.setErrOnLoadEmployeesList(null))
   yield put(EmployeesAC.setIsLoadingEmpsList(true))

   try {
      const { statusCode, data, message } = yield call(employeesFetchingAPI.getEmployeesPortion, currentPage, pageSize, searchRequest, currentCompany)

      if (statusCode === 200) {
         yield put(EmployeesAC.setEmpsList(data.items))
         yield put(EmployeesAC.setTotalEmpsCount(data.totalCount))
      } else throw new Error(message)
   } catch (err: any) {
      yield put(
         ErrorsAC.setErrOnLoadEmployeesList(
            cutText(err.response?.data?.message || err.message, 300, 'Ошибка при загрузке списка сотрудников')
         )
      )
   }
   yield put(EmployeesAC.setIsLoadingEmpsList(false))
}
const sagaWorkerGetEmployees = function* () {
   const { currentPage, pageSize, searchRequest, currentCompany } = yield select((state: GlobalStateType) => state.forEmpsData)

   if (searchRequest !== null && currentPage !== null) {
      yield handleGetEmployees(currentPage, pageSize, searchRequest, currentCompany)
   }
}

export const sagaWatcherGetEmployees = function* () {
   yield throttle(1500, SET_CURRENT_PAGE, sagaWorkerGetEmployees)
   yield throttle(1500, SET_SEARCH_REQUEST, sagaWorkerGetEmployees)
   yield throttle(1500, SET_CURRENT_COMPANY, sagaWorkerGetEmployees)
}
