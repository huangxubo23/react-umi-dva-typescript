import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, notification } from 'antd';
import { FormComponentProps } from "antd/lib/form/Form";

import FormBuilder from '@/components/Form/FormBuilder';
import { ICreativeArticleData } from '@/data/Taobao';

interface IArticleFormProps extends FormComponentProps {
  article?: ICreativeArticleData;
  dispatch?: Function;
}

@connect((state) => ({
  article: state.article
}))
class ArticleForm extends Component<IArticleFormProps> {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      debugger;
      if (!err) {
        const { article, dispatch } = this.props;
        const children = article.config.children;
        for (const key in values) {
          const idx = children.findIndex(item => item.name === key);
          if (idx > -1) {
            children[idx].props.value = values[key];
          }
        }
        const config = {
          ...article.config,
          children,
        }
        dispatch({
          type: 'article/update',
          payload: {
            config
          }
        });
        notification.success({
          message: '更新成功',
          description: '数据成功更新到State',
        });
      }
    });
  }

  render() {
    const { article, form } = this.props;
    console.info('==ArticleForm==', article);

    return (
      <Card bordered={false}>
        <Form labelAlign="left" onSubmit={this.handleSubmit}>
          {
            article && article.config && article.config.children.map((item) => {
              return <FormBuilder key={item.name} item={item} form={form} />
            })
          }
          <div>
            <Button htmlType="submit" type="primary">提交</Button>
          </div>
        </Form>
      </Card>
    )
  }
}

const ArticleFormFieldSet = Form.create({ name: 'rrticle' })(ArticleForm);
export default ArticleFormFieldSet;
