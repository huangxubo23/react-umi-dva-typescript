import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import ImageSelectModal from '@/components/Resource/ImageSelectModal';

import { IImageDataItem } from '@/components/Resource/Image';

import styles from './UploadImageTip.less';

interface IUploadImageTipProps {
  value?: Array<IImageDataItem>;
  onChange?: Function;
  onSelect?: Function;
  data: {
    min?: number;
    max?: number;
    activityId?: number;
    pixFilter?: string;
    aspectRatio?: string;
    label: string;
    uploadTips?: string;
    tips?: string;
    // value: Array<IUploadImageValue>;
  },
  zoom?: number;
}

// interface IUploadImageValue {
//   fileId: string;
//   fileName: string;
//   folderId: string;
//   formatSize: string;
//   materialId: string;
//   pix: string;
//   sizes: number;
//   thumbUrl: string;
//   url: string;
//   coverUrl?: string;
// }

export default class UploadImageTip extends PureComponent<IUploadImageTipProps> {
  state = {
    visible: false,
  }
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleClick = () => {
    this.setState({
      visible: true,
    });
  }

  handleClose = () => {
    this.setState({
      visible: false,
    });
  }

  handleSelect = (selectImages: Array<IImageDataItem>) => {
    console.info('==handleSelect==', selectImages);
    if (this.props.onSelect) {
      // 把数据上传到父组件
      this.props.onSelect(selectImages)
    } else {
      // 直接设置表单数据
      this.props.onChange(selectImages);
    }
    this.handleClose();
  }

  getStyle = (pixFilter = '400x400') => {
    const { zoom = 0.5 } = this.props;
    const [ width, height ] = pixFilter.split('x');
    return {
      width: Number(width) * zoom,
      height: Number(height) * zoom,
    }
  }

  render() {
    const { data: { uploadTips, tips, pixFilter, min, max }, value = [] } = this.props;
    const style = this.getStyle(pixFilter);

    return (
      <div className={styles.uploadImageTip}>
        <div className={styles.container} style={style} onClick={this.handleClick}>
          {
            value.length ?
            <img src={value[0].coverUrl || value[0].thumbUrl} style={style} /> :
            <div className={styles.content}>
              <Icon type="plus" className={styles.addIcon} />
              <div className={styles.tip}>{uploadTips}</div>
            </div>
          }
        </div>
        { tips && <div>{ReactHtmlParser(tips)}</div> }
        <ImageSelectModal
          visible={this.state.visible}
          pixFilter={pixFilter}
          min={min}
          max={max}
          onClose={this.handleClose}
          onSelect={this.handleSelect}
        />
      </div>
    )
  }
}
