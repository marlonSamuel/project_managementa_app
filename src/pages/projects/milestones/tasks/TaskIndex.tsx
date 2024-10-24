import React, { useContext, useEffect, useState } from 'react'
import { UIContext } from '../../../../context/UIContext';
import { ProjectContext } from '../../../../context/project/ProjectContext';
import { CalendarOutlined, CiCircleFilled, DeleteOutlined, EditOutlined, EyeOutlined, FileOutlined, HomeOutlined, PlusSquareOutlined, PlusSquareTwoTone, UserOutlined } from '@ant-design/icons';
import { BreadCrubPage } from '../../../shared/BreadCrubPage';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Col, Divider, Drawer, FloatButton, Modal, Row, Tooltip } from 'antd';
import { ITask } from '../../../../interfaces/IApp';
import Title from 'antd/es/typography/Title';
import { useParams } from 'react-router-dom';
import { useTask } from '../../../../hooks/useTask';
import { NoteIndex } from './notes/NoteIndex';
import { SubTaskList } from './SubTaskList';
import { CreateOrEdit } from './CreateOrEdit';
import { _action, TaskContext } from '../../../../context/task/TaskContext';
import { FilterTask } from './FilterTask';
import { AuthContext } from '../../../../context/auth/AuthContext';
import Swal from 'sweetalert2';
import { useMilestone } from '../../../../hooks/useMilestone';


