import React, { PureComponent } from 'react';
import { Pagination } from 'antd';
import ImageItem from './ImageItem';

import { IImageState, IImageDataItem } from './Image';

import style from './ImageList.less';

interface IImageListProps {
  image: IImageState,
  selectImages: Array<IImageDataItem>;
  onChange: Function;
  min?: number;
  max?: number;
  pixFilter?: string;
}
export default class ImageList extends PureComponent<IImageListProps> {
  isSelected = (item: IImageDataItem) => {
    const idx = this.props.selectImages.findIndex((img: IImageDataItem) => img.id === item.id);
    return idx > -1;
  }

  render() {
    const { image, pixFilter, onChange } = this.props;
    return (
      <div className={style.imageList}>
        <div className={style.content}>
          {
            image.data.itemList.map((item: IImageDataItem) => {
              return <ImageItem key={item.id} item={item} pixFilter={pixFilter} selected={this.isSelected(item)} onChange={onChange} />
            })
          }
        </div>
        <div className={style.footer}>
          <Pagination simple={true} current={image.data.current} total={image.data.total} pageSize={image.data.pageSize} />
        </div>
      </div>
    );
  }
}
