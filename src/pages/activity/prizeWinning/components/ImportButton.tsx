import { modifyPrizeWinning, queryPrizeWinning } from '@/api/activity/prizeWinning';
import { PrizeWinningRecord } from '@/interface/activity/prizeWinning';
import { importExcel } from '@/utils/importExcel';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tabs, message } from 'antd';
import { useState } from 'react';

interface ImportButtonProps {
  onSuccess: () => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ onSuccess, totalCount }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [successList, setSuccessList] = useState<any[]>([]);
  const [failList, setFailList] = useState<any[]>([]);
  const expressCompanyOptions = [
    { value: 'shunfeng', label: '顺丰' },
    { value: 'zhongtong', label: '中通' },
    { value: 'yuantong', label: '圆通' },
    { value: 'shentong', label: '申通' },
    { value: 'yunda', label: '韵达' },
  ];
  const importConfig = {
    headers: [
      'ID',
      '抽奖ID',
      '用户ID',
      '奖品ID',
      '奖品名称',
      '状态',
      '收货人',
      '联系电话',
      '收货地址',
      '快递单号',
      '快递公司',
      '发货状态',
      '创建时间'
    ],
    requiredFields: [
      'ID',
      '联系电话',
      // '快递单号',
      // '快递公司'
    ],
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await importExcel(file, importConfig);
      if (result.success) {
        // 获取导入数据的数量
        const importCount = result.data.length;
        setUploadCount(importCount);
        setCurrentCount(0);

        // 获取现有数据
        const existingData = await queryPrizeWinning({
          Index: 1,
          PageCount: totalCount,
        });

        if (existingData.Code === 0) {
          const existingList = existingData.Data.List;
          const successData: any[] = [];
          const failData: any[] = [];

          // 校验数据
          result.data.forEach((item: any) => {
            const existingItem = existingList.find(
              (existing: PrizeWinningRecord) => {
                return existing.ID === item.ID
              }
            );
            if (existingItem && existingItem.DeliveryPhone == item.联系电话) {
              successData.push({
                ID: item.ID,
                DeliveryPhone: item.联系电话,
                ExpressNo: item.快递单号,
                ExpressCompany: item.快递公司,
              });
            } else {
              console.log('fail',item, existingItem);
              failData.push({
                ID: item.ID,
                DeliveryPhone: item.联系电话,
                ExpressNo: item.快递单号,
                ExpressCompany: item.快递公司,
                reason: existingItem ? `电话号码不匹配:(${item.联系电话}/${existingItem.DeliveryPhone})` : '记录不存在',
              });
            }
          });

          setSuccessList(successData);
          setFailList(failData);
          setModalVisible(true);
        } else {
          message.error('获取现有数据失败');
        }
      } else {
        message.error(result.message || '文件解析失败');
      }
    } catch (error) {
      message.error('文件解析失败');
    }
    return false;
  };
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const handleConfirmUpload = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < successList.length; i++) {
        const item = successList[i];
        await delay(1000); // 模拟延时
        await modifyPrizeWinning({
          ID: item.ID,
          ExpressNo: `${item.ExpressNo}`,
          ExpressCompany: item.ExpressCompany,
          DeliveryStatus: 2,
        });
        setCurrentCount(i + 1);
      }
      message.success('导入完成');
      setModalVisible(false);
      onSuccess();
    } catch (error) {
      message.error('导入失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: '联系电话',
      dataIndex: 'DeliveryPhone',
      key: 'DeliveryPhone',
    },
    {
      title: '快递单号',
      dataIndex: 'ExpressNo',
      key: 'ExpressNo',
    },
    {
      title: '快递公司',
      dataIndex: 'ExpressCompany',
      key: 'ExpressCompany',
    },
  ];

  const failColumns = [
    ...columns,
    {
      title: '失败原因',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  return (
    <>
      <Button
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.xlsx,.xls';
          input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
              handleFileUpload(file);
            }
          };
          input.click();
        }}
      >
        导入
      </Button>

      <Modal
        title="确认导入"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmUpload}
            loading={loading}
          >
            {loading ? `上传中 ${currentCount}/${uploadCount}` : '确认导入'}
          </Button>,
        ]}
        width={800}
      >
        <Tabs
          items={[
            {
              key: 'success',
              label: '成功列表',
              children: (
                <Table
                  columns={columns}
                  dataSource={successList}
                  rowKey="ID"
                  pagination={false}
                  scroll={{ y: 400 }}
                />
              ),
            },
            {
              key: 'fail',
              label: '失败列表',
              children: (
                <Table
                  columns={failColumns}
                  dataSource={failList}
                  rowKey="ID"
                  pagination={false}
                  scroll={{ y: 400 }}
                />
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default ImportButton;
