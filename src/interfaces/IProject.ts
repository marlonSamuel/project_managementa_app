export interface IProject {
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    status?: string
    enviroment?: string
    createdAt?: string
    updatedAt?: string
}