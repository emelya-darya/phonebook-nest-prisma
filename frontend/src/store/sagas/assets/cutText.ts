export const cutText = function (text: string | null, maxLength: number, defaultValue: string) {
   if (!text) return defaultValue

   if (text.length > maxLength) return text.substring(0, maxLength - 3) + '...'
   else return text
}
