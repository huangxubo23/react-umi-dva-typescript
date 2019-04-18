import React, { PureComponent } from 'react';
import { connect } from 'dva';

import ArticleForm from '@/components/Article/ArticleForm';

interface IArticleProps extends React.Props<any> {
  article?: any;
  dispatch?: Function;
}

@connect((state) => ({
  article: state.article,
}))
export default class Article extends PureComponent<IArticleProps> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    const { article } = this.props;
    console.info('==article==', article);
    return (
      <div>
        <ArticleForm />
      </div>
    );
  }
}
