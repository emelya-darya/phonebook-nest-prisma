import React from 'react'
import { Link } from 'react-router-dom'
import shortid from 'shortid'
import c from './paginator.module.scss'

const NEXT_SYMB = '»'
const PREV_SYMB = '«'

//! -------------------------------------------------------------------------------------------- Функции-хелперы - НАЧАЛО------------------------------------------------------------------------------------- //
//* Helper method for creating a range of numbers range(1, 5) => ['1', '2', '3', '4', '5']
const range = (from: number, to: number, step = 1): Array<string> => {
    let i = from
    const range = []
    while (i <= to) {
        range.push(String(i))
        i += step
    }
    return range
}

//* функция для формирования строкового массива с символами для клеточек пагинации
const formPagesContentArr = (totalPagesCount: number, currentPage: number, prev_symb: string, next_symb: string): Array<string> => {
    let pagesContentArr: Array<string> = []

    if (totalPagesCount <= 1) return pagesContentArr
    else if (totalPagesCount <= 10) {
        pagesContentArr = range(1, totalPagesCount)
    } else {
        if (currentPage == 1 || currentPage == 2) {
            pagesContentArr = [...range(1, 7), next_symb, String(totalPagesCount)]
        } else if (currentPage >= totalPagesCount - 1) {
            pagesContentArr = ['1', prev_symb, ...range(totalPagesCount - 7, totalPagesCount)]
        } else if (currentPage != 1 && currentPage != 2 && currentPage != totalPagesCount && currentPage != totalPagesCount - 1) {
            pagesContentArr = ['1', prev_symb, ...range(currentPage - 2, currentPage + 2), next_symb, String(totalPagesCount)]
        }
    }

    return pagesContentArr
}
//! -------------------------------------------------------------------------------------------- Функции-хелперы - КОНЕЦ------------------------------------------------------------------------------------- //

type PaginatorItemPropsType = {
    isActive: boolean
    content: string
    baseURI: string
    pageNumForLink: number
    onChangePage: React.MouseEventHandler<HTMLLIElement>
}

const PaginatorItem = ({ isActive, content, onChangePage, baseURI, pageNumForLink }: PaginatorItemPropsType) => {
    return (
        <li className={isActive ? c.active : ''} onClick={onChangePage}>
            <Link to={`${baseURI}page=${pageNumForLink}`}>
                <span>{content}</span>
            </Link>
        </li>
    )
}

type PaginatorPropsType = {
    onPageChangeHandler: (pageNum: number) => void
    totalRecordsCount: number
    pageLimit: number
    baseURI: string
    activePage: number
}

// в пагинатор нужны следующие пропсы:
// 1 - onPageChangeHandler - коллбек, ; будет срабатывать при клике на элемент пагинации
//                           этот коллбек создается в компоненте, в которой используется пагинатор и по идее в этом коллбеке должен быть запрос на сервер
//                           он вызывается при клике на элемент пагинации в параметрах которого будет доступен номер страницы на которую кликнули (доступность этого параметра реализована в пагинаторе)
// 2 - totalRecordsCount   - общее количество записей в разделе
// 3 - pageLimit           - количество записей на одной странице
// 4 - baseURI             - базовый URI, к которому будет дописываться query-параметр 'page=${номер страницы}'
// 5 - activePage          - номер активной страницы (в родительской компоненте достается из query-параметра урла)

const Paginator: React.FC<PaginatorPropsType> = ({ onPageChangeHandler, totalRecordsCount, pageLimit, baseURI, activePage }) => {
    const totalPagesCount = Math.ceil(totalRecordsCount / pageLimit)

    //* строковый массив с символами для клеточек пагинации
    const pagesArr: Array<string> = formPagesContentArr(totalPagesCount, activePage, PREV_SYMB, NEXT_SYMB)

    return (
        <nav aria-label='pagination' className={c.pagination}>
            <ul className={c.pagUl}>
                {pagesArr.map(pageNum => {
                    // вычисление pageNumForLink
                    let pageNumForLink = 1
                    if (parseInt(pageNum)) pageNumForLink = +pageNum
                    else if (pageNum == PREV_SYMB) pageNumForLink = Math.max(1, activePage - 5)
                    else if (pageNum == NEXT_SYMB) pageNumForLink = Math.min(totalPagesCount, activePage + 5)

                    return (
                        <PaginatorItem
                            key={shortid.generate()}
                            isActive={+pageNum === activePage}
                            content={pageNum}
                            baseURI={baseURI}
                            pageNumForLink={pageNumForLink}
                            onChangePage={e => onPageChangeHandler(pageNumForLink)}
                        />
                    )
                })}
            </ul>
        </nav>
    )
}

export { Paginator }
