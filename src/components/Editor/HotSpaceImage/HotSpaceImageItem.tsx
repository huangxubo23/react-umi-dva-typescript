import React, { Component } from 'react';
import { equals, is, remove } from 'ramda';
import styles from './HotSpaceImage.less';

import { IHotSpacesItem } from './Data';

interface IHotSpaceImageItem extends React.Props<any> {
  index: number;
  hotSpace: IHotSpacesItem;
  hotSpaces: Array<IHotSpacesItem>;
  onDelete?: Function;
}
class HotSpaceImageItem extends Component<IHotSpaceImageItem> {
  componentDidMount() {

  }
  shouldComponentUpdate(nextProps) {
    // reduce uncessary update
    return !equals(nextProps.hotSpace, this.props.hotSpace)
      || (nextProps.index !== this.props.index);
  }

  handleDelete = () => {
    const {
      index,
      onDelete,
      hotSpaces,
    } = this.props;
    const nextCoordinates = remove(index, 1)(hotSpaces);
    if (is(Function, onDelete)) {
      onDelete(hotSpaces[index], index, nextCoordinates);
    }
  }

  render() {
    const { hotSpace, index } = this.props;
    return (
      <div className={styles.hotSpaceImageItem}>
        <div className={styles.index}>{index + 1}</div>
        <div className={styles.content}>{hotSpace.data && hotSpace.data.title}</div>
        <div className={styles.option}>
          <span className={styles.optionItem}>添加商品</span>
          <span className={styles.optionItem}>添加链接</span>
          <span className={styles.optionItem} onClick={this.handleDelete}>删除</span>
        </div>
      </div>
    );
  }
}

export default HotSpaceImageItem;
