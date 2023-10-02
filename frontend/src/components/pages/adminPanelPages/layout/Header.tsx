import { Link, useLocation } from 'react-router-dom'
import { BiEditAlt } from 'react-icons/bi'
import { LuExternalLink } from 'react-icons/lu'

import { useMatchMedia } from '../../../../customHooks/useMatchMedia'

import c from './header.module.scss'
// import { useSelector } from 'react-redux'
// import { GlobalStateType } from '../../../../store/redux/reduxStore'

const Header = () => {
    const location = useLocation()

    const isDisabledCompaniesLink = location.pathname.startsWith('/admin/companies-list')

    return (
        <header className={c.header}>
            <div className='header__container'>
                <div className={c.headerContent}>
                    <div className={c.lett}>
                        {useMatchMedia().less576 ? 'Панель управления' : 'Административная панель телефонного справочника'}
                    </div>
                    <div className={c.rightPart}>
                        <Link to='/admin/companies-list' className={`${c.companiesListLink} ${isDisabledCompaniesLink ? c.disabled : ''}`}>
                            <span>Компании</span>
                            <BiEditAlt />
                        </Link>
                        <a href='/' className={c.linkToSite} target='_blank' title='На сайт'>
                            <span>На сайт</span>
                            <LuExternalLink />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}

export { Header }
