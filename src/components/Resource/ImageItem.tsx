import React, { PureComponent } from 'react';
import { Icon } from 'antd';

import { IImageDataItem } from './Image';

import style from './ImageItem.less';

interface IImageListProps {
  item: IImageDataItem,
  onChange: Function;
  pixFilter?: string;
  selected?: boolean;
}
export default class ImageItem extends PureComponent<IImageListProps> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  getPixFilter = (): boolean => {
    const { pixFilter, item } = this.props;
    if (!pixFilter || typeof pixFilter !== 'string') {
      return true;
    }

    const [width, height] = pixFilter.split('x');
    const { picWidth, picHeight } = item;
    return picWidth >= Number(width) && picHeight >= Number(height);
  }

  handleClick = (event) => {
    if (!this.getPixFilter()) {
      return;
    }

    this.props.onChange(this.props.item);
  }
  render() {
    const { item, selected } = this.props;
    return (
      <div className={style.imageItem}>
        <div className={style.card}>
          <div className={style.cardCover} onClick={this.handleClick}>
            <img className={style.image} alt={item.title} src={item.coverUrl} />
            {
              selected && <div className={style.selectCover}><Icon type="check" /></div>
            }
            {
              !this.getPixFilter() && <div className={style.disableCover}>图片不符合尺寸</div>
            }
          </div>
          <div className={style.cardFooter}>
            <div className={style.title}>{item.title}</div>
            <div>{`${item.picWidth}x${item.picHeight}`}</div>
          </div>
        </div>
      </div>
    );
  }
}
