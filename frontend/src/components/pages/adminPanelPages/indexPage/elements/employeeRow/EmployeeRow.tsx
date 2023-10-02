import { AiOutlineClose } from 'react-icons/ai'
import { RiCloseFill } from 'react-icons/ri'
import { Button } from '../../../../../reusableElements/button/Button'
import { getPhotoPath } from '../../../../../reusableElements/getPhotoPath'
import c from './employeeRow.module.scss'
import { initialDataForDeleteModal } from '../../IndexAdminPage'
import { useSelector } from 'react-redux'
import { GlobalStateType } from '../../../../../../store/redux/reduxStore'
import { BiEditAlt } from 'react-icons/bi'

type EmployeeItemPropsType = {
   id: number
   name: string
   position: string | null
   photo: string | null
   onClickDeleteBtnHandler: (data: typeof initialDataForDeleteModal) => void
}

const EmployeeRow: React.FC<EmployeeItemPropsType> = ({ id, name, position, photo, onClickDeleteBtnHandler }) => {
   const { deletedEmployees, nowInProgressDeleteEmployees } = useSelector((state: GlobalStateType) => state.forAdminData.indexPage)
   const isInProgressDeleting = nowInProgressDeleteEmployees.includes(id)
   const isDeleted = deletedEmployees.includes(id)

   const errorsOnDeleteEmps = useSelector((state: GlobalStateType) => state.forErrorsData.adminErrors.errorsOnDeleteEmps)
   const requiredErrObj = errorsOnDeleteEmps.find(item => item.id === id)

   return (
      <div className={`${c.empRow} ${isDeleted ? c.isDeleted : ''}`}>
         <div className={c.photoWr}>
            <img src={getPhotoPath(photo)} alt='' />
         </div>
         <div className={c.namePosition}>
            <p className={c.name}>{name}</p>
            <p className={c.position}>{position ? position : <>&mdash;</>}</p>
         </div>
         <div className={c.buttons}>
            <Button
               title='Редактировать'
               tag='link'
               linkPath={`/admin/update/${id}`}
               type='button'
               name={null}
               Icon={BiEditAlt}
               isDisabled={false}
               extraClassName={c.editBtn}
               isLoading={false}
               onClickHandler={() => {}}
            />
            <Button
               title='Удалить'
               type='button'
               name={null}
               Icon={RiCloseFill}
               isDisabled={false}
               extraClassName={c.deleteBtn}
               isLoading={isInProgressDeleting}
               preloaderClr='#fff'
               onClickHandler={() => {
                  onClickDeleteBtnHandler({ id, name })
               }}
            />
         </div>
         <div className={c.mask}>
            <span>Запись удалена</span>
         </div>
         <div className={c.errOnDeleting}>{requiredErrObj?.message || ''}</div>
      </div>
   )
}

export { EmployeeRow }
