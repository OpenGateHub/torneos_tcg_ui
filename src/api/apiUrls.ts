export const apiUrls = {
    tournaments: {
        base: '/tournaments',
    },
    users: {
        mutation: (id:number) => `/users/${id}`
    }
}