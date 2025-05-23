import { Button, Card, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const WechatServicePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    window.open('https://mpkf.weixin.qq.com/', '_blank');
  };

  return (
    <div className="p-6">
      <Card>
        <Result
          status="info"
          title="微信客服平台"
          subTitle="点击下方按钮跳转到微信公众平台客服系统"
          extra={
            <Button type="primary" onClick={handleRedirect}>
              立即跳转
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default WechatServicePage; 