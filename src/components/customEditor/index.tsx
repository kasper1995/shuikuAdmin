import { uploadFile } from '@/api/upload';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { Button, message } from "antd";
import React, { useEffect, useState } from 'react';
import './index.less';
import he from 'he'

interface CustomEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  value = '',
  onChange,
  placeholder = '请输入内容',
  readOnly = false,
}) => {
  // 编辑器实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  // 编辑器内容
  const [html, setHtml] = useState<string>(value);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [],
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> | any = {
    placeholder: placeholder,
    readOnly: readOnly,
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: any) {
          try {
            const res = await uploadFile(file);
            if (res) {
              insertFn(res);
            } else {
              message.error('上传失败');
            }
          } catch (error) {
            console.log(error);
            message.error('上传失败');
          }
        }
      },
      uploadVideo: {
        async customUpload(file: File, insertFn: any) {
          try {
            const res = await uploadFile(file);
            if (res) {
              insertFn(res);
            } else {
              message.error('上传失败');
            }
          } catch (error) {
            console.log(error);
            message.error('上传失败');
          }
        }
      },
    },
    htmlWhitelist: {
      img: ['src', 'alt', 'width', 'height']
    }
  };

  // 处理外部传入的value变化
  useEffect(() => {
    const formatText = he.decode(value);
    if (value !== formatText) {
      setHtml(formatText || '');
    }
  }, [value, editor]);

  // 处理内容变化
  const handleChange = (editor: IDomEditor) => {
    const newHtml = editor.getHtml();
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  // 组件销毁时销毁编辑器实例
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);

  return (
    <div className="custom-editor-wrapper">
      <div className="editor-container">
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={handleChange}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
    </div>
  );
};

export default CustomEditor;
