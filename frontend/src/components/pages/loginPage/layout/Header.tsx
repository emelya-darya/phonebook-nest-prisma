import c from './header.module.scss'
import { companyName, logo } from '../../../reusableElements/companyData'
import { Link } from 'react-router-dom'

const Header = () => {
   return (
      <header className={c.header}>
         <div className='header__container'>
            <div className={c.headerContent}>
               <Link to='/' className={c.logoWr}>
                  <img src={logo} alt={companyName} />
               </Link>
               <div className={c.lett}>Телефонный справочник ООО «{companyName}»</div>
            </div>
         </div>
      </header>
   )
}

export { Header }
