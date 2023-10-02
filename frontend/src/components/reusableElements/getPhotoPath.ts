import { nophoto } from './nophoto'

export const getPhotoPath = function (photoPath: string | null | Blob) {
   if (typeof photoPath === 'string') return process.env.REACT_APP_PATH_FOR_IMAGES + photoPath
   if (photoPath === null) return nophoto
   return URL.createObjectURL(photoPath)
   // return photoPath ? process.env.REACT_APP_PATH_FOR_IMAGES + photoPath : nophoto
}
