import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

import Editor from '@/components/Editor/Editor';

interface ProductProps extends React.Props<any> {
  product?: any;
  dispatch?: Function;
}

@connect((state) => ({
  product: state.product,
}))
export default class Product extends PureComponent<ProductProps> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'product/getProductDetail',
    //   payload: {
    //     callback: (data) => {
    //       console.info('==getProductDetail==', data);
    //     },
    //   },
    // });
  }
  render() {
    const { product } = this.props;
    return (
      <div>
        <Editor />
      </div>
    );
  }
}
