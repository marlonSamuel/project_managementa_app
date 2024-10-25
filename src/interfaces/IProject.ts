import { IIntegration, IWorkflowJob } from "./IApp"

export interface IProject {
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    status?: string
    enviroment?: string
    repository_name: string
    url_repository: string
    createdAt?: string
    updatedAt?: string
    integrations?: IIntegration[]
    workflow_jobs?: IWorkflowJob[]
}