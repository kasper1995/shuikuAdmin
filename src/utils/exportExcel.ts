import { message } from 'antd';
import * as XLSX from 'xlsx';

interface ExportExcelProps {
  data: any[];
  fileName: string;
  sheetName?: string;
  headers?: string[];
}

interface MultiSheetExportProps {
  sheets: {
    data: any[];
    sheetName: string;
    headers?: string[];
  }[];
  fileName: string;
}

export const exportExcel = (excelData: ExportExcelProps | MultiSheetExportProps) => {
  try {
    // 创建工作簿
    const wb = XLSX.utils.book_new();

    if ('sheets' in excelData) {
      // 多sheet导出
      excelData.sheets.forEach(sheet => {
        const { data, sheetName, headers } = sheet;
        let exportData = data;
        
        if (headers) {
          exportData = data.map(item => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = item[index];
            });
            return obj;
          });
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });
    } else {
      // 单sheet导出
      const { data, fileName, sheetName = 'Sheet1', headers } = excelData;
      let exportData = data;
      
      if (headers) {
        exportData = data.map(item => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = item[index];
          });
          return obj;
        });
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    // 生成Excel文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // 创建Blob对象
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${excelData.fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success('导出成功');
  } catch (error) {
    console.error('导出Excel失败:', error);
    message.error('导出失败');
  }
};
