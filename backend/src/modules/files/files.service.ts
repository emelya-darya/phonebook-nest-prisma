import { Injectable } from '@nestjs/common'
import { HttpException, HttpStatus } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'
import * as Sharp from 'sharp'

@Injectable()
export class FilesService {
   async imageHandler(
      photoFileFromReq: any,
      photoValueFromFormData: string | null | undefined,
      foldersSeqToSave: Array<string>
   ): Promise<string | null | undefined> {
      //    const { photo } = req.body

      const photoVal = photoValueFromFormData
      const photoFile = photoFileFromReq

      if (!photoFile) {
         //* если в запросе нет прикрепленных файлов и явно указано значение photo: null, то возвращаем null
         if (String(photoVal) === 'null') return null

         //*если нет прикрепленных файлов и в formData undefined  - возвращаем undefined и в базе значение не перезапишется
         if (String(photoVal) === 'undefined') return undefined

         //* если нужно обновить пользователя, но не трогать фото, то в реквесте присылаем строку с путем до фото, возвращаем эту же строку без изменений
         if (typeof photoVal === 'string') return photoVal
      }

      if (!photoFile?.originalname?.match(/\.(jpg|jpeg|png|webp)$/)) return undefined

      //! если в FormData есть приложенные файлы изображений и загрузка и оптимизация изображения прошли успешно, то возвращаем путь до новой аватарки
      let photoPath = undefined
      try {
         // сначала получаем и кладем оригинальное изображение в папку static/phonebook
         const pathToNoOptImg = path.resolve(__dirname, '..', '..', 'static', ...foldersSeqToSave)

         const fileNameForNoOptImg = uuid.v4() + '.png'

         if (!fs.existsSync(pathToNoOptImg)) fs.mkdirSync(pathToNoOptImg, { recursive: true })

         const fullPathToNoOptImg = path.join(pathToNoOptImg, fileNameForNoOptImg)
         fs.writeFileSync(fullPathToNoOptImg, photoFile.buffer)

         // await photoFile.mv(pathToNoOptImg)

         const fileNameForOptImg = uuid.v4() + '.png'
         const pathToOptImg = path.resolve(__dirname, '..', '..', 'static', ...foldersSeqToSave)

         const fullPathToOptImg = path.join(pathToOptImg, fileNameForOptImg)

         // потом минимизуруем и кладем туда же, а неоптимизированное удаляем
         Sharp(fullPathToNoOptImg)
            .resize({ width: 200, height: 200 })
            .toFormat('png')
            .png({ quality: 90 })
            .toFile(fullPathToOptImg, (err, info) => {
               if (err) throw new HttpException(err.message || 'Error saving file on server', HttpStatus.INTERNAL_SERVER_ERROR)
               fs.unlink(fullPathToNoOptImg, err => {})
            })
         photoPath = path.join('/', ...foldersSeqToSave, fileNameForOptImg)
      } catch (err) {
         //   next(ApiError.internalServerError(err.message))
         throw new HttpException(err.message || 'Error saving file on server', HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return photoPath
   }
}
