import type { MyFormProps } from '@/components/core/form';

import { css } from '@emotion/react';

import MyButton from '@/components/basic/button';
import MyForm from '@/components/core/form';
import { useLocale } from '@/locales';
import { ForwardedRef, forwardRef, useImperativeHandle } from "react";

interface SearchProps<T> extends MyFormProps<T> {
  onSearch: (values: T) => void;
}

const BaseSearch = forwardRef(<T extends object>(props: SearchProps<T>, ref: ForwardedRef<any>) => {
  const { children, onSearch, ...rest } = props;
  const [form] = MyForm.useForm<T>();
  const { formatMessage } = useLocale();

  const onSubmit = async () => {
    const values = await form.validateFields();

    if (values) {
      onSearch(values);
    }
  };
  const handleReset = () => {
    form.resetFields();
    onSearch({});
  }
  useImperativeHandle(ref, () => ({
    resetFields: handleReset,
    getValues: () => form.getFieldsValue(),
  }));

  return (
    <div css={styles}>
      <MyForm {...rest} form={form} layout="inline">
        {children}
        <MyForm.Item>
          <MyButton type="primary" onClick={onSubmit}>
            {formatMessage({ id: 'component.search.request' })}
          </MyButton>

          <MyButton onClick={handleReset}>{formatMessage({ id: 'component.search.reset' })}</MyButton>
        </MyForm.Item>
      </MyForm>
    </div>
  );
});

const MySearch = Object.assign(BaseSearch, {
  Item: MyForm.Item,
});

export default MySearch;

const styles = css`
  //padding: 20px;
  //.ant-form-item {
  //  margin-bottom: 20px;
  //}
`;
