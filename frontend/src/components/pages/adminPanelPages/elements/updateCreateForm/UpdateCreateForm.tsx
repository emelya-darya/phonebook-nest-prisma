import React from 'react'
import { AiFillCheckCircle, AiOutlinePlus } from 'react-icons/ai'
import { MdOutlineError } from 'react-icons/md'
import { TfiSave } from 'react-icons/tfi'
import InputMask from 'react-input-mask'
import { EmployeeData, EmployeeDataToSendForUpdateOrCreate, SupervisorType } from '../../../../../store/commonTypes'
import { Button } from '../../../../reusableElements/button/Button'
import { onCloseModal, onOpenModal } from '../../../../reusableElements/forOpenModalOverflowHandler/forOpenModalOverflowHandler'
import { useMatchMedia } from '../../../../../customHooks/useMatchMedia'
import { SelectCompany } from '../../../../reusableElements/selectCompany/SelectCompany'
import { isEqualValuesInObjects, regEmail, regForInnerPhone, regForMobilePhone } from './helpers'
import { SupervisorSubordBlock } from './supervisorSubordBlock/SupervisorSubordBlock'
import { AvatarBlock } from './avatarBlock/AvatarBlock'
import { ModalForModifyList } from './modalForModifyList/ModalForModifyList'
import c from './updateCreateForm.module.scss'

type UpdateCreatePropsType = {
    initialData: EmployeeData
    isInProgressSubmit: boolean
    errOnSubmit: string | null
    successNotifyLettering: string
    onSubmitHandler: (data: EmployeeDataToSendForUpdateOrCreate, id?: number) => void
}

