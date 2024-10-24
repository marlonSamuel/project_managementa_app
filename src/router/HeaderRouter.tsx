import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { IndexPage } from '../pages/projects/IndexPage'
import { Index } from '../pages/dashboard/Index'
import { SubItem } from '../pages/projects/SubItem'
import { TaskMainProvider } from '../pages/projects/milestones/tasks/TaskMainProvider'
import { TestScenarieIndex } from '../pages/projects/testplans/testscenaries/TestScenarieIndex'
import { UserIndex } from '../pages/users/UserIndex'
import { DefectIndex } from '../pages/projects/testplans/testscenaries/testcases/defects/DefectIndex'
import { TestPlanIndex } from '../pages/projects/testplans/TestPlanIndex'
import { UpdatePassword } from '../pages/users/UpdatePassword'

export const HeaderRouter = () => {

        return (
            <Routes>
                <Route path="/" element={<Index/>}></Route>
                <Route path="/projects" element={<IndexPage/>}></Route>
                <Route path="/projects/subitems" element={<SubItem/>}></Route>
                <Route path="/tasks" element={<TaskMainProvider/>}></Route>
                <Route path="/tasks/:milestone_id" element={<TaskMainProvider/>}></Route>
                <Route path="/testscenaries/:testplan_id" element={<TestScenarieIndex/>}></Route>
                <Route path="/bugs" element={<DefectIndex testcase={null} />}></Route>
                <Route path="/test-plan" element={<TestPlanIndex/>}></Route>
                <Route path="/users" element={<UserIndex/>}></Route>
                <Route path="/perfil" element={<UpdatePassword/>}></Route>
                <Route path="*" element={<Navigate to ="/login" />}/>
            </Routes>
        )
}