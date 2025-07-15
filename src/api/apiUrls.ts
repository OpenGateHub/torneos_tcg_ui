export const apiUrls = {
    general:{
        public_ranking:'/general-ranking'
    },
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
        details: (id: number) => `/leagues/${id}`,
        ranking: (id: number) => `/leagues/${id}/table`
    },
    store: {
        base: '/companies',
        mutation: (id: number) => `/companies/${id}`,
    }
}