const UpdateCreateForm: React.FC<UpdateCreatePropsType> = ({
    initialData,
    isInProgressSubmit,
    errOnSubmit,
    successNotifyLettering,
    onSubmitHandler,
}) => {
    //* Данные для отправки
    // фото для отправки может быть только string | null | undefined | Blob
    const [nameValue, setNameValue] = React.useState(initialData.name || '')
    const [positionValue, setPositionValue] = React.useState(initialData.position || '')
    const [innerPhoneValue, setInnerPhoneValue] = React.useState(initialData.inner_phone || '')
    const [mobilePhoneValue, setMobilePhoneValue] = React.useState(initialData.mobile_phone || '')
    const [emailValue, setEmailValue] = React.useState(initialData.email || '')
    const [cityValue, setCityValue] = React.useState(initialData.city || '')
    const [companyIdValue, setCompanyIdValue] = React.useState(
        initialData.company === null ? 'null' : String(initialData.company.company_id),
    )
    const [departmentValue, setDepartmentValue] = React.useState(initialData.department || '')
    const [photoValue, setPhotoValue] = React.useState<string | null | Blob>(initialData.photo)
    const [supervisorValue, setSupervisorValue] = React.useState<SupervisorType>(initialData.supervisor)

    const isValidMobilePhone = mobilePhoneValue.length > 17 || mobilePhoneValue.length === 0
    const isValidInnerPhone = !regForInnerPhone.test(innerPhoneValue)
    const isValidEmail = regEmail.test(emailValue.trim().toLowerCase()) || !emailValue.trim().length
    const isValidName = !!nameValue.trim().length

    const onChangePhotoValueHandler = (newValue: string | null | Blob) => {
        setPhotoValue(newValue)
    }

    //!======================================================== Работа модального окна с подчиненными-руководителями (начало) ===================================================================================//
    const [isOpenModalModifyList, setIsOpenModalModifyList] = React.useState(false)

    const onOpenModalHandler = function () {
        setIsOpenModalModifyList(true)
        onOpenModal()
    }

    const onCloseModalHandler = function () {
        setIsOpenModalModifyList(false)
        onCloseModal()
    }

    const onAddSupervisorHandler = function (id: number, name: string) {
        setSupervisorValue({ employee_id: id, name })
        onCloseModalHandler()
    }

    const openModalForEditSupervisor = function () {
        onOpenModalHandler()
    }

    //!======================================================== Работа модального окна с подчиненными-руководителями (конец)  ===================================================================================//

    //*======================================================== Отправка данных ================================================================================================================================//

    const dataToSend = {
        name: nameValue.trim(),
        position: positionValue.trim(),
        inner_phone: innerPhoneValue.trim(),
        mobile_phone: mobilePhoneValue.trim().slice(0, 18),
        email: emailValue.trim(),
        city: cityValue.trim(),
        company_id: companyIdValue,
        department: departmentValue.trim(),
        photo: photoValue,
        supervisor_id: supervisorValue ? supervisorValue.employee_id : null,
    }

    const [isVisibleSubmitNotify, setIsVisibleSubmitNotify] = React.useState(false)

    const onSubmitHandlerWr = function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        onSubmitHandler(dataToSend, initialData.employee_id)
        setIsVisibleSubmitNotify(true)
    }

    const isDisabledSendBtn =
        isEqualValuesInObjects(initialData, dataToSend) || !isValidMobilePhone || !isValidEmail || !isValidName || !isValidInnerPhone

    return (
        <form className={c.updateForm} onSubmit={onSubmitHandlerWr}>
            <div className={c.photoNamePosition}>
                <AvatarBlock photoValue={photoValue} onChangePhotoValueHandler={onChangePhotoValueHandler} />

                <div className={c.namePosition}>
                    <div className={`${c.inputGroup} ${!isValidName ? c.withError : ''}`}>
                        <label htmlFor='name'>ФИО</label>
                        <input
                            type='text'
                            id='name'
                            value={nameValue}
                            onInput={e => {
                                setNameValue(e.currentTarget.value)
                            }}
                        />
                        <span className={c.spanErr}> Поле обязательно для заполнения</span>
                    </div>

                    <div className={`${c.inputGroup}`}>
                        <label htmlFor='position'>Должность</label>
                        <input
                            type='text'
                            id='position'
                            value={positionValue}
                            onInput={e => {
                                setPositionValue(e.currentTarget.value)
                            }}
                        />
                        <span className={c.spanErr}> </span>
                    </div>
                </div>
            </div>
            <p className={c.subtitle}>Контакты</p>
            <div className={c.contactsInputs}>
                <div className={`${c.inputGroup} ${isValidInnerPhone ? '' : c.withError}`}>
                    <label htmlFor='innerPhone'>Внутренний телефон</label>
                    <input
                        placeholder='00-01'
                        type='text'
                        id='innerPhone'
                        value={innerPhoneValue}
                        onInput={e => {
                            setInnerPhoneValue(e.currentTarget.value.trim())
                        }}
                    />
                    <span className={c.spanErr}>Допустимые символы: цифры, дефис</span>
                </div>

                <div className={`${c.inputGroup} ${isValidMobilePhone ? '' : c.withError}`}>
                    <label htmlFor='mobilePhone'>Мобильный телефон</label>
                    <InputMask
                        // alwaysShowMask={true}
                        mask='+7 (999) 999-99-99'
                        placeholder='+7 (800) 555-35-35'
                        type='text'
                        id='mobilePhone'
                        value={mobilePhoneValue}
                        maskChar={null}
                        onInput={e => {
                            let correctedValue = e.currentTarget.value
                                .replace(regForMobilePhone, '')
                                .replace(/\s{2,}/g, ' ')
                                .trim()
                                .slice(0, 18)

                            if (correctedValue.length < 5) correctedValue = ''

                            setMobilePhoneValue(correctedValue)
                        }}></InputMask>
                    <span className={c.spanErr}>Некорректный номер</span>
                </div>

                <div className={`${c.inputGroup} ${isValidEmail ? '' : c.withError}`}>
                    <label htmlFor='email'>Почта</label>
                    <input
                        type='text'
                        id='email'
                        value={emailValue}
                        onInput={e => {
                            setEmailValue(e.currentTarget.value)
                        }}
                    />
                    <span className={c.spanErr}>Некорректный адрес почты</span>
                </div>
            </div>

            <p className={c.subtitle}>Организационная структура</p>
            <div className={c.orgInfoInputs}>
                <div className={`${c.inputGroup}`}>
                    <label htmlFor='city'>Город</label>
                    <input
                        type='text'
                        id='city'
                        value={cityValue}
                        onInput={e => {
                            setCityValue(e.currentTarget.value)
                        }}
                    />
                    <span className={c.spanErr}></span>
                </div>

                <div className={`${c.inputGroup} input-group`}>
                    <label htmlFor='company'>Компания</label>

                    <SelectCompany
                        currentCompany={companyIdValue}
                        onChangeValueHandler={(selectedValue: string) => {
                            setCompanyIdValue(selectedValue)
                        }}
                        additionDefaultOption={{ value: 'null', label: 'Не указывать' }}
                    />
                    <span className={c.spanErr}></span>
                </div>

                <div className={`${c.inputGroup}`}>
                    <label htmlFor='department'>Подразделение</label>
                    <input
                        type='text'
                        id='department'
                        value={departmentValue}
                        onInput={e => {
                            setDepartmentValue(e.currentTarget.value)
                        }}
                    />
                    <span className={c.spanErr}></span>
                </div>
            </div>

            <div className={c.supervisorBlock}>
                <p className={c.bigSubt}>Руководитель:</p>
                <div className={c.supervisorItem}>
                    {supervisorValue ? (
                        <SupervisorSubordBlock
                            {...supervisorValue}
                            onDeleteItemHandler={() => {
                                setSupervisorValue(null)
                            }}
                        />
                    ) : (
                        <Button
                            isLoading={false}
                            isDisabled={false}
                            name='Добавить'
                            Icon={AiOutlinePlus}
                            type='button'
                            extraClassName={c.addNew}
                            title='Добавить нового'
                            onClickHandler={openModalForEditSupervisor}
                        />
                    )}
                </div>
            </div>

            <Button
                name={!useMatchMedia().less576 ? 'Сохранить изменения' : 'Сохранить'}
                type='submit'
                Icon={TfiSave}
                isDisabled={isDisabledSendBtn}
                isLoading={isInProgressSubmit}
                extraClassName={c.sendBtn}
            />
            <div
                className={`${c.notifySubmit} ${errOnSubmit ? c.err : c.succ} ${
                    isVisibleSubmitNotify && !isInProgressSubmit ? c.visible : ''
                }`}>
                {errOnSubmit ? (
                    <>
                        <MdOutlineError />
                        <span>{errOnSubmit}</span>
                    </>
                ) : (
                    <>
                        <AiFillCheckCircle /> <span>{successNotifyLettering}</span>
                    </>
                )}
            </div>

            <ModalForModifyList
                isOpen={isOpenModalModifyList}
                onCloseModalHandler={onCloseModalHandler}
                currentEmployeeId={initialData.employee_id}
                onAddSupervisorHandler={onAddSupervisorHandler}
            />
        </form>
    )
}

export { UpdateCreateForm }
