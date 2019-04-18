export interface IImageState {
  errorCode: number;
  status: 'SUCCESS' | 'ERROR',
  message: string;
  data: IImageData
}
export interface IImageData {
  current: number;
  pageSize: number;
  total: number;
  realTotal?: number;
  filter?: any;
  itemList: Array<IImageDataItem>;
}

export interface IImageDataItem {
  title: string;
  materialId?: string;
  resourceId?: string;
  id: number;
  gmtCreate?: string;
  gmtModified?: string | null;
  coverUrl?: string;
  url: string;
  thumbUrl?: string;
  resourceType: 'Pic';
  categoryId: number;
  picWidth: number;
  picHeight: number;
}

