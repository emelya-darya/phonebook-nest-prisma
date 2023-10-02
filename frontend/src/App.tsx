import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { EmployeesList } from './components/pages/mainPage/EmployeesList'
import { LoginPage } from './components/pages/loginPage/LoginPage'
import { IndexAdminPage } from './components/pages/adminPanelPages/indexPage/IndexAdminPage'
import { AdminLayout } from './components/pages/adminPanelPages/layout/AdminLayout'
import { UpdatePage } from './components/pages/adminPanelPages/updatePage/UpdatePage'
import { GlobalStateType } from './store/redux/reduxStore'
import { AuthAC } from './store/redux/auth/authReducer'
import { Preloader } from './components/reusableElements/preloader/Preloader'
import { CreatePage } from './components/pages/adminPanelPages/createPage/CreatePage'
import { CompaniesAC } from './store/redux/companies/companiesReducer'
import { CompaniesListPage } from './components/pages/adminPanelPages/companiesListPage/CompaniesListPage'

function App() {
    const { isAuth, isAuthStatusChecked } = useSelector((state: GlobalStateType) => state.forAuthData)
    const isCompaniesListRequested = useSelector((state: GlobalStateType) => state.forCompaniesData.isCompaniesListRequested)

    const dispatch = useDispatch()
    React.useEffect(() => {
        if (!isAuth) dispatch(AuthAC.checkAuth())
        dispatch(CompaniesAC.getCompaniesList())
    }, [])

    if (isAuthStatusChecked && isCompaniesListRequested) {
        return (
            <>
                <Routes>
                    <Route path='/' element={<Outlet />}>
                        <Route index element={<EmployeesList />} />
                        <Route path='admin/*' element={<AdminLayout />}>
                            <Route index element={<IndexAdminPage />} />
                            <Route path='update/:employeeId' element={<UpdatePage />} />
                            <Route path='create' element={<CreatePage />} />
                            <Route path='companies-list' element={<CompaniesListPage />} />
                            <Route path='*' element={<Navigate to='/admin' />} />
                        </Route>
                        <Route path='login' element={<LoginPage />} />
                        <Route path='*' element={<IndexAdminPage />} />
                    </Route>
                </Routes>
            </>
        )
    } else return <Preloader color='#2f60a5' size={150} minHeight='100vh' />
}

export default App
