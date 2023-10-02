import React from 'react'
import { useSelector } from 'react-redux'
import { GlobalStateType } from '../../store/redux/reduxStore'
import { Navigate } from 'react-router-dom'

const withAuthRedirectHOK = function <PT>(ComponentToWrap: React.FC<PT>) {
   const Wrapper = (props: PT & {}) => {
      const isAuth = useSelector((state: GlobalStateType) => state.forAuthData.isAuth)

      if (!isAuth) return <Navigate to='/login' />
      return <ComponentToWrap {...props} />
   }
   return Wrapper
}

export { withAuthRedirectHOK }
