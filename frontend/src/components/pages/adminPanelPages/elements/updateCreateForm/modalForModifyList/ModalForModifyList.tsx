import React from 'react'
import shortid from 'shortid'
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { GlobalStateType } from '../../../../../../store/redux/reduxStore'
import { AdminAC } from '../../../../../../store/redux/admin/adminReducer'
import { Preloader } from '../../../../../reusableElements/preloader/Preloader'
// import { RiCloseFill } from 'react-icons/ri'
// import { Button } from '../../../../../reusableElements/button/Button'
import c from './modalForModifyList.module.scss'
import { EmployeeItemInModal } from './elements/EmployeeItemModal'

type ModalForModifyListPropsType = {
    isOpen: boolean
    onCloseModalHandler: () => void
    currentEmployeeId: number
    onAddSupervisorHandler: (id: number, name: string) => void
}

const ModalForModifyList: React.FC<ModalForModifyListPropsType> = ({
    isOpen,
    onCloseModalHandler,
    currentEmployeeId,
    onAddSupervisorHandler,
}) => {
    const { searchRequest, portionEmployees, isLoadingExpandPortion, isLoadingInitialPortion } = useSelector(
        (state: GlobalStateType) => state.forAdminData.dataForModalModifyList,
    )

    const { errOnGetInitialPortionForModal, errOnExpandPortionForModal } = useSelector(
        (state: GlobalStateType) => state.forErrorsData.adminErrors,
    )

    const filteredPortionEmployees = portionEmployees.filter(el => el.employee_id != currentEmployeeId)
    const dispatch = useDispatch()

    React.useEffect(() => {
        dispatch(AdminAC.getInitialEmployeesPortionForModal())
    }, [])

    const onTypeSearchRequestHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(AdminAC.setSearchRequestForModal(e.target.value))
    }

    const employeeItemsBlock = React.useRef<HTMLDivElement>(null)

    const scrollHandler = React.useCallback(function (e: Event) {
        const block = employeeItemsBlock?.current
        if (block) {
            if (block.scrollHeight - block.scrollTop - block.offsetHeight < 200) {
                dispatch(AdminAC.getExpandEmployeesPortionForModal())
            }
        }
    }, [])

    React.useEffect(() => {
        if (employeeItemsBlock?.current) employeeItemsBlock.current.addEventListener('scroll', scrollHandler)
    }, [employeeItemsBlock?.current])

    React.useEffect(() => {
        if (employeeItemsBlock?.current) employeeItemsBlock.current.removeEventListener('scroll', scrollHandler)
    }, [])

    const handleCloseWrapper = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        //@ts-ignore
        const classListArr = Array.from(e?.target?.classList || [])
        if (classListArr.includes('close') && e.button === 0) onCloseModalHandler()
    }

    const addItemHandler = onAddSupervisorHandler

    return (
        <div className={`${c.modalModifyList}    ${isOpen ? c.visible : ''}  close`} onClick={handleCloseWrapper}>
            <div className={c.modalContent}>
                <div className={`${c.closeBtn} close`} onClick={onCloseModalHandler}>
                    <AiOutlineClose />
                    <div className={`${c.closeBtnMask} close`}></div>
                </div>

                <div className={`${c.inputGroup} ${c.searchField}`}>
                    <input
                        name='searchRequest'
                        type='text'
                        value={searchRequest || ''}
                        placeholder='Поиск...'
                        onInput={onTypeSearchRequestHandler}
                    />
                    <BiSearch />
                </div>
                <div className={c.preloaderItemsWr}>
                    {isLoadingInitialPortion ? (
                        <Preloader color='#2f60a5' size={150} minHeight='400px' />
                    ) : errOnGetInitialPortionForModal ? (
                        <div className={c.errOnGetInitialPortion}>
                            <span>{errOnGetInitialPortionForModal}</span>
                        </div>
                    ) : (
                        <div className={c.employeeItems} ref={employeeItemsBlock}>
                            {filteredPortionEmployees.length ? (
                                filteredPortionEmployees.map(emp => {
                                    return (
                                        <EmployeeItemInModal
                                            key={shortid.generate()}
                                            name={emp.name}
                                            position={emp.position}
                                            id={emp.employee_id}
                                            addItemHandler={addItemHandler}
                                        />
                                    )
                                })
                            ) : (
                                <div className={c.noOne}>
                                    <span>По вашему запросу не найдено ни одного сотрудника</span>
                                </div>
                            )}
                            {}
                        </div>
                    )}
                    <div className={`${c.smallPreloaderWr} ${isLoadingExpandPortion ? c.visible : ''}`}>
                        {isLoadingExpandPortion ? (
                            <Preloader color='#2f60a5' size={30} minHeight='30px' />
                        ) : errOnExpandPortionForModal ? (
                            <div className={c.errOnExpand}>
                                <span>{errOnExpandPortionForModal}</span>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ModalForModifyList }
