import { Outlet } from 'react-router-dom'

import { Header } from './Header'

const AdminLayout = () => {

   return (
      <>
         <Header />
         <main style={{ padding: '25px 0px 35px 0px' }}>
            <div className={`main__container`} style={{ maxWidth: '1000px' }}>
               <Outlet />
            </div>
         </main>
      </>
   )
}

export { AdminLayout }
