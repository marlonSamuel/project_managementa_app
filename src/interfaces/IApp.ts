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