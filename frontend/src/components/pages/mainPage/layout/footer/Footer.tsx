import c from './footer.module.scss'
import { companyName, logo } from '../../../../reusableElements/companyData'

const Footer = () => {
   return (
      <footer className={c.footer}>
         <div className='footer__container'>
            <div className={c.footerContent}>
               <p>ООО «{companyName}», телефонный справочник</p>
               <div className={c.logoWr}>
                  <img src={logo} alt={companyName} />
               </div>
            </div>
         </div>
      </footer>
   )
}

export { Footer }
