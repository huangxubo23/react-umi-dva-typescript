import React from 'react';
import { connect } from 'dva';
import { Checkbox, Modal } from 'antd';
import { addIndex, map } from 'ramda';
import HotSpaceImageContainer from './HotSpaceImageContainer';
import HotSpaceImageItem from './HotSpaceImageItem';
import styles from './HotSpaceImage.less';

import { IHotSpaceImageState, IHotSpacesItem } from './Data';

interface IHotSpaceImage extends React.Props<any> {
  dispatch?: Function;
  hotSpaceImage?: IHotSpaceImageState;
  onChange: Function;
}

@connect((state) => ({
  hotSpaceImage: state.hotSpaceImage,
}))
export default class HotSpaceImage extends React.Component<IHotSpaceImage> {

  handleShowPoint = (e) => {
    this.props.dispatch({
      type: 'hotSpaceImage/updateData',
      payload: {
        showPoint: e.target.checked,
      }
    });
  }

  handleHotSpacesChange = (hotSpace, index, hotSpaces) => {
    this.props.dispatch({
      type: 'hotSpaceImage/updateData',
      payload: {
        hotSpaces,
      }
    });
  }
  handleHotSpacesDelete = (hotSpace, index, hotSpaces) => {
    this.props.dispatch({
      type: 'hotSpaceImage/updateData',
      payload: {
        hotSpaces,
      }
    });
  }
  renderHotSpaces = (hotSpaces: Array<IHotSpacesItem>) => {
    const indexedMap = addIndex(map);
    return indexedMap((hotSpace: IHotSpacesItem, index: number) => (
      <HotSpaceImageItem
        key={`hotSpaceImageItem_${index}`}
        index={index}
        hotSpace={hotSpace}
        hotSpaces={hotSpaces}
        onChange={this.handleHotSpacesChange}
        onDelete={this.handleHotSpacesDelete}
      />
    ))(hotSpaces);
  }

  handleModalCancel = () => {
    const { dispatch, hotSpaceImage } = this.props;
    dispatch({
      type: 'hotSpaceImage/update',
      payload: {
        visible: false,
        callback: null,
        data: {
          ...hotSpaceImage.data,
          hotSpaces: [],
        },
      }
    });
  }

  handleSubmit = () => {
    const { hotSpaceImage: { data, callback }, onChange } = this.props;
    callback ? callback(data) : onChange(data);
    this.handleModalCancel();
  }

  render() {
    const { hotSpaceImage: { visible, data } } = this.props;
    return (
      <Modal
        title="编辑热区"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleModalCancel}
        className={styles.hotSpaceImage}
        // style={{ minWidth: '750px' }}
      >
        <div>
          <div>
            <div>请在图片上选择合适的位置创建热区，所划区域不小于44*44px。</div>
            <div className={styles.checkboxArea}><Checkbox checked={data.showPoint} onChange={this.handleShowPoint}>图片显示点击引导</Checkbox></div>
          </div>
          <div className={styles.content}>
            <div>
              <HotSpaceImageContainer
                data={data}
                editable={true}
                showPoint={data.showPoint}
                // width={1000}
                height={400}
                minWidth={44}
                minHeight={44}
                maxLimit={12}
                // hotSpaces={hotSpaces}
                // onDrag={this.handleHotSpacesChange}
                // onResize={this.handleHotSpacesChange}
                // onDraw={this.handleHotSpacesChange}
                onChange={this.handleHotSpacesChange}
                onDelete={this.handleHotSpacesDelete}
                // onLoad={e => console.log(e.target.height, e.target.width)}
              />
            </div>
            <div className={styles.list}>
              {
                this.renderHotSpaces(data.hotSpaces)
              }
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
