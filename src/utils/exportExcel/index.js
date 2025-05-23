import * as XLSX from 'xlsx/xlsx.mjs';

let wb; // 读取完成的数据
let rABS = false; // 是否将文件读取为二进制字符串

export default function importExcel(obj, cb) {
    // 导入
    let f = obj;
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log('reader.onload', e);
        let data = e.target.result
        if (rABS) {
            wb = XLSX.read(btoa(fixdata(data)), {  // 手动转化
                type: 'base64'
            })
        } else {
            wb = XLSX.read(data, {
                type: 'binary'
            })
        }
        let json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        cb(json)
    }
    if (rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }
}

function fixdata(data) {
    // 文件流转BinaryString
    let o = '';
    let l = 0;
    let w = 10240;
    for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}
