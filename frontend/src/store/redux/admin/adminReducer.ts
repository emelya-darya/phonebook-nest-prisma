import { EmployeeData, EmployeeDataToSendForUpdateOrCreate, GetActionWInferType } from '../../commonTypes'
import {
    ADD_EMP_TO_DELETED,
    CREATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    EXPAND_PORTION_EMPLOYEES_FOR_MODAL,
    GET_EMPLOYEE_DATA_FOR_UPDATE,
    GET_EXPAND_PORTION_EMPLOYEES_FOR_MODAL,
    GET_INITIAL_PORTION_EMPLOYEES_FOR_MODAL,
    IS_IN_PROGRESS_GET_EMP_DATA_FOR_UPDATE,
    SET_CURRENT_COMPANY_IDX_PAGE,
    SET_CURRENT_PAGE,
    SET_CURRENT_PAGE_FOR_MODAL,
    SET_EMPLOYEE_DATA_FOR_UPDATE,
    SET_EMPS_LIST,
    SET_INITIAL_EMPLOYEE_DATA_FOR_CREATE_PAGE,
    SET_INITIAL_PORTION_EMPLOYEES_FOR_MODAL,
    SET_IS_IN_PROGRESS_CREATE_EMPLOYEE,
    SET_IS_IN_PROGRESS_DELETE_EMPLOYEE,
    SET_IS_IN_PROGRESS_UPDATE_EMPLOYEE,
    SET_IS_LOADING_EMPS_LIST,
    SET_IS_LOADING_EXPAND_PORTION_FOR_MODAl,
    SET_IS_LOADING_INITIAL_PORTION_FOR_MODAl,
    SET_SEARCH_REQUEST,
    SET_SEARCH_REQUEST_FOR_MODAL,
    SET_TOTAL_COUNT_EMPLOYEES_FOR_MODAL,
    SET_TOTAL_EMPS_COUNT,
    UPDATE_EMPLOYEE,
} from './constants'

const initialState = {
    indexPage: {
        currentPage: null as number | null,
        searchRequest: null as string | null,
        currentCompany: 'all' as string,

        pageSize: 10 as number,
        portionEmployees: [] as Array<EmployeeData>,
        totalCount: 0 as number,
        isLoadingEmpsList: false as boolean,

        deletedEmployees: [] as Array<number>,
        nowInProgressDeleteEmployees: [] as Array<number>,
    },

    updatePage: {
        employeeDataForUpdate: null as EmployeeData | null,
        isInProgressGetInitialData: false as boolean,
        isInProgressUpdateEmployee: false as boolean,
    },

    createPage: {
        initialEmployeeData: {
            employee_id: -1,
            name: '',
            position: null,
            photo: null,
            inner_phone: null,
            mobile_phone: null,
            email: null,
            city: null,
            company: null,
            department: null,
            supervisor: null,
            subordinates: [],
        } as EmployeeData,

        isInProgressCreateEmployee: false as boolean,
    },

    dataForModalModifyList: {
        currentPage: null as number | null,
        searchRequest: null as string | null,
        pageSize: 15 as number,
        portionEmployees: [] as Array<EmployeeData>,
        totalCount: 0 as number,
        isLoadingInitialPortion: false as boolean,
        isLoadingExpandPortion: false as boolean,
    },
}

type InitialAdminStateType = typeof initialState

