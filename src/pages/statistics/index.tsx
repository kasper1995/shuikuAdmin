import { queryStatistics } from '@/api/statistics';
import DateRangePicker from '@/components/DateRangePicker';
import { exportExcel } from '@/utils/exportExcel';
import { Button, Card, Col, message, Row, Tabs } from "antd";
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface StatisticsData {
  User: {
    Time: string;
    Register: number;
    Active: number;
    Visitor: number;
  }[];
  Point: {
    Time: string;
    Add: number;
    Subtract: number;
  }[];
  TaskPoint: {
    TaskName: string;
    List: {
      Time: string;
      Point: string;
    }[];
  }[];
}

interface ApiResponse {
  Code: number;
  Data: StatisticsData;
}

const Statistics = () => {
  const [data, setData] = useState<StatisticsData>({ User: [], Point: [], TaskPoint: [] });
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(6, 'day'),
    dayjs(),
  ]);
  const [activeTab, setActiveTab] = useState('task');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryStatistics({
        StartDate: dateRange[0].format('YYYY-MM-DD'),
        EndDate: dateRange[1].format('YYYY-MM-DD'),
      });
      const response = res as unknown as ApiResponse;
      if (response.Code === 0) {
        setData(response.Data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  // 处理用户数据，将多个指标合并到一个数组中
  const userChartData = data.User.map(item => ({
    Time: item.Time,
    '注册用户': item.Register,
    '活跃用户': item.Active,
    '访客': item.Visitor,
  }));

  // 处理积分数据
  const pointChartData = data.Point.map(item => ({
    Time: item.Time,
    '积分': item.Add + item.Subtract,
  }));

  // 处理任务积分数据
  const taskPointChartData = data.TaskPoint.map(task => ({
    TaskName: task.TaskName,
    List: task.List.map(point => ({
      Time: point.Time,
      '积分': point.Point,
    })),
  }));

  const handleExport = () => {
    if (!data.TaskPoint?.length) {
      message.warning('暂无数据可导出');
      return;
    }

    // 获取所有时间点
    const allTimePoints = new Set<string>();
    data.TaskPoint.forEach(task => {
      task.List.forEach(point => {
        allTimePoints.add(point.Time);
      });
    });
    const sortedTimePoints = Array.from(allTimePoints).sort();

    // 构建积分统计数据
    const pointExportData = sortedTimePoints.map(time => {
      const row: any = { '时间': time };
      data.TaskPoint.forEach(task => {
        const point = task.List.find(p => p.Time === time);
        row[task.TaskName] = point?.Point || 0;
      });
      return row;
    });

    // 构建使用统计数据
    const usageExportData = data.User.map(item => {
      // 找到对应时间的每日签到数据
      const checkInTask = data.TaskPoint.find(task => task.TaskName === '每日签到');
      const checkInPoint = checkInTask?.List.find(p => p.Time === item.Time)?.Point || '0';
      
      // 找到对应时间的总积分数据
      const pointData = data.Point.find(p => p.Time === item.Time);
      const totalPoints = pointData ? pointData.Add + pointData.Subtract : 0;
      
      return {
        '时间': item.Time,
        '注册人数': item.Register,
        '活跃人数': item.Active,
        '打卡次数': Math.floor(Number(checkInPoint) / 10), // 将积分除以10得到打卡次数
        '获取积分': totalPoints, // 使用总积分统计中的数据
      };
    });

    // 导出Excel
    exportExcel({
      fileName: '数据统计',
      sheets: [
        {
          data: pointExportData,
          sheetName: '积分统计',
        },
        {
          data: usageExportData,
          sheetName: '使用统计',
        },
      ],
    });
  };

  return (
    <div className="p-6">
      <Card style={{ marginBottom: 8 }}>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <Button type="primary" onClick={handleExport} style={{float: 'right'}}>
          导出数据
        </Button>
      </Card>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="用户统计" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={userChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="注册用户" stroke="#8884d8" />
                <Line type="monotone" dataKey="活跃用户" stroke="#82ca9d" />
                <Line type="monotone" dataKey="访客" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={24} style={{ marginTop: 16 }}>
          <Card title="总积分统计" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={pointChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="积分" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={24} style={{ marginTop: 16 }}>
          <Card title="积分统计" loading={loading}>
            <Tabs>
              {taskPointChartData?.map(i => <Tabs.TabPane tab={i.TaskName} key={i.TaskName}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={i.List}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="积分" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Tabs.TabPane>)}
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