export const TaskIndex = () => {

    const { milestone_id } = useParams();
    const {project} = useContext(ProjectContext);
    const {setRoutesBC} = useContext(UIContext);
    const {setAction, action, update, setItems: setTasks, remove} = useContext(TaskContext);
    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const {user} = useContext(AuthContext);

    const [items, setItems] = useState<any>({
        "pendientes": [] as ITask[],
        "en progreso": [] as ITask[],
        "completadas": [] as ITask[],
        "detenidas": [] as ITask[]
    })

    const {items: tasks, getByMilestone,task, setTask, getAll} = useContext(TaskContext);
    const {item: milestone, getById} = useMilestone();

    useEffect(() => {
      if(milestone_id){
        getByMilestone(parseInt(milestone_id))
        getById(parseInt(milestone_id))
      }else{
        getAll()
      } 
    }, [milestone_id])

    useEffect(() => {
        if(action === _action.LIST_TASK) setOpenSub(false);
      }, [action])

    useEffect(() => {
      setItems({
        "pendientes": tasks.filter(x=>x.status === 'p'),
        "en progreso": tasks.filter(x=>x.status === 'i'),
        "completadas": tasks.filter(x=>x.status === 'c'),
        "detenidas": tasks.filter(x=>x.status === 's')
      })
    }, [tasks])
    
    

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
    
        // Si no se mueve a un nuevo destino, no hacemos nada
        if (!destination) {
          return;
        }
    
        // Si el lugar de origen y destino es el mismo, no hacemos nada
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
          return;
        }

        const _task = tasks.find(x=>x.id === parseInt(result.draggableId));
        
        const status = destination.droppableId === 'pendientes' ? 'p' 
        : (destination.droppableId === 'en progreso' ? 'i' 
        : (destination.droppableId === 'detenidas' ? 's' : 'c'));

        if(_task){
            _task.status = status;
            const updatedTasks = tasks.map((task) =>
                task.id === _task.id ? { ...task, status } : task
            );
            setTasks(updatedTasks)

            update(_task);
        }        
    };

    useEffect(()=>{
        setRoutesBC([
            {path: '/projects', key: 'project',name: 'Proyectos',last: false, icon: <HomeOutlined />},
            {path: '/projects/subitems', key: 'project-name', name: project?.name!, last: false, icon: <FileOutlined />},
            {path: '#', key: 'hito', name: 'Hito', last: true, icon: <FileOutlined />},
        ])
    },[]);

    const showDrawer = (task: ITask) => {
        setTask(task)
        setOpen(true);
      };
    
    const onClose = () => {
        setOpen(false);
    };

    const showSub = (task: ITask | undefined, action = _action.NEW_TASK) => {
        setTask(task)
        setOpenSub(true);
        setAction(action);
    };
    
    const onCloseSub = () => {
        setOpenSub(false);
    };

      //función para remover registro
    const removeItem = (record:ITask) => {
      setAction(_action.REMOVE_TASK);
      Swal.fire({
        title: 'Esta seguro de eliminar tarea '+record.name+'? ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then(async(result) => {
        if(result.isConfirmed){
          await remove(record);
        }
      })
    }

  return (
    <div>
        <Drawer width={900} title={"Notas y comentarios "+task?.name} onClose={onClose} open={open}>
            <NoteIndex />
        </Drawer>
        <Modal footer={false} title={task ? "Agregar sub tareas "+task?.name : "Agregar nueva tarea"} width={1400} open={openSub} onOk={onCloseSub} onCancel={onCloseSub}>
            <CreateOrEdit />
            <SubTaskList />
        </Modal>
        {
          milestone_id && 
          <>
            <BreadCrubPage />
            <Title level={5}>PROYECTO: {project?.name}</Title>
            <Title style={{margin: 0}}  level={5}>HITO: {milestone?.name}</Title>
          </>
          
        }
        
        <Title level={2}>LISTA DE TAREAS</Title>
        <Divider style={{  borderColor: '#1677ff' }}></Divider>
      
        <FilterTask />
        
        <DragDropContext onDragEnd={onDragEnd}>
      <Row gutter={16}>
        {Object.keys(items).map((columnId) => (
          <Col key={columnId} xs={{span: 24}} lg={{span: 6}}style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h3>{columnId.toUpperCase()} ({items[columnId].length + '/'+tasks.length})</h3>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{
                    flexGrow: 1, // Hace que el contenido ocupe todo el espacio disponible
                    minHeight: '100%', // Asegura que abarque la altura completa
                    padding: '16px',
                    backgroundColor: columnId === 'pendientes' ? 'lightgray' : (columnId === 'en progreso' ? '#fffec8' : ( columnId=== 'detenidas' ? '#FF7F7F' : '#addfad')),
                    border: '1px dashed grey',
                    overflowY: 'auto', // Si el contenido excede, permite desplazamiento vertical
                  }}>
                  
                  
                  {items[columnId].map((task:ITask, index : any) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card style={{ marginBottom: 8 }}  actions={[
                                <Tooltip title="ver o editar tarea"><EyeOutlined onClick={() => showSub(task, _action.EDIT_TASK)} style={{color: 'blue', fontSize: '20px'}} key="edit" /></Tooltip>,
                                
                                  user?.role === 'admin' && 
                                    <Tooltip title="eliminar tarea"><DeleteOutlined onClick={() => removeItem(task)} style={{color: 'red', fontSize: '20px'}} key="setting" /></Tooltip>,
                                
                                <Tooltip title="Agregar subtarea"><PlusSquareOutlined onClick={() => showSub(task, _action.NEW_SUB_TASK)} style={{color: 'green', fontSize: '20px'}} key="subtask" /></Tooltip>,
                                <Tooltip title="Agregar notas"><FileOutlined onClick={() => showDrawer(task)} key="setting" style={{color: 'gray', fontSize: '20px'}} /></Tooltip>
                            ]}>
                                    <p><b>{task.name}</b></p>
                                    <p><CiCircleFilled style={{color: task.status==='p' ? 'gray' : (task.status === 'i' ? 'yellow' : ( task.status === 's' ? 'red' : 'green'))}} /> 
                                    &nbsp;{task.status==='p' ? 'pendiente' : (task.status === 'i' ? 'en progreso' : (task.status === 's' ? 'detenida':'completada'))}
                                    </p>
                                    <p><UserOutlined /> {task.assignedTo?.first_name+' '+task.assignedTo?.last_name} </p>
                                    <p><CalendarOutlined /> {task.start_date}     /    <CalendarOutlined />  {task.end_date} </p>   
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Col>
        ))}
      </Row>
    </DragDropContext>

    <>
    {
      milestone_id &&
      <FloatButton
        shape="square"
        onClick={()=>showSub(undefined, _action.NEW_TASK)}
        type="primary"
        style={{ insetInlineStart: 100 }}
        icon={<PlusSquareTwoTone />}
      />
    }
    
  </>

    </div>
  )
}
