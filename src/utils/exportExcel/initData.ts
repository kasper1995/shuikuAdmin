export interface exportExcelDataProps {
    excelName: string; // 导出的excel名称
    excelData: {
        sheetName: string; // 工作表名称
        record: any[]; // 导出的数据
        columns: {
            title: string; // 列名
            dataIndex: string; // 列key(字段名)
        }[]; // 导出的列
    }[];
}

const initExportData = (metaData: exportExcelDataProps) => {
    const downLoadExcelOption: {
        fileName: string; // 导出的excel名称
        datas: {
            sheetData: any[];
            sheetName: string; // 工作表名称
            sheetHeader: any[];
        }[]; // 导出的数据
    } = {
        fileName: metaData.excelName,
        datas: [],
    };
    metaData.excelData.forEach((item) => {
        const headerList = {};
        item.columns.forEach((columnItem) => {
            headerList[columnItem.dataIndex] = columnItem.title;
        });
        downLoadExcelOption.datas.push({
            sheetData: [
                headerList,
                ...item.record.map((item) => {
                    const tmp = {};
                    for (let i in headerList) {
                        if (item.hasOwnProperty(i)) {
                            tmp[i] = item[i];
                        }
                    }
                    return tmp;
                }),
            ],
            sheetName: item.sheetName,
            sheetHeader: [],
        });
    });
    return downLoadExcelOption;
};

export default initExportData;
