import c from './header.module.scss'
import { companyName, logo } from '../../../../reusableElements/companyData'
import { BiSearch } from 'react-icons/bi'
import React from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'
import { GlobalStateType } from '../../../../../store/redux/reduxStore'
import { EmployeesAC } from '../../../../../store/redux/employees/employeesReducer'
import { Button } from '../../../../reusableElements/button/Button'
import { PiSignInBold } from 'react-icons/pi'

const Header = () => {
   const seаrchRequest = useSelector((state: GlobalStateType) => state.forEmpsData.searchRequest)

   const dispatch = useDispatch()

   const onTypeSearchRequestHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(EmployeesAC.setSearchRequest(e.target.value))
      dispatch(EmployeesAC.setCurrentPage(1))
   }

   return (
      <header className={c.header}>
         <div className='header__container'>
            <div className={c.headerContent}>
               <div className={c.logoWr}>
                  <img src={logo} alt={companyName} />
               </div>
               <div className={c.rightPart}>
                  <div className={c.searchFieldBlock}>
                     <input
                        name='searchRequest'
                        value={seаrchRequest || ''}
                        type='text'
                        placeholder='Поиск...'
                        onInput={onTypeSearchRequestHandler}
                     />
                     <BiSearch />
                  </div>
                  <Button type='button' name={'Войти'} tag='link' linkPath='/admin' isLoading={false} isDisabled={false} Icon={PiSignInBold} extraClassName={c.linkToAdmin} title='Войти'/>
               </div>
            </div>
         </div>
      </header>
   )
}

export { Header }
