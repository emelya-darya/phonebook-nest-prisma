// import { FaUserAlt } from 'react-icons/fa'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { EmployeeData } from '../../../../store/commonTypes'
import { useMatchMedia } from '../../../../customHooks/useMatchMedia'
import { getPhotoPath } from '../../../reusableElements/getPhotoPath'
import c from './empItem.module.scss'

type EmpItemPropsType = EmployeeData & {
    onClickHandler: () => void
}

const EmpItem: React.FC<EmpItemPropsType> = ({
   //  city,
   //  company,
   //  department,
   //  subordinates,
   //  supervisor,
    position,
    name,
    inner_phone,
   //  mobile_phone,
    photo,
    email,
    onClickHandler,
}) => {
    return (
        <>
            {!useMatchMedia().less768 ? (
                <div className={c.empRow} onClick={onClickHandler}>
                    <div className={c.fio}>
                        <div className={c.avatarWr}>
                            <img src={getPhotoPath(photo)} alt='user' />
                        </div>
                        <p className={c.name}>{name}</p>
                    </div>
                    <div className={c.position}>{position || '—'}</div>
                    <div className={c.innerPhone}>
                        <BsFillTelephoneFill />
                        <span>{inner_phone || '—'}</span>
                    </div>
                    <div className={c.email}>
                        {email ? (
                            <a
                                href={`mailto:${email}`}
                                onClick={e => {
                                    e.stopPropagation()
                                }}>
                                {email}
                            </a>
                        ) : (
                            <span>—</span>
                        )}
                    </div>
                    <div className={c.empRowMask}></div>
                </div>
            ) : (
                <div className={c.empRowForSmall} onClick={onClickHandler}>
                    <div className={c.fioBlock}>
                        {/* <p className={c.subt}>ФИО:</p> */}
                        <div className={c.fioBlockContent}>
                            <div className={c.avatarWr}>
                                <img src={getPhotoPath(photo)} alt='user' />
                            </div>
                            <p className={c.name}>{name}</p>
                        </div>
                    </div>
                    <div className={c.positionBlock}>
                        <p className={c.subt}>Должность:</p>
                        <div>{position || '—'}</div>
                    </div>
                    <div className={c.innerPhoneBlock}>
                        <p className={c.subt}>Внутренний телефон:</p>
                        <div>{inner_phone || '—'}</div>
                    </div>
                    <div className={c.emailBlock}>
                        <p className={c.subt}>Email:</p>
                        {email ? <a href={`mailto:${email}`}>{email}</a> : <span>—</span>}
                    </div>
                </div>
            )}
        </>
    )
}

export { EmpItem }
