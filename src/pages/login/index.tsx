import type { LoginParams } from '@/interface/user/login';
import { FC, useRef } from "react";

import './index.less';

import { Button, Checkbox, Form, Input, theme as antTheme } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { LocaleFormatter, useLocale } from '@/locales';
import { formatSearch } from '@/utils/formatSearch';

import { loginAsync } from '../../stores/user.action';
import CaptchaImg from "@/pages/login/captcha";
import { getBase64Encode, getMd5Hash } from "@/utils/crypto";
import { history } from "@/routes/history";

const initialValues: LoginParams = {
  Username: '',
  Password: '',
  Captcha: '',
  CaptchaID: '',
};

const LoginForm: FC = () => {
  const captchaRef = useRef<{ getCaptchaID: () => string }>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();
  const { token } = antTheme.useToken();

  const onFinished = async (form: LoginParams) => {
    form.CaptchaID = captchaRef.current?.getCaptchaID() || '';
    form.Password = getMd5Hash(form.Password);
    const res = await dispatch(await loginAsync(form));
    if (!!res) {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/dashboard' };

      setTimeout(() =>{
        window.location.href = `/shuiku_admin_web${from.pathname}`;
      }, 200)
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url("https://sk.szsybh.cn/static/login/images/denglu.jpg")` }}>
      <Form<LoginParams> onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <h2>我在水源区管理后台</h2>
        <Form.Item
          name="Username"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterUsernameMessage',
              }),
            },
          ]}
        >
          <Input
            placeholder={formatMessage({
              id: 'gloabal.tips.username',
            })}
          />
        </Form.Item>
        <Form.Item
          name="Password"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterPasswordMessage',
              }),
            },
          ]}
        >
          <Input
            type="password"
            placeholder={formatMessage({
              id: 'gloabal.tips.password',
            })}
          />
        </Form.Item>
        <Form.Item
          name="Captcha"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterCaptchaMessage',
              }),
            },
          ]}
        >
          <div style={{display: 'flex'}}>
            <Input
              style={{marginRight: 20}}
              placeholder={formatMessage({
                id: 'gloabal.tips.captcha',
              })}
            />
            <CaptchaImg ref={captchaRef} />
          </div>
        </Form.Item>
        {/*<Form.Item name="remember" valuePropName="checked">*/}
        {/*  <Checkbox>*/}
        {/*    <LocaleFormatter id="gloabal.tips.rememberUser" />*/}
        {/*  </Checkbox>*/}
        {/*</Form.Item>*/}
        <Form.Item>
          <Button htmlType="submit" type="primary" className="login-page-form_button">
            <LocaleFormatter id="gloabal.tips.login" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
