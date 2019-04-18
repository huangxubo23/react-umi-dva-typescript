import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Icon, Button } from 'antd';
import ImageList from './ImageList';

import { IImageState, IImageDataItem } from './Image';

interface IImageSelectModalProps {
  title?: string;
  visible: boolean;
  onClose: () => void;
  onSelect: Function;
  image?: IImageState;
  pixFilter?: string;
  min?: number;
  max?: number;
}

const bodyStyle = {
  padding: '10px 20px',
}

@connect(({ image }) => ({
  image
}))
export default class ImageSelectModal extends PureComponent<IImageSelectModalProps> {
  state = {
    selectImages: [],
  };

  handelChange = (item: IImageDataItem) => {
    const { selectImages } = this.state;
    const idx = selectImages.findIndex((img: IImageDataItem) => img.id === item.id);
    if (idx === -1) {
      this.setState({
        selectImages: [...selectImages, item],
      });
    } else {
      selectImages.splice(idx, 1);
      this.setState({
        selectImages: [...selectImages],
      });
    }
  }

  handleSubmit = () => {
    this.props.onSelect([...this.state.selectImages])
    // this.setState({
    //   selectImages: [],
    // });
  }

  render() {
    const { title = '添加图片', visible, onClose, onSelect, image, min, max, pixFilter } = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        maskClosable={false}
        onCancel={onClose}
        width={980}
        bodyStyle={bodyStyle}
        footer={
          <div className="flex-row-center">
            <div className="flex-3 text-align-left text-overflow-ellipsis">{`请选择添加${max}张图片（已选${this.state.selectImages.length}/${max}）`}</div>
            <div className="flex-1"><Button onClick={onClose}>取消</Button><Button type="primary" onClick={this.handleSubmit}>确定</Button></div>
          </div>
        }
      >
       <Tabs defaultActiveKey="1" animated={false}>
        <Tabs.TabPane tab={<span><Icon type="picture" />图片库</span>} key="1">
          <ImageList
            image={image}
            selectImages={this.state.selectImages}
            onChange={this.handelChange}
            min={min}
            max={max}
            pixFilter={pixFilter}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span><Icon type="cloud-upload" />上传新图片</span>} key="2">
          Tab 2
        </Tabs.TabPane>
      </Tabs>
      </Modal>
    )
  }
}
