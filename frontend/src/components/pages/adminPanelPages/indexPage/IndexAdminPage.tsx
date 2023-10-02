import { useSelector } from 'react-redux'
import { Navigate, useSearchParams } from 'react-router-dom'
import { GlobalStateType } from '../../../../store/redux/reduxStore'
import { BiSearch } from 'react-icons/bi'
import React from 'react'
import c from './indexPage.module.scss'
import { Paginator } from '../../../reusableElements/paginator/Paginator'
import { useDispatch } from 'react-redux'
import { AdminAC } from '../../../../store/redux/admin/adminReducer'
import shortid from 'shortid'
import { Preloader } from '../../../reusableElements/preloader/Preloader'
import { EmployeeRow } from './elements/employeeRow/EmployeeRow'
import { ModalOnDelete } from './elements/modalOnDeleteEmployee/ModalOnDeleteEmployee'
import { onCloseModal, onOpenModal } from '../../../reusableElements/forOpenModalOverflowHandler/forOpenModalOverflowHandler'
import { Button } from '../../../reusableElements/button/Button'
import { AiOutlinePlus } from 'react-icons/ai'
import { SelectCompany } from '../../../reusableElements/selectCompany/SelectCompany'
import { withAuthRedirectHOK } from '../../../reusableElements/WithAuthRedirectHOK'

export const initialDataForDeleteModal = {
   id: null as number | null,
   name: '' as string,
}

const IndexAdminPage = withAuthRedirectHOK(() => {
   const dispatch = useDispatch()

   const { currentPage, searchRequest, currentCompany, portionEmployees, isLoadingEmpsList, totalCount, pageSize } = useSelector(
      (state: GlobalStateType) => state.forAdminData.indexPage
   )
   const { errOnLoadEmployeesList } = useSelector((state: GlobalStateType) => state.forErrorsData.adminErrors)

   React.useEffect(() => {
      // debugger
      dispatch(AdminAC.setCurrentPage(1))
      dispatch(AdminAC.setSearchRequest(''))
   }, [])

   const onChangePageFunc = (page: number) => dispatch(AdminAC.setCurrentPage(page))

   const onTypeSearchRequestHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(AdminAC.setSearchRequest(e.target.value))
      dispatch(AdminAC.setCurrentPage(1))
   }

   const [isOpenModalOnDelete, setIsOpenModalOnDelete] = React.useState(false)
   const [dataForModalOnDelete, setDataForModalOnDelete] = React.useState(initialDataForDeleteModal)

   const onClickDeleteBtnHandler = function (data: typeof initialDataForDeleteModal) {
      onOpenModal()
      setIsOpenModalOnDelete(true)
      setDataForModalOnDelete(data)
   }

   const closeModalOnDeleteHandler = function () {
      onCloseModal()
      setIsOpenModalOnDelete(false)
   }

   const totalPagesCount = Math.ceil(totalCount / pageSize)

   React.useEffect(() => {
      if (currentPage && totalPagesCount < currentPage) dispatch(AdminAC.setCurrentPage(totalPagesCount))
   }, [totalCount])


   return (
      <>
         <div className={c.searchSelectWr}>
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
            <SelectCompany
               currentCompany={currentCompany}
               onChangeValueHandler={(selectedValue: string) => {
                  dispatch(AdminAC.setCurrentCompanyIdxPage(selectedValue))
                  dispatch(AdminAC.setCurrentPage(1))
               }}
               additionDefaultOption={{ value: 'all', label: 'Все компании' }}
            />
         </div>

         <div className={c.paginatorWr}>
            <Paginator
               totalRecordsCount={totalCount}
               pageLimit={pageSize}
               baseURI={`/admin?`}
               activePage={currentPage || 1}
               onPageChangeHandler={onChangePageFunc}
            />
         </div>

         {isLoadingEmpsList ? (
            <Preloader color='#2f60a5' size={150} minHeight='60vh' />
         ) : errOnLoadEmployeesList ? (
            <div className={c.errOnLoadEmps}>
               <span> {errOnLoadEmployeesList}</span>
            </div>
         ) : (
            <div>
               {portionEmployees.length !== 0 ? (
                  portionEmployees.map(item => (
                     <EmployeeRow
                        key={shortid.generate()}
                        id={item.employee_id}
                        name={item.name}
                        position={item.position}
                        photo={item.photo}
                        onClickDeleteBtnHandler={onClickDeleteBtnHandler}
                     />
                  ))
               ) : (
                  <div className={c.noitems}>По вашему запросу не найдено ни одного сотрудника</div>
               )}
            </div>
         )}

         <div className={c.paginatorWr}>
            <Paginator
               totalRecordsCount={totalCount}
               pageLimit={pageSize}
               baseURI={`/admin?`}
               activePage={currentPage || 1}
               onPageChangeHandler={onChangePageFunc}
            />
         </div>
         <Button
            tag='link'
            linkPath='/admin/create'
            type='button'
            name='Создать новую запись'
            Icon={AiOutlinePlus}
            isDisabled={false}
            isLoading={false}
            extraClassName={c.createNewBtn}
         />
         <ModalOnDelete isOpen={isOpenModalOnDelete} closeModalHandler={closeModalOnDeleteHandler} {...dataForModalOnDelete} />
      </>
   )
})

export { IndexAdminPage }
