import React, { useState, useEffect } from "react";
import { createStyles, Theme, makeStyles, Typography } from "@material-ui/core";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";
import listItemHandler from "mdast-util-to-hast/lib/handlers/list-item";

// import { startup } from "../../services/mdast/mdast.service";

// const re2re = new rehype2react({ createElement: React.createElement });

const processor = unified()
  .use(markdown)
  .use(remark2rehype, {
    handlers: {
      // listItem: (...args: any[]) => {
      listItem: (helpers: any, node: any, parent: any) => {
        // TODO: Add an ID to each node here
        // debugger;
        // return listItemHandler(...args);
        return listItemHandler(helpers, { ...node, id: "abc123" }, parent);
      }
      // listItem: (props: any) => {
      //   debugger;
      //   return props.handlers.listItem(props);
      // }
    }
  })
  // .use(re2re);
  .use(rehype2react, {
    createElement: React.createElement,
    components: {
      input: (props: any) => {
        // debugger;
        if (props.type === "checkbox") {
          // debugger;
          const { disabled, ...rest } = props;
          return (
            <input
              {...rest}
              onChange={() => {
                console.log(rest);
                debugger;
              }}
            />
          );
        }
        return <input {...props} />;
      }
    }
  });

const Actions: React.FC = () => {
  const classes = useStyles();

  const [doMd, setDoMd] = useState("");

  useEffect(() => {
    fetch("/do.md")
      .then(response => {
        return response.text();
      })
      .then(markdown => {
        setDoMd(markdown);
      });
    // startup();
  }, []);

  return (
    <div className={classes.container}>
      <Typography variant="h1">Welcome</Typography>
      <Typography>
        Edit this page in <code>frontend/src/scenes/Home/Home.scene.tsx</code>
      </Typography>
      {doMd.length > 0 ? (
        <div>{processor.processSync(doMd).contents}</div>
      ) : null}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {}
  })
);

export default Actions;
