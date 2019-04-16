import React, { Component } from 'react';
import { both, clone, is, complement, equals, map, addIndex, isEmpty } from 'ramda';
import { notification } from 'antd';
// import shortid from 'shortid';
import Crop from './Crop';
import { IHotSpaceImageData,  HotSpacesItem } from './Data';

interface IHotSpaceImageContainer extends React.Props<any> {
  data: IHotSpaceImageData;
  editable: boolean;
  showPoint: boolean;
  height: number;
  maxLimit?: number;
  minWidth?: number;
  minHeight?: number;
  onLoad?: () => void;
  onDraw?: Function;
  onChange?: Function;
  onDelete?: Function;
}

const isValidPoint = (point: { x?: number, y?: number } = {}) => {
  const strictNumber = number => both(
    is(Number),
    complement(equals(NaN)),
  )(number);
  return strictNumber(point.x) && strictNumber(point.y);
};

class HotSpaceImageContainer extends Component<IHotSpaceImageContainer> {
  container: any;
  img: any;
  drawingIndex = -1;

  pointA = {};
  pointB = {};

  // id = shortid.generate();
  constructor(props) {
    super(props);
  }

  isValidCount = () => {
    const { maxLimit, data: { hotSpaces } } = this.props;
    if (!maxLimit) return true;
    return maxLimit > hotSpaces.length;
  }

  renderCrops = (props) => {
    const indexedMap = addIndex(map);
    const size = this.getSize();
    return indexedMap((coor, index) => {
      const hotSpace = new HotSpacesItem(coor).toPixel(this.getSize());
      return (
        <Crop
          // improve performance when delet crop in middle array
          key={`hotSpaceImageItem_${index}`}
          index={index}
          item={hotSpace}
          size={size}
          {...props}
        />
      );
    })(props.data.hotSpaces);
  }

  getCursorPosition = (e) => {
    const { left, top } = this.container.getBoundingClientRect();
    return {
      x: e.clientX - left,
      y: e.clientY - top,
    };
  }


  getSize = () => {
    const { height, data: { picWidth, picHeight } } = this.props;
    const width = picWidth / picHeight * height;
    return {
      height,
      width,
    }
  }

  generateCrop = (pointA, pointB) => {
    const { onDraw, onChange, data: { hotSpaces }, minWidth, minHeight } = this.props;
    if (this.isValidCount() && isValidPoint(pointA) && isValidPoint(pointB)) {
      // get the drawing coordinate
      const width = Math.abs(pointA.x - pointB.x) < minWidth ? minWidth : Math.abs(pointA.x - pointB.x);
      const height = Math.abs(pointA.y - pointB.y) < minHeight ? minHeight : Math.abs(pointA.y - pointB.y);
      const coordinate = new HotSpacesItem({
        x: Math.min(pointA.x, pointB.x),
        y: Math.min(pointA.y, pointB.y),
        width,
        height,
        type: 'item',
        data: { url: '' }
      });
      const nextCoordinates = clone(hotSpaces);
      const coordinatePercent = coordinate.toPercent(this.getSize());
      nextCoordinates[this.drawingIndex] = coordinatePercent;
      if (is(Function, onDraw)) {
        onDraw(coordinate, this.drawingIndex, nextCoordinates);
      }
      if (is(Function, onChange)) {
        onChange(coordinatePercent, this.drawingIndex, nextCoordinates);
      }
    }
  }

  handleMouseDown = (e) => {
    if (!this.isValidCount()) return;

    const { data: { hotSpaces } } = this.props;
    if (e.target === this.img || e.target === this.container) {
      const { x, y } = this.getCursorPosition(e);


      this.drawingIndex = hotSpaces.length;
      this.pointA = { x, y };
      // this.id = shortid.generate();
    }
  }

  handleMouseMove = (e) => {
    if (this.isValidCount() && isValidPoint(this.pointA)) {
      const { x, y } = this.getCursorPosition(e);
      this.pointB = { x, y };
      this.generateCrop(this.pointA, this.pointB);
    }
  }

  handlMouseUp = (e) => {
    if (!this.isValidCount()) {
      notification.close('maxLimitNotification');
      notification.warning({
        key: 'maxLimitNotification',
        message: '提示',
        description: `热区图最多支持${this.props.maxLimit}个`,
      });
      if (!isEmpty(this.pointA)) {
        this.pointA = {};
      }
    }
    if ((e.target === this.img || e.target === this.container) && isEmpty(this.pointB)) {
      const { x, y } = this.getCursorPosition(e);
      this.pointB = { x, y };
      if (equals(this.pointA, this.pointB)) {
        this.generateCrop(this.pointA, this.pointB);
      }
    }
    this.pointA = {};
    this.pointB = {};
  }

  render() {
    const { data: { url, picWidth, picHeight }, height, onLoad } = this.props;
    const width = picWidth / picHeight * height;
    // const { clicked } = this.state
    return (
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
        }}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handlMouseUp}
        ref={container => this.container = container}
      >
        <img
          ref={img => this.img = img}
          src={url}
          width={width}
          height={height}
          onLoad={onLoad}
          alt=""
          draggable={false}
        />
        {this.renderCrops(this.props)}

      </div>
    );
  }
}

export default HotSpaceImageContainer;

