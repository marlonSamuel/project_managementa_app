import { LoadingOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { IProject } from '../../interfaces/IProject';
import { useContext, useEffect, useState } from 'react';
import { UIContext } from '../../context/UIContext';
import { ProjectContext } from '../../context/project/ProjectContext';


interface IForm {
  visible: boolean,
  onFinish: (success: boolean)=> void,
  formData: IProject
}

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

export const CreateOrEdit = ({ visible, onFinish, formData }: IForm) => {

  const [form] = Form.useForm();
  const [title, setTitle] = useState('Nuevo registro');
  const {loading} = useContext(UIContext);
  const {create,update} = useContext(ProjectContext);

  //evaluando para setear el titulo y la data a editar
  useEffect(() => {
    form.setFieldsValue(formData);
    setTitle( formData.id > 0 ? 'Editar registro '+formData.name: 'Nuevo registro');
  }, [formData])
  
  const onCreate = async(values: any) => {
    if(formData.id == 0){
        create(values);
        onReturn();
     //const resp = await create(values);
     //if(resp) onFinish(true);
    }else{
      values = {
        ...values,
        id: formData.id,
        status: formData.status,
        enviroment: formData.enviroment
      }
      update(values);
      onReturn()
     //const resp = await update(values);
     //if(resp) onFinish(true);
    }
  }
  
  //volver
  const onReturn = () => {
    form.resetFields();
    onFinish(false);
  }

  //pre validación antes de en enviar.
  const validate = () => {
    form.validateFields().then((values) => {
        //form.resetFields();
        onCreate(values);
    }).catch(e=>{

    });
  }

  return (
      <Modal
        open={visible}
        forceRender
        title={title}
        footer={[
          <Spin key="spin" spinning={loading} size="large" tip="cargando...">
            <Button key="cancel" size='small' onClick={onReturn} icon={<UndoOutlined/>} type='primary' danger>
                  Volver
            </Button>,
            <Button key="save" size='small' onClick={validate} icon={<SaveOutlined/>} type='primary'>
              Guardar 
            </Button>,
          </Spin>
        ]}
        onCancel={onReturn}
        onOk={validate}
      >
      
        <Form
          form={form}
          key="form"
          layout="vertical"
          name="form_in_modal"
          size='small'
        >
            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 24}}>
                    <Form.Item
                        name="name"
                        key="name"
                        label="Nombre"
                        rules={[
                        {
                            required: true,
                            message: 'el campo nombre es requerido!',
                        },
                        ]}
                    >
                <Input name='name' />
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 24}}>
                <Form.Item
                    name="description"
                    key="description"
                    label="Descripción"
                    rules={[
                    {
                        required: true,
                        message: 'el campo descripción es requerido!',
                    },
                    ]}
                >
                    <TextArea rows={2} />
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                <Form.Item
                      name="start_date"
                      key="start_date"
                      label="Fecha de inicio"
                      rules={[
                        {
                          required: true,
                          message: 'el campo fecha de inicio es requerido!',
                        },
                      ]}
                    >
                      <Input type='date' name='start_date' />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 12}}>
                <Form.Item
                      name="end_date"
                      key="end_date"
                      label="Fecha de final"
                      rules={[
                        {
                          required: true,
                          message: 'el campo fecha de inicio es fin!',
                        },
                      ]}
                    >
                      <Input type='date' name='_end_date' />
                  </Form.Item>
                </Col>
            </Row>
            

          
        </Form>
      
      </Modal>
  )
}
