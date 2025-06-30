export type LeagueType = {
    id: number
    name: string
    description: string
    startDate: string
    endDate: string
    companyId: number
    company:{
        id:number
        name:string
    }
}