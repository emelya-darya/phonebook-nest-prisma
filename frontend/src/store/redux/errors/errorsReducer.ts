import { GetActionWInferType } from '../../commonTypes'
import {
   ADD_ERR_ON_DELETE_EMPLOYEE,
   ADD_ERR_ON_DELETE_UPDATE_COMPANY,
   SET_ERR_ON_CREATE_COMPANY,
   SET_ERR_ON_CREATE_EMPLOYEE,
   SET_ERR_ON_EXPAND_PORTION_FOR_MODAL,
   SET_ERR_ON_GET_COMPANIES_LIST,
   SET_ERR_ON_GET_INITIAL_DATA_FOR_UPDATE_PAGE,
   SET_ERR_ON_GET_INITIAL_PORTION_FOR_MODAL,
   SET_ERR_ON_LOAD_ADMIN_EMPS_LIST,
   SET_ERR_ON_LOAD_EMPLOYEES_LIST,
   SET_ERR_ON_LOAD_EMPLOYEE_IN_MODAL,
   SET_ERR_ON_LOGIN,
   SET_ERR_ON_UPDATE_EMPLOYEE,
} from './constants'

const initialState = {
   employeesViewErrors: {
      errOnLoadEmployeesList: null as string | null,
      errOnLoadEmployeeInModal: null as string | null,
   },
   errOnLogIn: null as string | null,
   adminErrors: {
      errOnLoadEmployeesList: null as string | null,
      errorsOnDeleteEmps: [] as Array<{ id: number; message: string | null }>,
      errorOnGetInitialDataForUpdatePage: null as string | null,

      errOnGetInitialPortionForModal: null as string | null,
      errOnExpandPortionForModal: null as string | null,

      errOnUpdateEmployee: null as string | null,

      errOnCreateEmployee: null as string | null,

      errOnGetCompaniesList: null as string | null,
      errOnCreateCompany: null as string | null,

      errorsOnDeleteUpdateCompanies: [] as Array<{ company_id: number; message: string | null }>,
   },
}

type InitialErrorsStateType = typeof initialState

export const errorsReducer = function (state: InitialErrorsStateType = initialState, action: AllACErrorsTypes): InitialErrorsStateType {
   switch (action.type) {
      case SET_ERR_ON_LOAD_EMPLOYEES_LIST:
         return { ...state, employeesViewErrors: { ...state.employeesViewErrors, errOnLoadEmployeesList: action.message } }

      case SET_ERR_ON_LOAD_EMPLOYEE_IN_MODAL:
         return { ...state, employeesViewErrors: { ...state.employeesViewErrors, errOnLoadEmployeeInModal: action.message } }

      case SET_ERR_ON_LOGIN:
         return { ...state, errOnLogIn: action.message }

      case SET_ERR_ON_LOAD_ADMIN_EMPS_LIST:
         return { ...state, adminErrors: { ...state.adminErrors, errOnLoadEmployeesList: action.message } }

      case ADD_ERR_ON_DELETE_EMPLOYEE:
         const newErrorsOnDeleteEmps = [...state.adminErrors.errorsOnDeleteEmps]
         const idxPrevObjInErrors = state.adminErrors.errorsOnDeleteEmps.findIndex(item => item.id === action.id)

         if (idxPrevObjInErrors !== -1) {
            newErrorsOnDeleteEmps[idxPrevObjInErrors] = { id: action.id, message: action.message }
         } else newErrorsOnDeleteEmps.push({ id: action.id, message: action.message })

         return {
            ...state,
            adminErrors: {
               ...state.adminErrors,
               errorsOnDeleteEmps: newErrorsOnDeleteEmps,
            },
         }

      case SET_ERR_ON_GET_INITIAL_DATA_FOR_UPDATE_PAGE:
         return { ...state, adminErrors: { ...state.adminErrors, errorOnGetInitialDataForUpdatePage: action.message } }

      case SET_ERR_ON_GET_INITIAL_PORTION_FOR_MODAL:
         return { ...state, adminErrors: { ...state.adminErrors, errOnGetInitialPortionForModal: action.message } }

      case SET_ERR_ON_EXPAND_PORTION_FOR_MODAL:
         return { ...state, adminErrors: { ...state.adminErrors, errOnExpandPortionForModal: action.message } }

      case SET_ERR_ON_UPDATE_EMPLOYEE:
         return { ...state, adminErrors: { ...state.adminErrors, errOnUpdateEmployee: action.message } }

      case SET_ERR_ON_CREATE_EMPLOYEE:
         return { ...state, adminErrors: { ...state.adminErrors, errOnCreateEmployee: action.message } }

      case SET_ERR_ON_GET_COMPANIES_LIST:
         return { ...state, adminErrors: { ...state.adminErrors, errOnGetCompaniesList: action.message } }

      case SET_ERR_ON_CREATE_COMPANY:
         return { ...state, adminErrors: { ...state.adminErrors, errOnCreateCompany: action.message } }

      case ADD_ERR_ON_DELETE_UPDATE_COMPANY:
         const newErrorsOnDeleteUpdateCompanies = [...state.adminErrors.errorsOnDeleteUpdateCompanies]
         const idxPrevObjInErrorsOnDeleteUpdateCompanies = state.adminErrors.errorsOnDeleteUpdateCompanies.findIndex(
            item => item.company_id === action.company_id
         )

         if (idxPrevObjInErrorsOnDeleteUpdateCompanies !== -1) {
            newErrorsOnDeleteUpdateCompanies[idxPrevObjInErrorsOnDeleteUpdateCompanies] = {
               company_id: action.company_id,
               message: action.message,
            }
         } else newErrorsOnDeleteUpdateCompanies.push({ company_id: action.company_id, message: action.message })

         return {
            ...state,
            adminErrors: {
               ...state.adminErrors,
               errorsOnDeleteUpdateCompanies: newErrorsOnDeleteUpdateCompanies,
            },
         }

      default:
         return state
   }
}

