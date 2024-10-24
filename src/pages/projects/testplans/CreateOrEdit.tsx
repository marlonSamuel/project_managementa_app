import { LoadingOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { _IUser, ITestPlan } from '../../../interfaces/IApp';
import { useTestPlan } from '../../../hooks/useTestPlan';
import TextArea from 'antd/es/input/TextArea';
import { ProjectContext } from '../../../context/project/ProjectContext';
import { useUser } from '../../../hooks/useUser';
import { UIContext } from '../../../context/UIContext';
const { Option } = Select;


interface IForm {
  visible: boolean,
  onFinish: (success: boolean)=> void,
  formData: ITestPlan
}

export const CreateOrEdit = ({ visible, onFinish, formData }: IForm) => {

  const [form] = Form.useForm();
  const {create, update} = useTestPlan();
  const [title, setTitle] = useState('Nuevo registro');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const {loading} = useContext(UIContext);
  const {project} = useContext(ProjectContext);
  const {items, getAll} = useUser();

  useEffect(() => {
        getAll();
  }, [])
  

  //evaluando para setear el titulo y la data a editar
  useEffect(() => {
    form.setFieldsValue(formData);
    setTitle( formData.id! > 0 ? 'Editar registro '+formData.name: 'Nuevo registro');
  }, [formData])
  
  const onCreate = async(values: ITestPlan) => {
    setConfirmLoading(true);
    if(formData.id == 0){
        values.project_id = project!.id;
        const resp = await create(values);
        if(resp) onFinish(true);
    }else{
      values = {
        ...values,
        status: formData.status,
        id: formData.id
      }
     const resp = await update(values);
     if(resp) onFinish(true);
    }
    setConfirmLoading(false);
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
        width={1000}
        forceRender
        title={title}
        footer={[
          <Spin key="spin" spinning={confirmLoading} size="large" tip="cargando...">
            <Button key="cancel" size='small' onClick={onReturn} icon={<UndoOutlined/>} type='primary' danger>
                  Volver
            </Button>,
            <Button key="save" size='small' onClick={validate} icon={<SaveOutlined/>} type='primary'>
              Guardar
            </Button>,
          </Spin>
        ]}
        onCancel={()=>onFinish(false)}
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
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 24}}>
                <Form.Item
                      name="assigned_to"
                      key="assigned_to"
                      label="Asignado a"
                      rules={[
                        {
                          required: true,
                          message: 'asignar usuario es requerido!',
                        },
                      ]}
                    >
                      <Select
                                key='s1'
                                placeholder="Asignado a"
                                loading={loading}
                                showSearch
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                allowClear
                                >
                                {
                                    items.map((c: _IUser) => (
                                    <Option key={c.id} value={c.id}>{c.first_name+' '+c.last_name}</Option>
                                    ))
                                }
                    </Select>
                  </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col className="gutter-row" xs={{span: 24}} lg={{span: 24}}>
                <Form.Item
                    name="acceptance_criteria"
                    key="acceptance_criteria"
                    label="Criterios de acceptación"
                    rules={[
                    {
                        required: true,
                        message: 'el campo criterios de aceptación es requerido!',
                    },
                    ]}
                >
                    <TextArea rows={3} />
                </Form.Item>
                </Col>
            </Row>


        </Form>
      
      </Modal>
  )
}
