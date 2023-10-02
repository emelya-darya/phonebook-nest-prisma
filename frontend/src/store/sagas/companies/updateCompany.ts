import { call, put, takeLeading } from 'redux-saga/effects'
import { ErrorsAC } from '../../redux/errors/errorsReducer'
import { companiesFetchingAPI } from '../../DAL/fetchingAPI'
import { cutText } from '../assets/cutText'
import { UPDATE_COMPANY } from '../../redux/companies/constants'
import { CompaniesAC } from '../../redux/companies/companiesReducer'
import { AuthAC } from '../../redux/auth/authReducer'

const updateCompanySagaWorker = function* (action: ReturnType<typeof CompaniesAC.updateCompany>) {
    yield put(ErrorsAC.addErrOnDeleteUpdateCompany(action.company_id, null))
    yield put(CompaniesAC.isInProgressUpdateCompany(action.company_id, true))

    try {
        // throw new Error()
        const { statusCode, data, message } = yield call(companiesFetchingAPI.updateCompany, action.company_id, action.company_name)

        if (statusCode === 200) {
            yield put(CompaniesAC.updateCompanyDataInStore(data))
        } else throw new Error(message)
    } catch (err: any) {
        if (err?.response?.data?.statusCode === 403) yield put(AuthAC.removeAuthData())
        yield put(
            ErrorsAC.addErrOnDeleteUpdateCompany(
                action.company_id,
                cutText(err.response?.data?.message || err.message, 40, 'Ошибка, данные не обновлены'),
            ),
        )
    }

    yield put(CompaniesAC.isInProgressUpdateCompany(action.company_id, false))
}

export const updateCompanySagaWatcher = function* () {
    yield takeLeading(UPDATE_COMPANY, updateCompanySagaWorker)
}
