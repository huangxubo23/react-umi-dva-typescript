import React, { PureComponent } from 'react';

import adminMenuContainer from '@/components/page/admin/AdminMain';
import {loading, BundleLoading} from '@/bundle';

export default class AdminMainLayout extends PureComponent {
  render() {
    console.info('==AdminMainLayout==', this.props)
    if (this.props.route && this.props.route.path == "/pc/ad") {
      return (
          <div>
              {this.props.children}
          </div>
      )
    } else {
        return (
          <div>
            <BundleLoading load={adminMenuContainer} {...this.props}>
                {this.props.children}
            </BundleLoading>
          </div>
        )
    }
  }
}
