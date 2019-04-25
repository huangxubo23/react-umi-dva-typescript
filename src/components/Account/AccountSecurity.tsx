import React, { PureComponent } from 'react';
import classNames from 'classnames';

import styles from './AccountSecurity.less';

export default class AccountSecurity extends PureComponent {
  render() {
    return (
      <div className={styles.accountSecurity}>
        <div className={styles.listCard}>
          <div className="flex-1">手机</div>
          <div className={classNames('flex-3', styles.content)}>可以用作登录、找回密码及其他安全保护</div>
          <div className="flex-1">修改</div>
        </div>
        <div className={styles.listCard}>
          <div className="flex-1">手机</div>
          <div className={classNames('flex-3', styles.content)}>可以用作登录、找回密码及其他安全保护</div>
          <div className="flex-1">修改</div>
        </div>
      </div>
    )
  }
}
