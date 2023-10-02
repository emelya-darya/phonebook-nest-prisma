import React from 'react'
import shortid from 'shortid'
import { useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { onCloseModal, onOpenModal } from '../../reusableElements/forOpenModalOverflowHandler/forOpenModalOverflowHandler'
import { useMatchMedia } from '../../../customHooks/useMatchMedia'
import { Paginator } from '../../reusableElements/paginator/Paginator'
import { Preloader } from '../../reusableElements/preloader/Preloader'
import { GlobalStateType } from '../../../store/redux/reduxStore'
import { SelectCompany } from '../../reusableElements/selectCompany/SelectCompany'
import { EmployeesAC } from '../../../store/redux/employees/employeesReducer'
import { ModalWindow } from './modalWindow/ModalWindow'
import { Header } from './layout/header/Header'
import { Footer } from './layout/footer/Footer'
import { EmpItem } from './employeItem/EmpItem'
import c from './empList.module.scss'

const EmployeesList = () => {
    const dispatch = useDispatch()

    const { currentPage, searchRequest, currentCompany, empsItems, isLoadingEmpsList, totalEmpsCount, pageSize } = useSelector(
        (state: GlobalStateType) => state.forEmpsData,
    )
    const { errOnLoadEmployeesList } = useSelector((state: GlobalStateType) => state.forErrorsData.employeesViewErrors)

    const [searchParams, setSearchParams] = useSearchParams()

    React.useEffect(() => {
        const activePageFromURL = searchParams.get('page')
        const searchParamFromURL = searchParams.get('search')
        const activeCompanyFromURL = searchParams.get('company')

        dispatch(EmployeesAC.setCurrentPage(activePageFromURL && +activePageFromURL ? +activePageFromURL : 1))
        dispatch(EmployeesAC.setSearchRequest(searchParamFromURL || ''))
        dispatch(EmployeesAC.setCurrentCompany(activeCompanyFromURL || 'all'))
    }, [])

    // обновление параметров поисковой строки
    React.useEffect(() => {
        if (searchRequest !== null && currentPage !== null && currentCompany !== null) {
            setSearchParams({ search: searchRequest, company: currentCompany, page: String(currentPage) })
        }
    }, [currentPage, searchRequest, currentCompany])

    const onChangePageFunc = (page: number) => dispatch(EmployeesAC.setCurrentPage(page))

    const onChangeSelectValueHandler = (setectedValue: string) => {
        dispatch(EmployeesAC.setCurrentCompany(setectedValue))
        dispatch(EmployeesAC.setCurrentPage(1))
    }

   //  const totalPagesCount = Math.ceil(totalEmpsCount / pageSize)

    // React.useEffect(() => {
    //    console.log(totalPagesCount)
    //    if (currentPage && totalPagesCount < currentPage) dispatch(EmployeesAC.setCurrentPage(totalPagesCount))
    // }, [totalPagesCount])

    const tableTitles =
        !useMatchMedia().less768 && empsItems.length ? (
            <div className={`${c.empRow} ${c.titleEmpRow}`}>
                <div className={c.fio}>ФИО</div>
                <div className={c.position}>Должность</div>
                <div className={c.innerPhone}>Внутренний телефон</div>
                <div className={c.email}>Email</div>
            </div>
        ) : (
            <></>
        )

    const [isOpenModalWind, setIsOpenModalWind] = React.useState(false)

    const handleCloseModal = function () {
        onCloseModal()
        setIsOpenModalWind(false)
    }

    const handleOpenModal = function (id: number) {
        onOpenModal()
        setIsOpenModalWind(true)
        dispatch(EmployeesAC.getEmployeeForModal(id))
    }

    return (
        <>
            <Header />
            <main className={c.main}>
                <div className='main__container'>
                    <div className={c.selectWr}>
                        <p>Компания:</p>
                        <SelectCompany
                            currentCompany={currentCompany}
                            onChangeValueHandler={onChangeSelectValueHandler}
                            additionDefaultOption={{ value: 'all', label: 'Все компании' }}
                        />
                    </div>
                    {isLoadingEmpsList ? (
                        <Preloader color='#2f60a5' size={150} minHeight='50vh' />
                    ) : errOnLoadEmployeesList ? (
                        <div className={c.errOnLoadEmps}>
                            <span> {errOnLoadEmployeesList}</span>
                        </div>
                    ) : (
                        <>
                            <div className={c.paginatorWrTop}>
                                <Paginator
                                    totalRecordsCount={totalEmpsCount}
                                    pageLimit={pageSize}
                                    baseURI={`/?search=${searchRequest}&`}
                                    activePage={currentPage || 1}
                                    onPageChangeHandler={onChangePageFunc}
                                />
                            </div>

                            <div className={c.empBlock}>
                                {tableTitles}
                                {empsItems.length !== 0 ? (
                                    empsItems.map(item => (
                                        <EmpItem
                                            key={shortid.generate()}
                                            onClickHandler={() => {
                                                handleOpenModal(item.employee_id)
                                            }}
                                            {...item}
                                        />
                                    ))
                                ) : (
                                    <div className={c.noitems}>По вашему запросу не найдено ни одного сотрудника</div>
                                )}
                            </div>

                            <div className={c.paginatorWrBottom}>
                                <Paginator
                                    totalRecordsCount={totalEmpsCount}
                                    pageLimit={pageSize}
                                    baseURI={`/?search=${searchRequest}&`}
                                    activePage={currentPage || 1}
                                    onPageChangeHandler={onChangePageFunc}
                                />
                            </div>
                            <ModalWindow isOpen={isOpenModalWind} handleCloseModal={handleCloseModal} />
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

export { EmployeesList }
