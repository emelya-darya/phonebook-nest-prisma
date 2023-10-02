import { RiCloseFill } from 'react-icons/ri'
import c from '../updateCreateForm.module.scss'

type SupervisorSubordBlockPropsType = {
   employee_id: number
   name: string
   onDeleteItemHandler: () => void
}
const SupervisorSubordBlock: React.FC<SupervisorSubordBlockPropsType> = ({ employee_id, name, onDeleteItemHandler }) => {
   if (employee_id && name)
      return (
         <div className={c.subordSupervisorBlock}>
            {name}
            <RiCloseFill title='Удалить' onClick={onDeleteItemHandler} />
         </div>
      )
   return <></>
}

export { SupervisorSubordBlock }