export const adminReducer = function (state: InitialAdminStateType = initialState, action: AllACAdminTypes): InitialAdminStateType {
    switch (action.type) {
        case SET_CURRENT_PAGE:
            return { ...state, indexPage: { ...state.indexPage, currentPage: action.pageNum } }

        case SET_SEARCH_REQUEST:
            return { ...state, indexPage: { ...state.indexPage, searchRequest: action.searchReq } }

        case SET_CURRENT_COMPANY_IDX_PAGE:
            return { ...state, indexPage: { ...state.indexPage, currentCompany: action.currentCompany } }

        case SET_EMPS_LIST:
            return { ...state, indexPage: { ...state.indexPage, portionEmployees: action.items } }

        case SET_TOTAL_EMPS_COUNT:
            return { ...state, indexPage: { ...state.indexPage, totalCount: action.count } }

        case SET_IS_LOADING_EMPS_LIST:
            return { ...state, indexPage: { ...state.indexPage, isLoadingEmpsList: action.isLoading } }

        case SET_IS_IN_PROGRESS_DELETE_EMPLOYEE:
            if (action.isInProgress) {
                return {
                    ...state,
                    indexPage: {
                        ...state.indexPage,
                        nowInProgressDeleteEmployees: [...state.indexPage.nowInProgressDeleteEmployees, action.id],
                    },
                }
            } else {
                const idxToDelete = state.indexPage.nowInProgressDeleteEmployees.indexOf(action.id)
                const newNowInProgressDeleteEmployees = [...state.indexPage.nowInProgressDeleteEmployees]
                newNowInProgressDeleteEmployees.splice(idxToDelete, 1)

                return {
                    ...state,
                    indexPage: {
                        ...state.indexPage,
                        nowInProgressDeleteEmployees: newNowInProgressDeleteEmployees,
                    },
                }
            }

        case ADD_EMP_TO_DELETED:
            return {
                ...state,
                indexPage: {
                    ...state.indexPage,
                    deletedEmployees: [...state.indexPage.deletedEmployees, action.id],
                },
            }

        case SET_EMPLOYEE_DATA_FOR_UPDATE:
            return { ...state, updatePage: { ...state.updatePage, employeeDataForUpdate: action.employeeData } }

        case IS_IN_PROGRESS_GET_EMP_DATA_FOR_UPDATE:
            return { ...state, updatePage: { ...state.updatePage, isInProgressGetInitialData: action.isInProgress } }

        case SET_IS_IN_PROGRESS_UPDATE_EMPLOYEE:
            return { ...state, updatePage: { ...state.updatePage, isInProgressUpdateEmployee: action.isInProgress } }

        case SET_INITIAL_EMPLOYEE_DATA_FOR_CREATE_PAGE:
            return { ...state, createPage: { ...state.createPage, initialEmployeeData: action.employeeData } }

        case SET_IS_IN_PROGRESS_CREATE_EMPLOYEE:
            return { ...state, createPage: { ...state.createPage, isInProgressCreateEmployee: action.isInProgress } }

        //! модальное окно

        case SET_CURRENT_PAGE_FOR_MODAL:
            return { ...state, dataForModalModifyList: { ...state.dataForModalModifyList, currentPage: action.pageNum } }

        case SET_SEARCH_REQUEST_FOR_MODAL:
            return { ...state, dataForModalModifyList: { ...state.dataForModalModifyList, searchRequest: action.searchReq } }

        case SET_INITIAL_PORTION_EMPLOYEES_FOR_MODAL:
            return { ...state, dataForModalModifyList: { ...state.dataForModalModifyList, portionEmployees: action.items } }

        case SET_TOTAL_COUNT_EMPLOYEES_FOR_MODAL:
            return { ...state, dataForModalModifyList: { ...state.dataForModalModifyList, totalCount: action.count } }

        case EXPAND_PORTION_EMPLOYEES_FOR_MODAL:
            return {
                ...state,
                dataForModalModifyList: {
                    ...state.dataForModalModifyList,
                    portionEmployees: [...state.dataForModalModifyList.portionEmployees, ...action.items],
                },
            }

        case SET_IS_LOADING_INITIAL_PORTION_FOR_MODAl:
            return { ...state, dataForModalModifyList: { ...state.dataForModalModifyList, isLoadingInitialPortion: action.isLoading } }

        case SET_IS_LOADING_EXPAND_PORTION_FOR_MODAl:
            return { ...state, dataForModalModifyList: { ...state.dataForModalModifyList, isLoadingExpandPortion: action.isLoading } }

        default:
            return state
    }
}

export type AdminReducerType = typeof adminReducer