export type ErrorsReducerType = typeof errorsReducer

export const ErrorsAC = {
   setErrOnLoadEmployeesList: (message: string | null) => ({ type: SET_ERR_ON_LOAD_EMPLOYEES_LIST, message } as const),
   setErrOnLoadEmployeeInModal: (message: string | null) => ({ type: SET_ERR_ON_LOAD_EMPLOYEE_IN_MODAL, message } as const),
   setErrOnLogin: (message: string | null) => ({ type: SET_ERR_ON_LOGIN, message } as const),

   setErrOnAdminLoadEmpsList: (message: string | null) => ({ type: SET_ERR_ON_LOAD_ADMIN_EMPS_LIST, message } as const),
   addErrOnDeleteEmployee: (id: number, message: string | null) => ({ type: ADD_ERR_ON_DELETE_EMPLOYEE, id, message } as const),
   setErrOnGetInitialDataForUpdatePage: (message: string | null) =>
      ({ type: SET_ERR_ON_GET_INITIAL_DATA_FOR_UPDATE_PAGE, message } as const),

   setErrOnGetInitialPortionForModal: (message: string | null) => ({ type: SET_ERR_ON_GET_INITIAL_PORTION_FOR_MODAL, message } as const),
   setErrOnExpandPortionForModal: (message: string | null) => ({ type: SET_ERR_ON_EXPAND_PORTION_FOR_MODAL, message } as const),

   setErrOnUpdateEmployee: (message: string | null) => ({ type: SET_ERR_ON_UPDATE_EMPLOYEE, message } as const),

   setErrOnCreateEmployee: (message: string | null) => ({ type: SET_ERR_ON_CREATE_EMPLOYEE, message } as const),

   setErrOnGetCompaniesList: (message: string | null) => ({ type: SET_ERR_ON_GET_COMPANIES_LIST, message } as const),
   setErrOnCreateNewCompany: (message: string | null) => ({ type: SET_ERR_ON_CREATE_COMPANY, message } as const),
   addErrOnDeleteUpdateCompany: (company_id: number, message: string | null) =>
      ({ type: ADD_ERR_ON_DELETE_UPDATE_COMPANY, company_id, message } as const),
}

export type AllACErrorsTypes = ReturnType<GetActionWInferType<typeof ErrorsAC>>
