import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const Demo = () => {
    
  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                {/* INPUT FIELD ONE */}
                <Form.Item {...restField}name={[name, 'first']} rules={[{ required: true, message: 'Missing first name' }]}>
                  <Input placeholder="First Name" />
                </Form.Item>

                {/* INPUT FIELD TWO  */}
                <Form.Item {...restField} name={[name, 'middle']} rules={[{ required: true, message: 'Missing last name' }]}>
                  <Input placeholder="Middle Name" />
                </Form.Item>

                {/* INPUT FIELD THREE  */}
                <Form.Item {...restField} name={[name, 'last']} rules={[{ required: true, message: 'Missing last name' }]}>
                  <Input placeholder="Last Name" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            {/* ADD FIELD */}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>

          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