export const AdminAC = {
    setPortionEmployees: (items: Array<EmployeeData>) => ({ type: SET_EMPS_LIST, items } as const),
    setTotalEmpsCount: (count: number) => ({ type: SET_TOTAL_EMPS_COUNT, count } as const),
    setIsLoadingEmpsList: (isLoading: boolean) => ({ type: SET_IS_LOADING_EMPS_LIST, isLoading } as const),
    setCurrentPage: (pageNum: number) => ({ type: SET_CURRENT_PAGE, pageNum } as const),
    setSearchRequest: (searchReq: string) => ({ type: SET_SEARCH_REQUEST, searchReq } as const),
    setCurrentCompanyIdxPage: (currentCompany: string) => ({ type: SET_CURRENT_COMPANY_IDX_PAGE, currentCompany } as const),

    deleteEmployee: (id: number) => ({ type: DELETE_EMPLOYEE, id } as const),
    isInProgressDeleteEmployee: (id: number, isInProgress: boolean) =>
        ({ type: SET_IS_IN_PROGRESS_DELETE_EMPLOYEE, isInProgress, id } as const),
    addEmployeeToDeleted: (id: number) => ({ type: ADD_EMP_TO_DELETED, id } as const),

    getEmployeeDataForUpdate: (id: number) => ({ type: GET_EMPLOYEE_DATA_FOR_UPDATE, id } as const),
    setEmployeeDataForUpdate: (employeeData: EmployeeData) => ({ type: SET_EMPLOYEE_DATA_FOR_UPDATE, employeeData } as const),
    setIsInProgressGetEmpDataForUpdate: (isInProgress: boolean) =>
        ({ type: IS_IN_PROGRESS_GET_EMP_DATA_FOR_UPDATE, isInProgress } as const),

    updateEmployee: (id: number, employeeData: EmployeeDataToSendForUpdateOrCreate) =>
        ({ type: UPDATE_EMPLOYEE, id, employeeData } as const),
    setIsInProgressUpdateEmployee: (isInProgress: boolean) => ({ type: SET_IS_IN_PROGRESS_UPDATE_EMPLOYEE, isInProgress } as const),

    createEmployee: (employeeData: EmployeeDataToSendForUpdateOrCreate) => ({ type: CREATE_EMPLOYEE, employeeData } as const),
    setInitialEmployeeDataForCreatePage: (employeeData: EmployeeData) =>
        ({ type: SET_INITIAL_EMPLOYEE_DATA_FOR_CREATE_PAGE, employeeData } as const),
    setIsInProgressCreateEmployee: (isInProgress: boolean) => ({ type: SET_IS_IN_PROGRESS_CREATE_EMPLOYEE, isInProgress } as const),

    //! модальное окно

    setCurrentPageForModal: (pageNum: number) => ({ type: SET_CURRENT_PAGE_FOR_MODAL, pageNum } as const),
    setSearchRequestForModal: (searchReq: string) => ({ type: SET_SEARCH_REQUEST_FOR_MODAL, searchReq } as const),

    getInitialEmployeesPortionForModal: () => ({ type: GET_INITIAL_PORTION_EMPLOYEES_FOR_MODAL } as const),
    setInitialEmployeesPortionForModal: (items: Array<EmployeeData>) => ({ type: SET_INITIAL_PORTION_EMPLOYEES_FOR_MODAL, items } as const),
    setTotalCountForModal: (count: number) => ({ type: SET_TOTAL_COUNT_EMPLOYEES_FOR_MODAL, count } as const),

    getExpandEmployeesPortionForModal: () => ({ type: GET_EXPAND_PORTION_EMPLOYEES_FOR_MODAL } as const),
    expandEmployeesPortionForModal: (items: Array<EmployeeData>) => ({ type: EXPAND_PORTION_EMPLOYEES_FOR_MODAL, items } as const),

    setIsLoadingInitialPortionForModal: (isLoading: boolean) => ({ type: SET_IS_LOADING_INITIAL_PORTION_FOR_MODAl, isLoading } as const),
    setIsLoadingExpandPortionForModal: (isLoading: boolean) => ({ type: SET_IS_LOADING_EXPAND_PORTION_FOR_MODAl, isLoading } as const),

    //!
}

export type AllACAdminTypes = ReturnType<GetActionWInferType<typeof AdminAC>>
