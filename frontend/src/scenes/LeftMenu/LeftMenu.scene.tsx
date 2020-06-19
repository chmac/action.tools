import { Drawer } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store";
import { toggleIsOpen } from "./LeftMenu.state";

const LeftMenu = () => {
  const isOpen = useSelector((state: AppState) => state.LeftMenu.isOpen);
  const dispatch: AppDispatch = useDispatch();

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={() => dispatch(toggleIsOpen())}
    >
      <ul>
        <li>item</li>
        <li>item</li>
        <li>item</li>
        <li>item</li>
      </ul>
    </Drawer>
  );
};

export default LeftMenu;
