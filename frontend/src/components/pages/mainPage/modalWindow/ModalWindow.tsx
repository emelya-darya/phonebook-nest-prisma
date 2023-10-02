import { AiOutlineClose } from 'react-icons/ai'
import shortid from 'shortid'
import { HiExternalLink } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import { GlobalStateType } from '../../../../store/redux/reduxStore'
import { getPhotoPath } from '../../../reusableElements/getPhotoPath'
import { Preloader } from '../../../reusableElements/preloader/Preloader'
import { EmployeesAC } from '../../../../store/redux/employees/employeesReducer'
import c from './modalWindow.module.scss'

const formatPhoneToLink = (phoneStr: string): string => phoneStr.replace(/^\+7/, '8').replace(/\D/g, '')

type ModalWindowPropsType = {
    isOpen: boolean
    handleCloseModal: () => void
}
const ModalWindow: React.FC<ModalWindowPropsType> = ({ isOpen, handleCloseModal }) => {
    const handleCloseModalWrapper = function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        //@ts-ignore
        const classListArr = Array.from(e?.target?.classList || [])
        if (classListArr.includes('close') && e.button === 0) handleCloseModal()
    }

    const employeeItemInModel = useSelector((state: GlobalStateType) => state.forEmpsData.employeeItemInModel)
    const { isLoadingEmployeeModalData } = useSelector((state: GlobalStateType) => state.forEmpsData)
    const { errOnLoadEmployeeInModal } = useSelector((state: GlobalStateType) => state.forErrorsData.employeesViewErrors)

    const dispatch = useDispatch()

    const replaceInfoInModalHandler = function (id: number | undefined) {
        if (id) dispatch(EmployeesAC.getEmployeeForModal(id))
    }

    if (!employeeItemInModel) return <></>

    const { name, photo, position, inner_phone, mobile_phone, email, city, company, department, subordinates, supervisor } =
        employeeItemInModel
    return (
        <div className={`${c.modalWind} ${isOpen ? c.visible : ''} close`} onClick={handleCloseModalWrapper}>
            <div className={c.modalWindContent}>
                <div className={`${c.closeBtn} close`} onClick={handleCloseModal}>
                    <AiOutlineClose />
                    <div className={`${c.closeBtnMask} close`}></div>
                </div>
                {isLoadingEmployeeModalData ? (
                    <Preloader color='#2f60a5' size={150} minHeight='60vh' />
                ) : errOnLoadEmployeeInModal ? (
                    <div className={c.errOnLoadEmps}>
                        <span> {errOnLoadEmployeeInModal}</span>
                    </div>
                ) : (
                    <>
                        <div className={c.avatarMainInfoBlock}>
                            <div className={c.photoWr}>
                                <img src={getPhotoPath(photo)} alt='user' />
                            </div>
                            <div className={c.text}>
                                <p className={c.name}>{name}</p>

                                <p className={c.position}>
                                    <span className={c.subtitle}>Должность: </span>
                                    <span>{position || '—'}</span>
                                </p>

                                <p className={c.innerPhone}>
                                    <span className={c.subtitle}>Внутренний телефон: </span>
                                    <span>{inner_phone || '—'}</span>
                                </p>

                                <p className={c.mobilePhone}>
                                    <span className={c.subtitle}>Мобильный телефон: </span>
                                    {mobile_phone ? (
                                        <a href={`tel:${formatPhoneToLink(mobile_phone)}}`}>{mobile_phone}</a>
                                    ) : (
                                        <span>{'—'}</span>
                                    )}
                                </p>

                                <p className={c.email}>
                                    <span className={c.subtitle}>Почта: </span>
                                    {email ? <a href={`mailto:${email}}`}>{email}</a> : <span>{'—'}</span>}
                                </p>
                            </div>
                        </div>

                        <div className={c.aboutCompanyInfo}>
                            <p className={c.city}>
                                <span className={c.subtitle}>Город: </span>
                                <span>{city || '—'}</span>
                            </p>

                            <p className={c.company}>
                                <span className={c.subtitle}>Компания: </span>
                                <span>{company ? company.company_name : '—'}</span>
                            </p>

                            <p className={c.department}>
                                <span className={c.subtitle}>Подразделение: </span>
                                <span>{department || '—'}</span>
                            </p>

                            <p className={c.supervisor}>
                                <span className={c.subtitle}>Руководитель: </span>

                                {supervisor ? (
                                    <span
                                        className={c.pseudoLink}
                                        onClick={() => {
                                            replaceInfoInModalHandler(supervisor.employee_id)
                                        }}>
                                        <span>{supervisor.name}</span> <HiExternalLink />
                                    </span>
                                ) : (
                                    <span>—</span>
                                )}
                            </p>

                            <div className={c.subordinates}>
                                <span className={c.subtitle}>Подчиненные: </span>
                                {subordinates.length ? (
                                    <ul className={c.subordUl}>
                                        {subordinates.map(sub => (
                                            <li
                                                key={shortid.generate()}
                                                className={c.pseudoLink}
                                                onClick={() => {
                                                    replaceInfoInModalHandler(sub.employee_id)
                                                }}>
                                                <span>{sub.name}</span>
                                                <HiExternalLink />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>{'—'}</span>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export { ModalWindow }
