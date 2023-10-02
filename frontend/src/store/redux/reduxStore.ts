import { combineReducers, legacy_createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '../sagas'

import { EmpsReducerType, empsReducer } from './employees/employeesReducer'
import { ErrorsReducerType, errorsReducer } from './errors/errorsReducer'
import { AuthReducerType, authReducer } from './auth/authReducer'
import { AdminReducerType, adminReducer } from './admin/adminReducer'
import { CompaniesReducerType, companiesReducer } from './companies/companiesReducer'

const rootReducer = combineReducers({
   forEmpsData: empsReducer as EmpsReducerType,
   forErrorsData: errorsReducer as ErrorsReducerType,
   forAuthData: authReducer as AuthReducerType,
   forAdminData: adminReducer as AdminReducerType,
   forCompaniesData: companiesReducer as CompaniesReducerType,
})

// type RootReducerType = typeof rootReducer
export type GlobalStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

const sagaMiddleware = createSagaMiddleware()

// const store = legacy_createStore(rootReducer, applyMiddleware(sagaMiddleware))
const store = legacy_createStore(rootReducer, applyMiddleware(sagaMiddleware))

//* run sagaMiddleware может быть вызван только после вызова applyMiddleware
sagaMiddleware.run(rootSaga)

//@ts-ignore
window.store = store

export { store }
