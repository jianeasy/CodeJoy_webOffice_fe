import React from "react";
import styles from "./index.module.scss";
import { Form, Input } from "antd";
import data from "./data";
export default (props: any) => {
  const { FormItems } = props;

  return (
    <div className={styles.container}>
      <Form>
        {FormItems.map((item: { label: any; name: any; value: any; type: any; }) => {
          const { label, name, value, type } = item;
          return type === "table" ? null : (
            <Form.Item label={label} name={label}>
              <Input></Input>
            </Form.Item>
          );
        })}
      </Form>
    </div>
  );
};
