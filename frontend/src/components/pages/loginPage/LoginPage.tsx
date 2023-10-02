import React from 'react'
import { Header } from './layout/Header'
import c from './loginPage.module.scss'
import { IoIosLock } from 'react-icons/io'
import { PiSignInBold } from 'react-icons/pi'
import { useForm } from 'react-hook-form'
import { Preloader } from '../../reusableElements/preloader/Preloader'
import { GlobalStateType } from '../../../store/redux/reduxStore'
import { useSelector } from 'react-redux'
import { AiFillEye, AiFillEyeInvisible, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { AuthAC } from '../../../store/redux/auth/authReducer'
import { Navigate } from 'react-router-dom'
import { Button } from '../../reusableElements/button/Button'

type LogInDataToSend = {
   login: string
   password: string
}

const LoginPage = () => {
   const {
      handleSubmit,
      register,
      formState: { errors, isDirty, isValid },
   } = useForm<LogInDataToSend>({ mode: 'onChange' })

   const dispatch = useDispatch()

   const submitHandler = function (data: LogInDataToSend) {
      dispatch(AuthAC.tryLogin({ login: data.login.trim(), password: data.password.trim() }))
   }

   const [isVisiblePassword, setIsVisiblePassword] = React.useState(false)

   const { isAuth, isInProgressCheckAuth, isInProgressLogIn } = useSelector((state: GlobalStateType) => state.forAuthData)
   const errOnLogin = useSelector((state: GlobalStateType) => state.forErrorsData.errOnLogIn)

   // React.useEffect(() => {
   //    if (!isAuth) dispatch(AuthAC.checkAuth())
   // }, [])

   if (isAuth) return <Navigate to='/admin' />
   return (
      <>
         <Header />
         <main className={c.main}>
            {isInProgressCheckAuth ? (
               <Preloader color='#2f60a5' size={150} minHeight='60vh' />
            ) : (
               <div className={c.authFormBlockWr}>
                  <IoIosLock className={c.lockIcon} />

                  <p className={c.title}>Вход в административную панель</p>

                  <form className={c.form} onSubmit={handleSubmit(submitHandler)}>
                     <div className={`${c.inputGroup} ${errors?.login ? c.withError : ''}`}>
                        <label htmlFor='login'>Логин</label>
                        <input
                           type='text'
                           id='login'
                           {...register('login', {
                              required: 'Поле обязательно для заполнения',
                           })}
                        />
                        <span className={c.spanErr}>{errors.login && (errors?.login.message || 'Поле обязательно для заполнения')}</span>
                     </div>

                     <div className={`${c.inputGroup} ${errors?.password ? c.withError : ''} ${c.passwordBlock}`}>
                        <div
                           className={c.showHidePassBtn}
                           onClick={() => {
                              setIsVisiblePassword(!isVisiblePassword)
                           }}>
                           {isVisiblePassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </div>
                        <label htmlFor='password'>Пароль</label>
                        <input
                           type={isVisiblePassword ? 'text' : 'password'}
                           id='password'
                           {...register('password', {
                              required: 'Поле обязательно для заполнения',
                           })}
                        />
                        <span className={c.spanErr}>{errors.password && (errors?.password.message || 'Поле обязательно для заполнения')}</span>
                     </div>

                     <Button
                        type='submit'
                        name='Войти'
                        Icon={PiSignInBold}
                        extraClassName={c.loginBtn}
                        isDisabled={!isValid || !isDirty}
                        isLoading={isInProgressLogIn}
                        preloaderClr='#fff'
                        onClickHandler={() => {}}
                     />

                     <div className={c.errOnLogin}>{errOnLogin}</div>
                  </form>
               </div>
            )}
         </main>
      </>
   )
}

export { LoginPage }
