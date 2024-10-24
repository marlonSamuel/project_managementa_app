import { DeleteOutlined, DislikeOutlined, EditOutlined, LikeOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Divider, Form, List, Tag, Timeline } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useContext, useEffect, useState } from 'react'
import { INote } from '../../../../../interfaces/IApp';
import { TaskContext } from '../../../../../context/task/TaskContext';
import { useNote } from '../../../../../hooks/useNote';
import Swal from 'sweetalert2';
import moment from 'moment';


const initial_item : INote[] = []

export const NoteIndex = () => {
    const [form] = Form.useForm();
    const {items, getAll, create, update, remove} = useNote();
    const {task} = useContext(TaskContext);
    const [note, setNote] = useState<INote | null>(null);

    useEffect(() => {
      getAll(task?.id!)
    }, [task])
    
    
  //pre validación antes de en enviar.
  const validate = () => {
    form.validateFields().then(async(values) => {
       values.task_id = task!.id
       const r = !note ? await create(values) : update({...values, id: note.id});
       if(r) {
        getAll(values.task_id); form.resetFields()
        setNote(null);
      };
       
    }).catch(e=>{
      console.log(e)
    });
  }

  const edit = (values: INote) => {
    form.setFieldsValue(values);
    setNote(values);
  }

  
  //función para remover registro
  const removeItem = (record:INote) => {
    Swal.fire({
      title: 'Esta seguro de eliminar comentario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(async(result) => {
      if(result.isConfirmed){
        const r = await remove(record.id);
        if(r) getAll(record.task_id);
      }
    })
  }

  
  return (
    <div>
        <Form
          form={form}
          key="form"
          layout="vertical"
          name="form_in_modal"
          size='small'
        >
          <Form.Item
            name="description"
            key="description"
            label="Deje un comentario"
            rules={[
              {
                required: true,
                message: 'La nota o comentario no puede ser vacío',
              },
            ]}
          >
            <TextArea name='description' rows={4} />
          </Form.Item>
          <Button
                key="save"
                size='small'
                onClick={validate}
                icon={<SendOutlined />}
                type='primary'
                style={{ float: 'right' }} // Aquí usamos float para alinear a la derecha
            >
                Enviar
            </Button>
        </Form>
        <Divider></Divider>

        <List
            itemLayout="vertical"
            size="large"
            dataSource={items}
            renderItem={(item) => (
            <List.Item
                key={item.created_by}
                actions={[
                    <EditOutlined onClick={()=>edit(item)} />,
                    <DeleteOutlined onClick={()=>removeItem(item)}/>,
                ]}
            >
                <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.created_by}
                    description={moment( item.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                />
                {item.description}
            </List.Item>
            )}
  />
    </div>
  )
}
