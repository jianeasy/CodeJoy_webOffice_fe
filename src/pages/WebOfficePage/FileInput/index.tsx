import React from "react";

export default (props:{onChange:(e:any)=>void}) => {
    const {  onChange } = props
  return (
    <React.Fragment>
      <h3>上传文件</h3>
      <input onChange={onChange} type="file" style={{ width: "100px", height: "30px" }}></input>
    </React.Fragment>
  );
};
