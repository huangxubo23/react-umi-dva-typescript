import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css'
import 'braft-extensions/dist/color-picker.css'

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import { Icon } from 'antd';
import HotSpaceImage from './HotSpaceImage/HotSpaceImage';
import HotSpaceImagePreview from './HotSpaceImage/HotSpaceImagePreview';
import { TaobaoEditorItems, TaoBaoHotSpaceImageType } from './Config';

import styles from './Editor.less';

interface IEditor extends React.Props<any> {
  dispatch?: Function;
}

@connect((state) => ({
  hotSpaceImage: state.hotSpaceImage,
}))
export default class Editor extends PureComponent<IEditor> {
  state = {
    editorState: null,
  }

  async componentDidMount () {
    // 假设此处从服务端获取html格式的编辑器内容
    const htmlContent = '';
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
    this.setState({
      editorState: BraftEditor.createEditorState(htmlContent)
    });

  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    // 将editorState数据转换成RAW字符串
    const rawString = this.state.editorState.toRAW();
    // editorState.toRAW()方法接收一个布尔值参数，用于决定是否返回RAW JSON对象，默认是false
    const rawJSON = this.state.editorState.toRAW(true)
    debugger;
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  clearContent = () => {
    this.setState({
      editorState: ContentUtils.clear(this.state.editorState)
    })
  }

  preview = () => {

    if ((window as any).previewWindow) {
      (window as any).previewWindow.close();
    }

    (window as any).previewWindow = window.open();
    (window as any).previewWindow.document.write(this.buildPreviewHtml());
    (window as any).previewWindow.document.close();

  }

  buildPreviewHtml () {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>预览</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 800px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.state.editorState.toHTML()}</div>
        </body>
      </html>
    `
  }

  openHotSpaceImage = () => {
    this.props.dispatch({
      type: 'hotSpaceImage/update',
      payload: {
        visible: true,
      }
    });
  }

  handleHotSpaceImageChange = (hotSpaceImageData) => {
    // const contentState = this.state.editorState.getCurrentContent();
    // const contentStateWithEntity = contentState.createEntity(
    //     'SIDEBARHOTSPACEIMAGE',//热区图
    //     'MUTABLE',
    //     hotSpaceImageData
    // );
    // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    // const a = ContentUtils.insertAtomicBlock(
    //     editorState,
    //     entityKey,
    //     ' '
    // );
    const editorState = ContentUtils.insertAtomicBlock(
      this.state.editorState,
      TaoBaoHotSpaceImageType,
      false,
      hotSpaceImageData,
    );
    this.setState({
      editorState
    });
  }

  handleRemoveMedia = (mediaBlock) => {
    const editorState = ContentUtils.removeMedia(this.state.editorState, mediaBlock);
    this.setState({
      editorState
    });
  }

  handleUpdateMedia = (mediaBlock, newData) =>  {
    const entityKey = mediaBlock.getEntityAt(0);
    const editorState = ContentUtils.setMediaData(this.state.editorState, entityKey, newData);
    this.setState({
      editorState
    });
  }

  mediaBlockRenderer = (block) => {
    console.info('==mediaBlockRenderer==', block.getType(), block.getEntityAt(0));
    if (block.getType() === 'atomic') {
      const entity = this.state.editorState.getCurrentContent().getEntity(
        block.getEntityAt(0)
      );
      const type = entity.getType();
      console.log(type);

      if (TaobaoEditorItems.indexOf(type) === -1) {
        return null;
      }
      const data = entity.getData();
      switch (type) {
        case TaoBaoHotSpaceImageType: {
          console.info('==mediaBlockRenderer==', TaoBaoHotSpaceImageType, data, block.getEntityAt(0), block.getKey());
          return {
            component: () => <HotSpaceImagePreview data={data} onChange={(newData) => this.handleUpdateMedia(block, newData)} onDelete={() => this.handleRemoveMedia(block)} />,
            editable: false,
          }
        }
        default:
          break;
      }
    }
    return null;
  }

  render () {
    console.info('==Editor==', this.props);
    const { editorState } = this.state;
    const controls = ['headings', 'font-size', 'text-color', 'bold', 'italic', 'underline', 'strike-through', 'superscript', 'subscript', 'hr', 'text-align', 'text-indent', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator', 'emoji', 'link', 'media', {
      key: 'hot-space-image',
      type: 'button',
      text: '热区图',
      title: '添加热区图',
      onClick: this.openHotSpaceImage,
    }, 'separator', 'clear', 'editor-with-table'];
    const extendControls = [{
      key: 'clear',
      type: 'button',
      text: <Icon type="delete" />,
      title: '清空内容',
      onClick: this.clearContent,
    }, 'remove-styles', 'undo', 'redo', {
      key: 'preview',
      type: 'button',
      text: '预览',
      title: '预览内容',
      onClick: this.preview,
    }]

    return (
      <div id="editor" className={styles.container}>
        <div>
          <BraftEditor
            id="editor-with-color-picker"
            value={editorState}
            onChange={this.handleEditorChange}
            onSave={this.submitContent}
            controls={controls}
            extendControls={extendControls}
            blockRendererFn={this.mediaBlockRenderer}
            style={{ background: '#f1f1f1' }}
            controlBarStyle={{ background: '#fff' }}
            contentStyle={{height: 600, width: 800, padding: '30px 20px', margin: '0 auto', background: '#fff',  overflow: 'auto'}}
          />
          <HotSpaceImage onChange={this.handleHotSpaceImageChange} />
        </div>
      </div>
    )

  }

}
