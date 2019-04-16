export interface IHotSpace {
  url?: string;
  title?: string;
  coverUrl?: string;
  finalPricePc?: number;
  finalPriceWap?: number;
  images?: Array<string>;
  itemId?: number;
  price?: number;
  rawTitle?: string;
  resourceUrl?: string;
}

export interface IHotSpacesItem {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'item' | 'link';
  data: IHotSpace;
}

export class HotSpacesItem {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'item' | 'link';
  data: IHotSpace;
  constructor({ x, y, width, height, type, data }: IHotSpacesItem) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.data = data;
  }

  toPercent = ({ width, height }): IHotSpacesItem => {
    return {
      x: this.x / width,
      y: this.y / height,
      width: this.width / width,
      height: this.height / height,
      type: this.type,
      data: this.data,
    };
  }

  toPixel = ({ width, height }): IHotSpacesItem => {
    return {
      x: this.x * width,
      y: this.y * height,
      width: this.width * width,
      height: this.height * height,
      type: this.type,
      data: this.data,
    };
  }
}

export interface IHotSpaceImageData {
  picWidth: number;
  picHeight: number;
  showPoint: boolean;
  url: string;
  hotSpaces: Array<IHotSpacesItem>;
}

export interface IHotSpaceImageState {
  visible: boolean;
  callback?: Function;
  data: IHotSpaceImageData;
}
