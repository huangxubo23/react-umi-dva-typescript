import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import HotSpaceImageContainer from './HotSpaceImageContainer';
import { IHotSpaceImageData } from './Data';
import styles from './HotSpaceImagePreview.less';

interface IHotSpaceImagePreview extends React.Props<any> {
  data: IHotSpaceImageData;
  onChange: Function;
  onDelete: Function;
  dispatch?: Function;
}

@connect((state) => ({
  hotSpaceImage: state.hotSpaceImage
}))
export default class HotSpaceImagePreview extends PureComponent<IHotSpaceImagePreview> {
  state = {
    showEdit: false,
  }

  handleMouseEnter = () => {
    console.info('==handleMouseEnter=');
    this.setState({
      showEdit: true,
    });
  }

  handleMouseLeave = () => {
    console.info('==handleMouseLeave==');
    this.setState({
      showEdit: false,
    });
  }

  handleDelete = () => {
    const { onDelete } = this.props;
    onDelete && onDelete();
  }

  handleEdit = () => {
    const { data, dispatch, onChange } = this.props;
    console.info('==handleEdit==', data);
    dispatch({
      type: 'hotSpaceImage/update',
      payload: {
        visible: true,
        data,
        callback: (hotSpaceImageData: IHotSpaceImageData) => {
          onChange(hotSpaceImageData);
        }
      }
    });
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.hotSpaceImagePreview} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <HotSpaceImageContainer data={data} showPoint={data.showPoint} height={400} editable={false} />
        {
          this.state.showEdit &&
            <div className={styles.deleteArea} onClick={this.handleDelete}>
              <Icon type="close-circle" className={styles.deleteIcon} />
            </div>
        }
        {
          this.state.showEdit &&
            <div className={styles.editArea} onClick={this.handleEdit}>
              <Icon type="edit" className={styles.editIcon} />
            </div>
        }
      </div>
    )
  }
}
