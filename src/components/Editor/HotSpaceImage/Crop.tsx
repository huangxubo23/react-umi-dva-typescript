import React, { Component } from 'react';
import { equals, is, update, remove } from 'ramda';
import interact from 'interactjs';
import { Icon } from 'antd';
import { HotSpacesItem } from './Data';
import { DeleteIcon, NumberIcon } from './Icons';
import { IHotSpaceImageData, IHotSpacesItem } from './Data';

const styles = {
  icon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '16px',
    height: '16px',
    marginLeft: '-8px',
    marginTop: '-8px',
    color: '#fff',
  }
}

interface ICrop extends React.Props<any> {
  editable: boolean;
  showPoint: boolean;
  index: number;
  data: IHotSpaceImageData;
  item: IHotSpacesItem;
  size: { width: number, height: number };
  onResize: Function;
  onChange: Function;
  onDrag: Function;
  onDelete: Function;
  minWidth?: number;
  minHeight?: number;
}
class Crop extends Component<ICrop> {
  cropRef: any;
  static cropStyle = (item) => {
    const {
      x, y, width, height,
    } = item;

    return {
      // border: '1px dotted rgba(153,153,153,1)',
      // background: 'rgba(153,153,153,0.3)',
      display: 'inline-block',
      position: 'absolute',
      width,
      height,
      top: y,
      left: x,


      boxShadow: '0 0 6px #cdcdcd',
      background: '#B25EEF',
      opacity: 0.6,
    };
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(!this.props.editable)
      return;
    interact(this.cropRef)
      .draggable({})
      .resizable({
        edges: {
          left: true, right: true, bottom: true, top: true,
        },
      })
      .on('dragmove', this.handleDragMove)
      .on('resizemove', this.handleResizeMove);
  }
  shouldComponentUpdate(nextProps) {
    // reduce uncessary update
    return !equals(nextProps.item, this.props.item)
      || (nextProps.index !== this.props.index) || (nextProps.showPoint !== this.props.showPoint);
  }

  handleResizeMove = (e) => {
    const {
      index,
      item,
      item: { x, y },
      data: { hotSpaces },
      onResize,
      onChange,
      minWidth,
      minHeight,
      size,
    } = this.props;
    let { width, height } = e.rect;
    if (minWidth && minWidth > width) {
      if (minWidth === width) return;
      width = minWidth;
    }
    if (minHeight && minHeight > height) {
      if (minHeight === height) return;
      height = minHeight;
    }
    const { left, top } = e.deltaRect;

    const nextCoordinate = {
      ...item, x: x + left, y: y + top, width, height,
    };
    const nextCoordinatePercent = new HotSpacesItem(nextCoordinate).toPercent(size)
    const nextCoordinates = update(index, nextCoordinatePercent)(hotSpaces);
    if (is(Function, onResize)) {
      onResize(nextCoordinatePercent, index, nextCoordinates);
    }
    if (is(Function, onChange)) {
      onChange(nextCoordinatePercent, index, nextCoordinates);
    }
  }
  handleDragMove = (e) => {
    const {
      index,
      item,
      item: { x, y },
      data: { hotSpaces },
      onDrag,
      onChange,
      size
    } = this.props;
    const { dx, dy } = e;
    const nextCoordinate = { ...item, x: x + dx, y: y + dy };
    const nextCoordinatePercent = new HotSpacesItem(nextCoordinate).toPercent(size)
    const nextCoordinates = update(index, nextCoordinatePercent)(hotSpaces);
    if (is(Function, onDrag)) {
      onDrag(nextCoordinatePercent, index, nextCoordinates);
    }

    if (is(Function, onChange)) {
      onChange(nextCoordinatePercent, index, nextCoordinates);
    }
  }

  handleDelete = () => {
    const {
      index,
      onDelete,
      data: { hotSpaces },
    } = this.props;
    const nextCoordinates = remove(index, 1)(hotSpaces);
    if (is(Function, onDelete)) {
      onDelete(hotSpaces[index], index, nextCoordinates);
    }
  }

  componentWillUnmount() {
    (interact(this.cropRef) as any).unset();
  }


  render() {
    const { item, index, showPoint, editable } = this.props;
    return (
      <div
        style={Crop.cropStyle(item)}
        ref={r => this.cropRef = r}
      >
        {
          editable &&
          [
            <NumberIcon key="numberIcon" number={index + 1} />,
            <DeleteIcon key="deleteIcon"  onClick={this.handleDelete} />
          ]
        }
        {
          showPoint && <Icon type="plus-circle" style={styles.icon} />
        }
      </div>
    );
  }
}

export default Crop;
