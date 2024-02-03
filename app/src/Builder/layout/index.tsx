import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import sizeStyles from "../style/size.module.css";
import colorStyles from "../style/color.module.css";
import alignStyles from "../style/align.module.css";
import positionStyles from "../style/position.module.css";
import spaceStyles from "../style/space.module.css";
import overflowStyles from "../style/overflow.module.css";
import Logo from "../header/Logo";

type LayoutProps = {
  header?: React.ReactNode;
  navBar?: React.ReactNode;
  settingBar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  header,
  navBar,
  settingBar,
  children,
  footer,
}) => (
  <Container
    fluid
    className={
      [sizeStyles.height100, overflowStyles.hide].join(" relative") + " p-0"
    }
  >
    {navBar}
    <div className="flex w-full h-full">
      <div className="flex-shrink-0">{settingBar}</div>
      <div className="flex-grow h-[calc(100%-60px)] relative">{children}</div>
    </div>

    {/*     <Row
      xs={12}
      className={[
        colorStyles.darkTheme,
        sizeStyles.height5,
        positionStyles.relative,
        positionStyles.zIndex1,
      ].join(" ")}
    >
      {footer}
    </Row> */}
  </Container>
);

export default Layout;
