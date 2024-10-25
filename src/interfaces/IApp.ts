import { IUser } from "./IAuth";
import { IProject } from "./IProject";

export interface IResponse {
    ok: boolean;
    message: string;
}

export interface IMilestone {
    id: number
    project_id: number
    name: string
    description: string
    start_date: string
    end_date: string
    status: string
    createdAt?: string
    updatedAt?: string
}

export interface ITestPlan {
    id: number
    project_id: number
    assigned_to?: number
    created_by?: number
    name: string
    description: string
    acceptance_criteria: string
    status?: string
    createdAt?: string
    updatedAt?: string
    assignedTo?: _IUser
    createdBy?: _IUser
    project?: IProject
}

export interface _IUser {
    id: number
    email: string
    password: string
    first_name: string
    last_name: string
    second_name: any
    second_last_name: any
    birthday: string
    role: string
    createdAt?: string
    updatedAt?: string
}

export interface ITask {
  id: number
  parent_id: number
  milestone_id: number
  estimated_hours: number
  hours?: number
  assigned_to?: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  createdAt?: string
  updatedAt?: string
  assignedTo?: _IUser
}

export interface INote {
    id: number
    description: string
    task_id: number
    user_id: number
    created_by: string
    createdAt: string
}

export interface ITestScenarie {
    id: number
    testplan_id: number
    name: string
    description: string
    status: string
    createdAt?: string
    updatedAt?: string
    testcases?: ITestCase[]
    testplan?: ITestPlan
}

export interface ITestCase {
    id: number
    scenario_id: number
    name: string
    description: string
    test_data: string
    status: string
    expected_result: string
    actual_result?: any
    execution_type?: string
    createdAt?: string
    updatedAt?: string
    testscenario?: ITestScenarie
}

export interface IDefect {
    id: number
    test_case_id: number
    assigned_to: number
    description: string
    status: string
    severity: string
    resolve_date?: any
    hours?: number
    createdAt?: string
    updatedAt?: string
    assigned?: _IUser
    testcase?: ITestCase
}

export interface IMetric {
    tasks: MetricTask[]
    tests: MetricTest[]
    prod: number
    dev: number
    qa: number
    pendings: number
    inprogress: number
    completed: number
  }
  
  export interface MetricTask {
    id: number
    name: string
    status: string
    enviroment: string
    total_tasks: number
    pending_tasks: number
    inprogress_tasks: number
    completed_tasks: number
    stopped_tasks: number
    total_hours: Number
  }
  
  export interface MetricTest {
    id: number
    name: string
    total_cases: number
    pending_cases: number
    success_cases: number
    fail_cases: number
    total_defects: number
    defect_hours: number
    pending_defects: number
    inprogress_defects: number
    completed_defects: number
    reopens_defects: number
  }

  export interface IWorkflowJob {
    id: number;
    name?: string;
    project_id: number;
    job_id: string;
    run_id: string;
    workflow_name?: string;
    head_branch?: string;
    run_url?: string;
    run_attempt?: number;
    node_id?: string;
    url?: string;
    html_url?: string;
    status?: string;
    conclusion?: string;
    created_at?: Date;
    started_at?: Date;
    completed_at?: Date;
    steps?: any;  // Cambiar 'any' a una estructura específica si conoces el tipo de los pasos
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IIntegration {
    id: number;                     // Identificador único de la integración
    projectId: number;             // Llave foránea que referencia a la tabla projects
    ref: string;                    // Referencia
    _before: string;                 // Estado anterior
    _after: string;                  // Estado posterior
    repositoryId: number;          // ID del repositorio
    repositoryName: string;         // Nombre del repositorio
    repositoryFullName: string;     // Nombre completo del repositorio
    pusherName: string;             // Nombre del pusher
    pusherEmail: string;            // Correo electrónico del pusher
    commitMessage: string;          // Mensaje del commit
    commitId: string;               // ID del commit
    commitTimestamp: Date;          // Fecha y hora del commit
    commitUrl: string;              // URL del commit
}

export interface IJobStep {
    name: string;
    status: 'queued' | 'in_progress' | 'completed';
    conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
    number: number;
    started_at: string; // Puedes usar Date si deseas que se convierta automáticamente a objeto Date en TypeScript
    completed_at: string;
}