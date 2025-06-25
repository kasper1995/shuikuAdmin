import { apiLogin, getCaptcha } from '@/api/user.api';
import { getMd5Hash } from '@/utils/crypto';
import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
export function showLoginModal(): Promise<boolean> {
  let resolveFn: (v: boolean) => void;
  const div = document.createElement('div');
  document.body.appendChild(div);

  const LoginModal = () => {
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaId, setCaptchaId] = useState('');
    const [form] = Form.useForm();
    const fetchCaptcha = async () => {
      const res = await getCaptcha();
      if (res.Code === 0) {
        setCaptcha(res.Data.CaptchaB64);
        setCaptchaId(res.Data.CaptchaID);
      }
    };

    React.useEffect(() => {
      fetchCaptcha();
    }, []);

    const handleOk = async () => {
      try {
        setLoading(true);
        const values = await form.validateFields();
        const res = await apiLogin({
          Username: values.Username,
          Password: getMd5Hash(values.Password),
          Captcha: values.Captcha,
          CaptchaID: captchaId,
        });
        if (res.Code === 0 && res.Data.ID === 1) {
          resolveFn(true);
          setVisible(false);
        } else {
          Modal.error({ title: '登录失败', content: res.Message || '请重试' });
          fetchCaptcha();
        }
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      resolveFn(false);
      setVisible(false);
    };

    return (
      <Modal
        open={visible}
        title="账号验证"
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={() => {
          setTimeout(() => {
            ReactDOM.unmountComponentAtNode(div);
            div.remove();
          }, 300);
        }}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Username" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="Captcha" label="验证码" rules={[{ required: true, message: '请输入验证码' }]}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input style={{ flex: 1, marginRight: 8 }} />
              <img src={captcha} alt="验证码" style={{ cursor: 'pointer', height: 32 }} onClick={fetchCaptcha} />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return new Promise<boolean>(resolve => {
    resolveFn = resolve;
    // 挂载弹窗
    ReactDOM.render(<LoginModal />, div);
  });
}
