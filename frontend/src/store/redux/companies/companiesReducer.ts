import { CompanyData, GetActionWInferType } from '../../commonTypes'
import {
   ADD_NEW_COMPANY_IN_STORE,
   CREATE_COMPANY,
   DELETE_COMPANY,
   GET_COMPANIES_LIST,
   REMOVE_COMPANY_FROM_STORE,
   SET_COMPANIES_LIST,
   SET_IS_COMPANIES_LIST_REQUESTED,
   SET_IS_IN_PROGRESS_CREATE_COMPANY,
   SET_IS_IN_PROGRESS_DELETE_COMPANY,
   SET_IS_IN_PROGRESS_UPDATE_COMPANY,
   SET_IS_LOADING_COMPANIES_LIST,
   UPDATE_COMPANY,
   UPDATE_COMPANY_DATA_IN_STORE,
} from './constants'

const initialState = {
   isCompaniesListRequested: false as boolean,
   companiesList: [] as Array<CompanyData>,
   isLoadingCompaniesList: false as boolean,

   isInProgressCreateCompany: false as boolean,

   nowInProgressDeleteCompanies: [] as Array<number>,
   nowInProgressUpdateCompanies: [] as Array<number>,
}

type InitialCompStateType = typeof initialState

export const companiesReducer = function (state: InitialCompStateType = initialState, action: AllACCompaniesTypes): InitialCompStateType {
   switch (action.type) {
      case SET_IS_COMPANIES_LIST_REQUESTED:
         return { ...state, isCompaniesListRequested: true }

      case SET_IS_LOADING_COMPANIES_LIST:
         return { ...state, isLoadingCompaniesList: action.isLoading }

      case SET_COMPANIES_LIST:
         return { ...state, companiesList: action.companiesList }

      case SET_IS_IN_PROGRESS_CREATE_COMPANY:
         return { ...state, isInProgressCreateCompany: action.isInProgress }

      case ADD_NEW_COMPANY_IN_STORE:
         return { ...state, companiesList: [...state.companiesList, action.newCompany] }

      case SET_IS_IN_PROGRESS_DELETE_COMPANY:
         if (action.isInProgress) {
            return { ...state, nowInProgressDeleteCompanies: [...state.nowInProgressDeleteCompanies, action.company_id] }
         } else {
            const newNowInProgressDeleteCompanies = [...state.nowInProgressDeleteCompanies].filter(el => el != action.company_id)
            return { ...state, nowInProgressDeleteCompanies: newNowInProgressDeleteCompanies }
         }

      case REMOVE_COMPANY_FROM_STORE:
         return { ...state, companiesList: state.companiesList.filter(company => company.company_id != action.company_id) }

      case SET_IS_IN_PROGRESS_UPDATE_COMPANY:
         if (action.isInProgress) {
            return { ...state, nowInProgressUpdateCompanies: [...state.nowInProgressUpdateCompanies, action.company_id] }
         } else {
            const newNowInProgressUpdateCompanies = [...state.nowInProgressUpdateCompanies].filter(el => el != action.company_id)
            return { ...state, nowInProgressUpdateCompanies: newNowInProgressUpdateCompanies }
         }

      case UPDATE_COMPANY_DATA_IN_STORE:
         const newCompaniesList = [...state.companiesList]
         const idxToUpdate = newCompaniesList.findIndex(comp => comp.company_id == action.companyData.company_id)
         if (idxToUpdate !== -1) newCompaniesList[idxToUpdate] = action.companyData

         return { ...state, companiesList: newCompaniesList }

      default:
         return state
   }
}

export type CompaniesReducerType = typeof companiesReducer

export const CompaniesAC = {
   getCompaniesList: () => ({ type: GET_COMPANIES_LIST } as const),
   setCompaniesList: (companiesList: Array<CompanyData>) => ({ type: SET_COMPANIES_LIST, companiesList } as const),
   setIsLoadingCompaniesList: (isLoading: boolean) => ({ type: SET_IS_LOADING_COMPANIES_LIST, isLoading } as const),
   setIsCompaniesListRequested: () => ({ type: SET_IS_COMPANIES_LIST_REQUESTED } as const),

   createNewCompany: (company_name: string) => ({ type: CREATE_COMPANY, company_name } as const),
   setIsInProgressCreateCompany: (isInProgress: boolean) => ({ type: SET_IS_IN_PROGRESS_CREATE_COMPANY, isInProgress } as const),
   addNewCompanyInStore: (newCompany: CompanyData) => ({ type: ADD_NEW_COMPANY_IN_STORE, newCompany } as const),

   deleteCompany: (company_id: number) => ({ type: DELETE_COMPANY, company_id } as const),
   isInProgressDeleteCompany: (company_id: number, isInProgress: boolean) =>
      ({ type: SET_IS_IN_PROGRESS_DELETE_COMPANY, isInProgress, company_id } as const),
   removeCompanyFromStore: (company_id: number) => ({ type: REMOVE_COMPANY_FROM_STORE, company_id } as const),

   updateCompany: (company_id: number, company_name: string) => ({ type: UPDATE_COMPANY, company_id, company_name } as const),
   isInProgressUpdateCompany: (company_id: number, isInProgress: boolean) =>
      ({ type: SET_IS_IN_PROGRESS_UPDATE_COMPANY, isInProgress, company_id } as const),
   updateCompanyDataInStore: (companyData: CompanyData) => ({ type: UPDATE_COMPANY_DATA_IN_STORE, companyData } as const),
}

export type AllACCompaniesTypes = ReturnType<GetActionWInferType<typeof CompaniesAC>>
