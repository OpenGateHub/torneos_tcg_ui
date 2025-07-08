export const apiUrls = {
    tournaments: {
        base: '/tournaments',
    },
    users: {
        mutation: (id: number) => `/users/${id}`
    },
    rounds: {
        open: (id: number, numberRound: number) => `/torneos/${id}/ronda/${numberRound}`
    },
    leagues: {
        base: '/leagues',
        mutation: (id: number) => `/leagues/${id}`,
        details: (id: number) => `/leagues/${id}`
    },
    store: {
        base: '/companies',
        mutation: (id: number) => `/companies/${id}`,
    }
}