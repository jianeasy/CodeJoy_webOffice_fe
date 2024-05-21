import React, { Fragment } from "react";
import styles from "./index.module.scss";
import { Form, Input, Button } from "antd";
export default (props: any) => {
  const {
    FormItems,
    onSubmit,
    formObj,
    onReset,
    onTableSubmit,
    isTable,
    addTextArea,
  } = props;

  return (
    <Fragment>
      <div className={styles.container}>
        {/* <Form labelCol={{ span: 12 }} labelAlign="left" form={formObj}>
          {FormItems.map(
            (item: { label: any; name: any; value: any; type: any }, i) => {
              const { label, name, value, type } = item;
              return (
                <Form.Item key={i} label={label} name={label}>
                  <Input></Input>
                </Form.Item>
              );
            }
          )}
        </Form> */}
        {/* <Button type="primary" onClick={onSubmit}>
        提交
      </Button> */}
        {"  "}
        {/* <Button onClick={onReset}>重置</Button> */}
        {"  "}
        {isTable ? (
          <Button type="primary" onClick={onTableSubmit}>
            表格提交
          </Button>
        ) : (
          ""
        )}
        <Button onClick={addTextArea}>添加公文域</Button>
      </div>
    </Fragment>
  );
};
