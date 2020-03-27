import React from "react";

const Code = (props: any) => {
  if (props.children[0].substr(0, 6) === "after:") {
    return (
      <span style={{ fontWeight: "bold", color: "red" }}>
        AFTER <code {...props} />
      </span>
    );
  }
  return <code {...props} />;
};

export default Code;
