import React, { useState } from "react";
import styles from "./index.module.scss";

export default (props: any) => {
  const { onFileChange, list, currentFile } = props;
  return (
    <div className={styles.container}>
      {list.map((item) => {
        return (
          <div
            key={item.fileId}
            className={styles.item}
            style={
              currentFile.fileId == item.fileId
                ? { background: "#87cefa", padding: "0 10px", color: "#fff" }
                : {}
            }
            onClick={() => {
              console.log(item);

              onFileChange(item);
            }}
          >
            {item.fileName}
          </div>
        );
      })}
    </div>
  );
};
