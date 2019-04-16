import React from 'react';
import { Drawer } from 'antd';
import SiderMenu from './SiderMenu';
import { getFlatMenuKeys } from './SiderMenuUtils';
interface SiderMenuWrapperProps extends React.Props<any> {
  flatMenuKeys?: Array<string>;
  collapsed?: boolean;
  location?: Location;
  className?: string;
  isMobile?: boolean;
  onCollapse?: (collapsed) => void;
  style?: React.CSSProperties;
  menuData?: any;
  logo?: any;
  theme?: 'light' | 'dark';
}
const SiderMenuWrapper = React.memo((props: SiderMenuWrapperProps) => {
  const { isMobile, menuData, collapsed, onCollapse } = props;
  const flatMenuKeys = getFlatMenuKeys(menuData);
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <SiderMenu {...props} flatMenuKeys={flatMenuKeys} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} flatMenuKeys={flatMenuKeys} />
  );
});

export default SiderMenuWrapper;
