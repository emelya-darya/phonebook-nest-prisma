// useLayoutEffect - эффект выполнится без отрисовки на экране
import React from 'react'

const queries = ['(max-width: 1199px)', '(max-width: 992px)', '(max-width: 768px)', '(max-width: 576px)', '(max-width: 400px)']

type ReturnType = {
   less1200: boolean
   less992: boolean
   less768: boolean
   less576: boolean
   less400: boolean
}

const useMatchMedia = (): ReturnType => {
   const mediaQueryLists = queries.map(query => matchMedia(query))

   const getValues = () => mediaQueryLists.map(mql => mql.matches)

   const [values, setValues] = React.useState(getValues())

   React.useLayoutEffect(() => {
      const handler = () => {
         setValues(getValues())
         //console.log(values)
      }

      mediaQueryLists.forEach(mql => mql.addEventListener('change', handler))

      return () => {
         mediaQueryLists.forEach(mql => mql.removeEventListener('change', handler))
      }
   }, [])

   return {
      less1200: values[0],
      less992: values[1],
      less768: values[2],
      less576: values[3],
      less400: values[4],
   }

//    return ['less1200', 'less992', 'less768', 'less576', 'less400'].reduce(
//       (acc, curr, idx) => ({
//          ...acc,
//          [curr]: values[idx],
//       }),
//       {}
//    )
}

export { useMatchMedia }
