import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

interface SiderMenuProps extends React.Props<any> {
  menuData?: Array<{ key: string, path: string }>;
  logo?: any;
  collapsed?: boolean;
  onCollapse?: (collapsed) => void;
  theme?: 'light' | 'dark';
  fixSiderbar?: string;
  location?: any;
  flatMenuKeys: Array<string>;
}

interface SiderMenuState {
  openKeys?: Array<{ key: string, path: string }>;
}

export default class SiderMenu extends PureComponent<SiderMenuProps, SiderMenuState> {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme, location, flatMenuKeys } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    return (
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>达人创作平台</h1>
          </Link>
        </div>
        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            location={location}
            flatMenuKeys={flatMenuKeys}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%', background: '#ffffff' }}
            {...defaultProps}
          />
        </Suspense>
      </Sider>
    );
  }
}
