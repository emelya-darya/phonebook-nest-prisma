import { EmployeeData, GetActionWInferType } from '../../commonTypes'
import {
   GET_EMPLOYEE_IN_MODAL,
   SET_CURRENT_COMPANY,
   SET_CURRENT_PAGE,
   SET_EMPLOYEE_IN_MODAL,
   SET_EMPS_LIST,
   SET_IS_LOADING_EMPLOYEE_MODAL_DATA,
   SET_IS_LOADING_EMPS_LIST,
   SET_SEARCH_REQUEST,
   SET_TOTAL_EMPS_COUNT,
} from './constants'

const initialState = {
   empsItems: [] as Array<EmployeeData>,
   pageSize: 20 as number,
   totalEmpsCount: 0 as number,
   isLoadingEmpsList: false as boolean,

   currentPage: null as number | null,
   searchRequest: null as string | null,
   currentCompany: 'all' as string,

   employeeItemInModel: null as EmployeeData | null,
   isLoadingEmployeeModalData: false as boolean,
}

type InitialEmpsStateType = typeof initialState

export const empsReducer = function (state: InitialEmpsStateType = initialState, action: AllACEmpsTypes): InitialEmpsStateType {
   switch (action.type) {
      case SET_CURRENT_PAGE:
         return { ...state, currentPage: action.currPage }

      case SET_SEARCH_REQUEST:
         return { ...state, searchRequest: action.searchRequest }

      case SET_CURRENT_COMPANY:
         return { ...state, currentCompany: action.currentCompany }

      case SET_EMPS_LIST:
         return { ...state, empsItems: action.empsList }

      case SET_TOTAL_EMPS_COUNT:
         return { ...state, totalEmpsCount: action.totalEmpsCount }

      case SET_IS_LOADING_EMPS_LIST:
         return { ...state, isLoadingEmpsList: action.isLoading }

      case SET_EMPLOYEE_IN_MODAL:
         return { ...state, employeeItemInModel: action.employeeData }

      case SET_IS_LOADING_EMPLOYEE_MODAL_DATA:
         return { ...state, isLoadingEmployeeModalData: action.isLoading }

      default:
         return state
   }
}

export type EmpsReducerType = typeof empsReducer

export const EmployeesAC = {
   setCurrentPage: (currPage: number) => ({ type: SET_CURRENT_PAGE, currPage } as const),
   setSearchRequest: (searchRequest: string) => ({ type: SET_SEARCH_REQUEST, searchRequest } as const),
   setCurrentCompany: (currentCompany: string) => ({ type: SET_CURRENT_COMPANY, currentCompany } as const),

   // getEmpsList: () => ({ type: GET_EMPS_LIST } as const),
   setEmpsList: (empsList: Array<EmployeeData>) => ({ type: SET_EMPS_LIST, empsList } as const),

   setTotalEmpsCount: (totalEmpsCount: number) => ({ type: SET_TOTAL_EMPS_COUNT, totalEmpsCount } as const),
   setIsLoadingEmpsList: (isLoading: boolean) => ({ type: SET_IS_LOADING_EMPS_LIST, isLoading } as const),

   getEmployeeForModal: (id: number) => ({ type: GET_EMPLOYEE_IN_MODAL, id } as const),
   setEmployeeForModal: (employeeData: EmployeeData) => ({ type: SET_EMPLOYEE_IN_MODAL, employeeData } as const),
   setIsLoadingEmployeeModalData: (isLoading: boolean) => ({ type: SET_IS_LOADING_EMPLOYEE_MODAL_DATA, isLoading } as const),
}

export type AllACEmpsTypes = ReturnType<GetActionWInferType<typeof EmployeesAC>>
