import { GetActionWInferType, SuccessLoginCheckAuthResponseDataType } from '../../commonTypes'
import {
    CHECK_AUTH,
    REMOVE_AUTH_DATA_ON_ERR_AUTH,
    SET_AUTH_DATA_ON_SUCCESS_AUTH,
    SET_IS_AUTH_STATUS_CHECKED,
    SET_IS_IN_PROGRESS_CHECK_AUTH,
    SET_IS_IN_PROGRESS_LOG_IN,
    TRY_LOGIN,
} from './constants'

const initialState = {
    isAuthStatusChecked: false as boolean,
    isAuth: false as boolean,
    id: null as number | null,
    login: null as string | null,
    acсessToken: null as string | null,

    isInProgressCheckAuth: false as boolean,
    isInProgressLogIn: false as boolean,
}

type InitialAuthStateType = typeof initialState

export const authReducer = function (state: InitialAuthStateType = initialState, action: AllACAuthTypes): InitialAuthStateType {
    switch (action.type) {
        case SET_AUTH_DATA_ON_SUCCESS_AUTH:
            return { ...state, ...action.authData, isAuth: true }

        case REMOVE_AUTH_DATA_ON_ERR_AUTH:
            return { ...state, isAuth: false, id: null, login: null, acсessToken: null }

        case SET_IS_IN_PROGRESS_LOG_IN:
            return { ...state, isInProgressLogIn: action.isInProgress }

        case SET_IS_IN_PROGRESS_CHECK_AUTH:
            return { ...state, isInProgressCheckAuth: action.isInProgress }

        case SET_IS_AUTH_STATUS_CHECKED:
            return { ...state, isAuthStatusChecked: true }

        default:
            return state
    }
}

export type AuthReducerType = typeof authReducer

export const AuthAC = {
    checkAuth: () => ({ type: CHECK_AUTH } as const),
    tryLogin: (dataForAuth: { login: string; password: string }) => ({ type: TRY_LOGIN, dataForAuth } as const),
    setAuthDataOnSuccessAuth: (authData: SuccessLoginCheckAuthResponseDataType) =>
        ({ type: SET_AUTH_DATA_ON_SUCCESS_AUTH, authData } as const),
    setIsInProgressCheckAuth: (isInProgress: boolean) => ({ type: SET_IS_IN_PROGRESS_CHECK_AUTH, isInProgress } as const),
    setIsInProgressLogin: (isInProgress: boolean) => ({ type: SET_IS_IN_PROGRESS_LOG_IN, isInProgress } as const),

    setIsAuthStatusChecked: () => ({ type: SET_IS_AUTH_STATUS_CHECKED } as const),

    removeAuthData: () => ({ type: REMOVE_AUTH_DATA_ON_ERR_AUTH } as const),
}

export type AllACAuthTypes = ReturnType<GetActionWInferType<typeof AuthAC>>
