import { call, put, takeLeading } from 'redux-saga/effects'
import { CREATE_COMPANY } from '../../redux/companies/constants'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { CompaniesAC } from '../../redux/companies/companiesReducer'
import { companiesFetchingAPI } from '../../DAL/fetchingAPI'
import { cutText } from '../assets/cutText'
import { AuthAC } from '../../redux/auth/authReducer'

const createNewCompanySagaWorker = function* (action: ReturnType<typeof CompaniesAC.createNewCompany>) {
    yield put(ErrorsAC.setErrOnCreateNewCompany(null))
    yield put(CompaniesAC.setIsInProgressCreateCompany(true))
    try {
        const { statusCode, data, message } = yield call(companiesFetchingAPI.createCompany, action.company_name)
        if (statusCode === 200) {
            yield put(CompaniesAC.addNewCompanyInStore(data))
        } else throw new Error(message)
    } catch (err: any) {
        if (err?.response?.data?.statusCode === 403) yield put(AuthAC.removeAuthData())
        yield put(
            ErrorsAC.setErrOnCreateNewCompany(cutText(err.response?.data?.message || err.message, 120, 'Ошибка при создании новой записи')),
        )
    }
    yield put(CompaniesAC.setIsInProgressCreateCompany(false))
}

export const createNewCompanySagaWatcher = function* () {
    yield takeLeading(CREATE_COMPANY, createNewCompanySagaWorker)
}
