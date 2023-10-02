import { useSelector } from 'react-redux'
import Select, { CSSObjectWithLabel, SingleValue, components } from 'react-select'
import { GlobalStateType } from '../../../store/redux/reduxStore'
import React from 'react'

const scrollbarStyles = {
   menuList: (base: CSSObjectWithLabel) => ({
      ...base,
      '::-webkit-scrollbar': {
         width: '4px',
         height: '0px',
      },
      '::-webkit-scrollbar-track': {
         background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
         background: 'rgba(0, 0, 0, 0.1)',
      },
      '::-webkit-scrollbar-thumb:hover': {
         background: '#555',
      },
   }),
}

type OptionType = {
   value: string
   label: string
}

type SelectCompanyPropsType = {
   currentCompany: string
   onChangeValueHandler: (setectedValue: string) => void
   additionDefaultOption: OptionType
}

const SelectCompany: React.FC<SelectCompanyPropsType> = ({ currentCompany, onChangeValueHandler, additionDefaultOption }) => {
   const companiesList = useSelector((state: GlobalStateType) => state.forCompaniesData.companiesList)

   const optionsForSelect = [additionDefaultOption, ...companiesList.map(c => ({ value: String(c.company_id), label: c.company_name }))]

   const onChangeHandler = function (newValue: SingleValue<OptionType>) {
      if (newValue?.value) onChangeValueHandler(newValue.value)
   }

   return (
      <Select
         styles={scrollbarStyles}
         options={optionsForSelect}
         classNamePrefix='custom-select'
         className='custom-select__container'
         placeholder='Выберите компанию'
         captureMenuScroll={true}
         controlShouldRenderValue={true}
         value={optionsForSelect.find(opt => opt.value == currentCompany)}
         onChange={onChangeHandler}
         maxMenuHeight={300}
         noOptionsMessage={() => 'Нет совпадений'}
      />
   )
}

export { SelectCompany }
