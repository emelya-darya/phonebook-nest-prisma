export class ResponseOk {
   private readonly data: any
   private readonly statusCode: number

   constructor(data: any) {
      this.statusCode = 200
      this.data = data
   }
}
