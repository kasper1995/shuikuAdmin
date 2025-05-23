import * as XLSX from 'xlsx';

export interface ImportConfig {
  headers: string[];
  requiredFields: string[];
  defaultValues?: Record<string, any>;
  fieldMapping?: Record<string, string>;
}

export interface ImportResult {
  success: boolean;
  data: any[];
  message?: string;
}

export const importExcel = (file: File, config: ImportConfig): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        if (jsonData.length < 2) {
          resolve({
            success: false,
            data: [],
            message: '文件内容为空'
          });
          return;
        }

        const headers = jsonData[0];
        if (!config.headers.every((header, index) => headers[index] === header)) {
          resolve({
            success: false,
            data: [],
            message: '文件格式不正确，请检查表头'
          });
          return;
        }

        const dataRows = jsonData.slice(1).filter(row => row.length > 0);
        const result = dataRows.map((row: any) => {
          const item: Record<string, any> = { ...config.defaultValues };

          // 使用字段映射转换数据
          config.headers.forEach((header, index) => {
            const fieldName = config.fieldMapping?.[header] || header;
            item[fieldName] = row[index];
          });
          // 验证必填字段
          const missingFields = config.requiredFields.filter(field => !item[field]);
          if (missingFields.length > 0) {
            throw new Error(`缺少必填字段: ${missingFields.join(', ')}`);
          }

          return item;
        });
        resolve({
          success: true,
          data: result
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          message: error instanceof Error ? error.message : '文件解析失败'
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
};
