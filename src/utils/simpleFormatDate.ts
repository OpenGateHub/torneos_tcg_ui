export const simpleFormatDate = (date:string) => {
   return new Date(
        date
    ).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}