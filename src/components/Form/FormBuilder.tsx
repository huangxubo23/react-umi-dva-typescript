import React, { PureComponent } from 'react';
import { Form, Input, Cascader, Tooltip, Icon, Radio } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Editor from '@/components/Editor/Editor';
import UploadImageTip from '@/components/Upload/UploadImageTip';
import UploadMultiImage from '@/components/Upload/UploadMultiImage';

import { FormLayout, WrappedFormUtils } from 'antd/lib/form/Form';
import { ICreativeArticleFormItem } from '@/data/Taobao';

interface IFormBuilderProps extends React.Props<PureComponent> {
  item: ICreativeArticleFormItem;
  key?: string;
  form?: WrappedFormUtils;
  formItemLayout?: FormLayout;
}

export default class FormBuilder extends PureComponent<IFormBuilderProps> {
  formItemLayout = {
    labelCol: {
      xs: { span: 20 },
      sm: { span: 20 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 20 },
    },
  }
  buildFormItem = () => {
    const { item, formItemLayout = this.formItemLayout, form: { getFieldDecorator, setFieldsValue, getFieldValue } } = this.props;
    switch (item.component) {
      case 'Input': {
        return (
          <Form.Item
            {...formItemLayout}
            label={item.props.title || item.label}
          >
            {
              getFieldDecorator(item.name, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: item.rules,
                initialValue: item.props.value,
              })(
                (item.props && item.props.rows) ? <Input.TextArea placeholder={item.props ? item.props.placeholder : ''} rows={item.props.rows} /> : <Input placeholder={item.props ? item.props.placeholder : ''} />
              )
            }
          </Form.Item>
        )
      }
      case 'Forward': {
        return (
          <Form.Item
            {...formItemLayout}
            label={item.props.title || item.label}
          >
            {
              getFieldDecorator(item.name, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: item.rules,
                initialValue: item.props.value,
              })(
                <Input.TextArea rows={6} placeholder={item.props ? item.props.placeholder : ''} />
              )
            }
          </Form.Item>
        )
      }
      case 'Editor': {
        return (
          <Form.Item
            {...formItemLayout}
            label={item.props.title || item.label}
          >
            {
              getFieldDecorator(item.name, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: item.rules,
                initialValue: item.props.value,
              })(
                <Editor placeholder={item.props ? item.props.placeholder : ''} plugins={item.props.plugins} />
              )
            }
          </Form.Item>
        )
      }
      case 'RadioGroup': {
        return (
          <Form.Item
            {...formItemLayout}
            label={item.label}
          >
            {
              getFieldDecorator(item.name, {
                validateTrigger: ['onChange'],
                rules: item.rules,
                initialValue: item.props.value
              })(
                <Radio.Group>
                  {
                    item.props.dataSource.map((i) => {
                      return <Radio disabled={i.disabled} key={i.value} value={i.value}>{i.label} {i.labelExtra && <Tooltip title={i.labelExtra}><Icon style={{ color: 'orange' }} type="info-circle" /></Tooltip>}</Radio>;
                    })
                  }
                </Radio.Group>
              )
            }
          </Form.Item>
        )
      }
      case 'CascaderSelect': {
        const title = item.props.title || item.label
        return (
          <Form.Item
            {...formItemLayout}
            label={<span>{title} {item.props.tips ? <Tooltip title={ReactHtmlParser(item.props.tips)}><Icon style={{ color: 'orange' }} type="info-circle" /></Tooltip> : ''}</span>}
          >
            {
              getFieldDecorator(item.name, {
                validateTrigger: ['onChange'],
                rules: item.rules,
                initialValue: item.props.value
              })(
                <div><Cascader placeholder={item.props.placeholder || `请选择${title}`} options={item.props.dataSource} style={{ width: '220px' }} onChange={(value, selectedOptions) => { console.log('==Cascader==', value, selectedOptions); setFieldsValue({ [item.name]: value.slice(-1)[0] }) } }/></div>
              )
            }
          </Form.Item>
        )
      }
      case 'CreatorAddImage': {
        if (item.name === 'standardCoverUrl') {
          // 添加封面，有单图和三图
          return (
            <Form.Item
              {...formItemLayout}
              label={item.label}
            >
              {
                getFieldDecorator(item.name, {
                  validateTrigger: ['onChange'],
                  rules: item.rules,
                  initialValue: item.props.value
                })(
                  <UploadMultiImage data={item.props} zoom={0.3} count={getFieldValue('coverCount')} />
                )
              }
            </Form.Item>
          )
        }
        return (
          <Form.Item
            {...formItemLayout}
            label={item.label}
          >
            {
              getFieldDecorator(item.name, {
                validateTrigger: ['onChange'],
                rules: item.rules,
                initialValue: item.props.value
              })(
                <UploadImageTip data={item.props} zoom={0.4} />
              )
            }
          </Form.Item>
        )
      }
      default:
        return null;
    }
  }

  render() {
    return this.buildFormItem();
  }
}
