// import shortid from 'shortid'
import { AiOutlinePlus } from 'react-icons/ai'
import { Button } from '../../../../../../reusableElements/button/Button'
import c from './empItemModal.module.scss'
// import { RiCloseFill } from 'react-icons/ri'

type EmployeeItemInModalPropsType = {
    name: string
    position: string | null
    id: number
    addItemHandler: (id: number, name: string) => void
}

const EmployeeItemInModal: React.FC<EmployeeItemInModalPropsType> = ({ id, name, position, addItemHandler }) => {
    return (
        <div className={c.empItem}>
            <div className={c.namePosition}>
                <div className={c.name}>{name}</div>
                <div className={c.position}>{position ? position : <span>&mdash;</span>}</div>
            </div>

            <Button
                title='Добавить'
                type='button'
                name='Добавить'
                Icon={AiOutlinePlus}
                isDisabled={false}
                extraClassName={c.addBtn}
                isLoading={false}
                onClickHandler={() => {
                    addItemHandler(id, name)
                }}
            />
        </div>
    )
}

export { EmployeeItemInModal }
