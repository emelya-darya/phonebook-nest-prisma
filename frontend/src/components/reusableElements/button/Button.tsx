import { Link } from 'react-router-dom'
import { Preloader } from '../preloader/Preloader'
import c from './button.module.scss'
import { IconType } from 'react-icons/lib'

type ButtonPropsType = {
   tag?: 'link'
   linkPath?: string
   type: 'button' | 'submit' | 'reset'
   name: string | null
   Icon: IconType | null
   extraClassName: string | null
   isDisabled: boolean
   isLoading: boolean
   preloaderClr?: string
   title?: string | undefined
   onClickHandler?: () => void
}

const Button: React.FC<ButtonPropsType> = ({ tag, type, name, Icon, extraClassName, isDisabled, isLoading, preloaderClr, onClickHandler, title, linkPath }) => {
   if (tag === 'link')
      return (
         <Link to={linkPath || '/'} className={`${c.btn} ${extraClassName}`} onClick={onClickHandler ? onClickHandler : () => {}} title={title}>
            {name && <span>{name}</span>}
            {Icon && <Icon />}
         </Link>
      )
   else
      return (
         <button type={type} className={`${c.btn} ${extraClassName}`} disabled={isDisabled || isLoading} onClick={onClickHandler ? onClickHandler : () => {}} title={title}>
            {isLoading ? (
               <Preloader color={preloaderClr || '#fff'} size={23} minHeight='23px' />
            ) : (
               <>
                  {name && <span>{name}</span>}
                  {Icon && <Icon />}
               </>
            )}
         </button>
      )
}

export { Button }
