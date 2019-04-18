import React, { PureComponent } from 'react';
import ReactHtmlParser from 'react-html-parser';

import UploadImageTip from './UploadImageTip';
import { IImageDataItem } from '@/components/Resource/Image';

import styles from './UploadMultiImage.less';

interface IUploadImageTipProps {
  value?: Array<IImageDataItem>;
  onChange?: Function;
  count: number;
  data: {
    min?: number;
    max?: number;
    activityId?: number;
    pixFilter?: string;
    aspectRatio?: string;
    label: string;
    uploadTips?: string;
    tips?: string;
  },
  zoom?: number;
}

export default class UploadMultiImage extends PureComponent<IUploadImageTipProps> {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect = (selectImages: Array<IImageDataItem>) => {
    // 添加选择
    const { value, onChange } = this.props;
    onChange([...value, ...selectImages]);
  }

  handleChange = (index: number, selectImages: Array<IImageDataItem>) => {
    // 更改图片
    const { value, onChange } = this.props;
    value[index] = selectImages[0]
    onChange([...value]);
  }

  render() {
    const { data: { tips, ...childrenData }, zoom, value, count } = this.props;

    return (
      <div className={styles.uploadMultiImage}>
        <div className={styles.content}>
          {
            value.map((item: IImageDataItem, index: number) => {
              return (
                <UploadImageTip key={`UploadMultiImage${index}`} data={childrenData} zoom={zoom} value={[item]} onSelect={(selectImages: Array<IImageDataItem>) => this.handleChange(index, selectImages)} />
              )
            })
          }
          {
            value.length < count && <UploadImageTip key={`UploadMultiImage${value.length - 1}`} data={childrenData} zoom={zoom} onSelect={(selectImages: Array<IImageDataItem>) => this.handleSelect(selectImages)} />
          }
        </div>
        { tips && <div>{ReactHtmlParser(tips)}</div> }
      </div>
    )
  }
}
