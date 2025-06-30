export const apiUrls = {
    tournaments: {
        base: '/tournaments',
    },
    users: {
        mutation: (id: number) => `/users/${id}`
    },
    rounds: {
        open: (id: number, numberRound: number) => `/torneos/${id}/ronda/${numberRound}`
    }
}