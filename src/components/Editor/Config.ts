// 淘宝热区图
export const TaoBaoHotSpaceImageType = 'SIDEBARHOTSPACEIMAGE';
import { IHotSpaceImageData } from './HotSpaceImage/Data';
export interface ITaobaoHotSpaceImageData {
  type: 'SIDEBARHOTSPACEIMAGE';
  mutability: 'MUTABLE';
  data: IHotSpaceImageData;
}

export const TaobaoEditorItems = [TaoBaoHotSpaceImageType];


