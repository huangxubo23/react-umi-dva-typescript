/**
 * Created by shiying on 17-7-28.
 */

import $ from 'jquery';
import {
    Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw,
    AtomicBlockUtils, DefaultDraftBlockRenderMap, SelectionState, getDefaultKeyBinding
} from 'draft-js';
import {Dropdown,Tooltip,Dialog,Button,Layout,Badge} from 'element-react';
import 'element-theme-default';
import Immutable from 'immutable';
import React from 'react';
import {BundleLoading} from '@/bundle';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../upload/UpImages';
import UpIitem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upItem/app-[name]!../upload/UpItem';
import UpHotImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upHotImages/app-[name]!../upload/UpHotImages';
import UpShop from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upShop/app-[name]!../upload/UpShop';
import UpSPUItem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upSPUItem/app-[name]!../upload/UpSPUItem';
import "draft-js/dist/Draft.css";
import '../../../../styles/component/react_assembly/editBox.css';
import ReactDOM from 'react-dom';
import shop from '../../../../images/forum/shop.png';


class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        let editorState;
        let content = props.content;
        if (content) {
            let contentState = convertFromRaw(content);
            editorState = EditorState.createWithContent(contentState);
        } else {
            editorState = EditorState.createEmpty();
        }

        this.state = {
            editorState: editorState,
            hotImg: false,
            editBoxButsFD: false
        };

        this.blur = () => this.refs.editor.blur();

        this.focus = () => this.refs.editor.focus();

        this.onChange = (editorState) => {
            let onChangeBefore = this.props.onChangeBefore;
            if (onChangeBefore) {
                editorState = onChangeBefore(editorState);
            }
            this.onChangeAs(editorState);
        };

        this.onChangeAs = (editorState) => {
            this.setState({editorState}, () => {
                if (typeof  this.props.onChange == "function") {
                    this.props.onChange(this.getContent(), editorState);
                }
            });
        }

        this.handleKeyCommand = this.handleKeyCommand.bind(this);

        this.getContent = () => this._getContent();
        this.setContent = (content) => this._setContent(content);

        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.undo = () => this._undo();
        this.redo = () => this._redo();
        this.addImg = () => this._addImg();
        this.addItem = () => this._addItem();
        this.addHotImg = () => this._addHotImg();
        this.addEditHotImg = (url, pa, img) => this._addEditHotImg(url, pa, img);
        this.addImgCallback = (url, pa, img) => this._addImgCallback(url, pa, img);
        this.addItemCallback = (item) => this._addItemCallback(item);
        this.addHotImgCallback = (url, pa, img) => this._addHotImgCallback(url, pa, img);
        this.addShop = () => this._addShop();
        this.addShopCallback = (shop) => this._addShopCallback(shop);
        this.addSPU = () => this._addSPU();
        this.addSPUCallback = (SPU) => this._addSPUCallback(SPU);

    }

    componentDidMount() {
        let zujian = this;
        var buts = $(ReactDOM.findDOMNode(this)).find(".editBoxButs");
        let isFloat = this.props.isFloat;
        if (isFloat) {
            if (buts.offset()) {
                let scrollParent = $(ReactDOM.findDOMNode(this)).parents(".scrollParent");
                if (scrollParent.length == 0) {
                    scrollParent = $(window);
                }
                var top = buts.offset().top - scrollParent.offset().top;
                scrollParent.scroll(() => {
                    if ($(".editBoxButs").length > 0) {
                        var h = $('.DraftEditor-root').height();//$(ReactDOM.findDOMNode(this)).height();
                        var t = scrollParent.scrollTop();
                        if (t > top && t < (top + h - 100)) {
                            $(".editBoxButs").addClass("editBoxButsFD");
                            $(".editBoxButs").css("top", scrollParent.offset().top);
                            $(".editBoxButs").css("left", scrollParent.offset().left);
                            $(".editBoxButs").css("right", scrollParent.offset().right);
                        } else {
                            $(".editBoxButs").removeClass("editBoxButsFD");
                        }
                    }
                })
            }
        }
    }


    handleKeyCommand(command) {

        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    _getContent() {
        const content = this.state.editorState.getCurrentContent();
        return convertToRaw(content);
    }

    _setContent(content) {
        try {
            let contentState = convertFromRaw(content);
            let editorState = EditorState.createWithContent(contentState);
            this.onChange(editorState);
        } catch (e) {
            console.error(e);
        }

    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }


    _undo() {
        this.onChange(
            EditorState.undo(
                this.state.editorState
            )
        );
    }

    _redo() {
        this.onChange(
            EditorState.redo(
                this.state.editorState
            )
        );
    }

    _addImg() {
        this.blur();
        this.setState({addImgCallback: this.addImgCallback}, function () {
            this.upImagesBundleLoading();
        });
    }

    _addItem() {
        this.blur();
        this.setState({addItemCallback: this.addItemCallback}, function () {
            this.upItemBundleLoading();
        });
    }

    _addHotImg() {
        this.blur();
        this.setState({addEditHotImg: this.addEditHotImg, hotImg: true}, () => {
            this.upImagesBundleLoading();
        });
    }

    _addShop() {
        this.blur();
        this.setState({addShopCallback: this.addShopCallback}, () => {
            this.upShopBundleLoading();
        })
    }

    _addSPU() {
        this.blur();
        this.setState({addSPUCallback: this.addSPUCallback}, () => {
            this.upSPUItemBundleLoading();
        })
    }

    _addEditHotImg(url, pa, img) {
        this.blur();
        this.setState({addHotImgCallback: this.addHotImgCallback, hotImg: false}, () => {
            this.upHotImagesBundleLoading(url, pa, img);
        });
    }

    _addShopCallback(shop) {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'SIDEBARADDSHOP',//店铺
            'MUTABLE',
            shop
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const a = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );
        this.onChange(a);
    }

    _addSPUCallback(SPU) {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'SIDEBARADDSPU',//标准品牌商品
            'MUTABLE',
            SPU
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const a = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );
        this.onChange(a);
    }

    _addHotImgCallback(img) {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'SIDEBARHOTSPACEIMAGE',//热区图
            'MUTABLE',
            img
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const a = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );
        this.onChange(a);
    }

    _addImgCallback(url, pa, img) {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'SIDEBARIMAGE',//图片
            'MUTABLE',
            img
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const a = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );
        this.onChange(a);
    }

    _addItemCallback(item) {

        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'SIDEBARSEARCHITEM',//商品
            'IMMUTABLE',
            item
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        let a = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );
        a = EditorState.moveSelectionToEnd(a);
        this.onChange(a);
    }

    mediaBlockRenderer = (block) => {

        if (block.getType() === 'atomic') {
            return {
                component: this.MediaCustom,
                editable: false,
            };
        }
        return null;
    };


    MediaCustom = (props) => {

        if (props.block.getEntityAt(0)) {
            const entity = props.contentState.getEntity(
                props.block.getEntityAt(0)
            );
            const data = entity.getData();
            const type = entity.getType();
            let {ContentComments} = this.props;
            let media;
            if (type === 'SIDEBARIMAGE') {
                media =
                    <ImageCustom data={data} readOnly={this.props.readOnly} edit={this.editImg} delMedia={this.delMedia}
                                 entityKey={props.block.getEntityAt(0)} blockKey={props.block.getKey()}
                                 ContentComments={ContentComments}
                                 replace={this.replaceImg}/>;
            } else if (type === 'SIDEBARSEARCHITEM') {
                media = <Item data={data} readOnly={this.props.readOnly} edit={this.editItem} delMedia={this.delMedia}
                              entityKey={props.block.getEntityAt(0)} blockKey={props.block.getKey()}
                              ContentComments={ContentComments}
                              replace={this.replaceItem}/>;
            } else if (type === 'SIDEBARHOTSPACEIMAGE') {
                media =
                    <ImageHot data={data} readOnly={this.props.readOnly} edit={this.editHotImg} delMedia={this.delMedia}
                              entityKey={props.block.getEntityAt(0)} blockKey={props.block.getKey()}
                              ContentComments={ContentComments}
                              replace={this.replaceImg}/>
            } else if (type === "SIDEBARADDSHOP") {
                media = <Shop data={data} readOnly={this.props.readOnly} delMedia={this.delMedia}
                              entityKey={props.block.getEntityAt(0)} blockKey={props.block.getKey()}/>
            } else if (type === "SIDEBARADDSPU") {
                media = <SPU data={data} readOnly={this.props.readOnly} delMedia={this.delMedia}
                             entityKey={props.block.getEntityAt(0)} blockKey={props.block.getKey()}
                             ContentComments={ContentComments}
                             replace={this.replaceImg}/>
            }
            return media;
        }
    };

    editItem = (entityKey) => {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        let entity = contentState.getEntity(entityKey);
        var data = entity.getData();
        this.setState({
            addItemCallback: (item) => {
                debugger;
                let newContentState = contentState.replaceEntityData(entityKey, item);
                let newEditorState = EditorState.push(editorState, newContentState, "change-block-data");
                this.onChange(newEditorState);
            }
        }, () => {
            this.upItemBundleLoading(data);
        });
    };

    replaceItem = ({entityKey, item}) => {
        let editorState = this.state.editorState;
        let contentState = editorState.getCurrentContent();
        this.setState({
            commentCallback: (data) => {
                let newContentState = contentState.replaceEntityData(entityKey, data);
                let newEditorState = EditorState.push(editorState, newContentState, "change-block-data");
                this.onChange(newEditorState);
            }
        }, () => {
            this.comment.open(Object.assign({}, item));
        });
    };

    editImg = (entityKey) => {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        let entity = contentState.getEntity(entityKey);
        var data = entity.getData();
        this.setState({
            addImgCallback: (url, pa, img) => {

                let newContentState = contentState.replaceEntityData(entityKey, img);
                let newEditorState = EditorState.push(editorState, newContentState, "change-block-data");
                this.onChange(newEditorState);
            }
        }, () => {
            this.upImagesBundleLoading();
        });
    };

    replaceImg = ({entityKey, item}) => {
        console.log(12);
        let editorState = this.state.editorState;
        let contentState = editorState.getCurrentContent();
        this.setState({
            commentCallback: (data) => {
                let newContentState = contentState.replaceEntityData(entityKey, data);
                let newEditorState = EditorState.push(editorState, newContentState, "change-block-data");
                this.onChange(newEditorState);
            }
        }, () => {
            this.comment.open(Object.assign({}, item));
        });
    };

    editHotImg = (entityKey) => {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        let entity = contentState.getEntity(entityKey);
        var data = entity.getData();
        this.setState({
            addHotImgCallback: (img) => {
                let newContentState = contentState.replaceEntityData(entityKey, img);
                let newEditorState = EditorState.push(editorState, newContentState, "change-block-data");
                this.onChange(newEditorState);
            }
        }, () => {
            let pa = {
                w: data.picWidth,
                h: data.picHeight,
            };
            this.upHotImagesBundleLoading(data.url, pa, undefined, data.hotSpaces,data.showPoint);
        });
    };

    delMedia = (entityKey, blockKey) => {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        var selectionState = SelectionState.createEmpty(blockKey);
        var updatedSelection = selectionState.merge({
            focusKey: blockKey,
            focusOffset: 1,
        });

        var newContentState = Modifier.removeRange(contentState, updatedSelection, "RTL");
        newContentState = Modifier.moveText(newContentState, updatedSelection, updatedSelection);
        newContentState = Modifier.setBlockType(newContentState, updatedSelection, "unstyled");
        // editorState.setCurrentContent(newContentState)
        let newEditorState = EditorState.push(editorState, newContentState, "move-block");
        this.onChange(newEditorState);

    };

    addSerialNumber = (eventKey, event) => {
        let tb;
        switch (eventKey) {
            case 1:
                tb = "❶";
                break;
            case 2:
                tb = "❷";
                break;
            case 3:
                tb = "❸";
                break;
            case 4:
                tb = "❹";
                break;
            case 5:
                tb = "❺";
                break;
            case 6:
                tb = "❻";
                break;
            case 7:
                tb = "❼";
                break;
            case 8:
                tb = "❽";
                break;
            case 9:
                tb = "❾";
                break;
            case 10:
                tb = "❿";
                break;
        }
        let editorState = this.state.editorState;
        let contentState = editorState.getCurrentContent();
        let selectionState = editorState.getSelection();
        contentState = Modifier.removeRange(contentState, selectionState, "RTL");
        editorState = EditorState.push(editorState, contentState, "move-block");
        selectionState = editorState.getSelection();

        contentState = Modifier.insertText(contentState, selectionState, "— " + tb + " —小标题");
        let key;
        if (selectionState.getFocusOffset() > 0) {
            contentState = Modifier.splitBlock(contentState, selectionState);
            key = contentState.getBlockAfter(selectionState.getAnchorKey()).getKey();
        } else {
            key = selectionState.getAnchorKey();
        }

        selectionState = selectionState.merge({
            focusKey: key,
            focusOffset: 5,
            anchorKey: key,
            anchorOffset: 5
        });
        contentState = Modifier.splitBlock(contentState, selectionState);
        let skey = contentState.getBlockAfter(key).getKey();
        selectionState = selectionState.merge({
            focusKey: skey,
            focusOffset: 3,
            anchorKey: key,
            anchorOffset: 0
        });

        // editorState = EditorState.push(editorState, contentState, "change-block-data");
        // editorState = EditorState.forceSelection(editorState, selectionState);
        contentState = Modifier.applyInlineStyle(contentState, selectionState, "BOLD");
        contentState = Modifier.setBlockType(contentState, selectionState, "alignCenter");
        editorState = EditorState.push(editorState, contentState, "change-block-data");
        this.onChange(editorState);
    };

    selectionChange = () => {
        if (this.addItemModal) {
            this.addItemModal.jd.selectionChange();
        }
    };

    upImagesBundleLoading = () => {//添加图片热加载
        if (this.addImgModal&&this.addImgModal.jd) {
            this.addImgModal.jd.open();
        }
    };
    upItemBundleLoading = (data) => {//添加商品热加载
        if (this.addItemModal&&this.addItemModal.jd) {
            this.addItemModal.jd.open(data);
        }
    };
    upHotImagesBundleLoading = (url, param, img, hotSpaces,showPoint) => {//编辑热区图热加载
        if (this.upHotImages&&this.upHotImages.jd) {
            this.upHotImages.jd.open(url, param, img, hotSpaces,showPoint);
        }
    };
    upShopBundleLoading = () => {//选择店铺热加载
        if (this.upShop&&this.upShop.jd) {
            this.upShop.jd.open();
        }
    };
    upSPUItemBundleLoading = () => {//上传产品热加载
        if (this.upSPUItem&&this.upSPUItem.jd) {
            this.upSPUItem.jd.open();
        }
    };


    render() {
        let {editorState} = this.state;
        let {imgDisabled, hotImgDisabled, itemDisabled, shopDisabled, SPUDisabled, numberDisabled, constraint, readOnly, ContentComments} = this.props;
        let plugins = constraint ? constraint.props.plugins : undefined;
        let p = undefined, b = undefined, spu = undefined, o = {};
        for (let i in plugins) {
            if (plugins[i] instanceof Object) {
                if (plugins[i].name == "SIDEBARSEARCHITEM") {
                    p = plugins[i].props;
                } else if (plugins[i].name == "SIDEBARHOTSPACEIMAGE") {
                    b = plugins[i].props;
                } else if (plugins[i].name == "SIDEBARADDSPU") {
                    spu = plugins[i].props;
                }
            }
        }
        const props = p ? {
            minTitle: p.editTitleMinLength ? p.editTitleMinLength : undefined,
            maxTitle: p.editTitleMaxLength ? p.editTitleMaxLength : undefined,
            description: p.editDescMaxLength ? true : false,
            minDescription: p.editDescMinLength ? p.editDescMinLength : undefined,
            maxDescription: p.editDescMaxLength ? p.editDescMaxLength : undefined
        } : {
            minTitle: constraint ? constraint.props.editTitleMinLength : undefined,
            maxTitle: constraint ? constraint.props.editTitleMaxLength : undefined,
            description: constraint ? constraint.props.itemDescribe : undefined,
            minDescription: constraint ? constraint.props.ItemDescribeMin : undefined,
            maxDescription: constraint ? constraint.props.ItemDescribeMax : undefined
        };
        return (
            <div className="DraftEditor-root">
                {readOnly != true && !ContentComments ?
                    <div className={"editBoxButs"}>
                     <span className='RichEditor-controls'>
                         <Tooltip content="上一步" placement="top">
                             <span className='RichEditor-styleButton' onMouseDown={this.undo}>
                                 <span className='glyphicon glyphicon-arrow-left'> </span>
                             </span>
                         </Tooltip>
                         <Tooltip content="下一步" placement="top">
                             <span className='RichEditor-styleButton' onMouseDown={this.redo}>
                                 <span className='glyphicon glyphicon-arrow-right'> </span>
                             </span>
                         </Tooltip>
                     </span>
                        <span>
                                 {this.props.InlineStyle != false ? <InlineStyleControls
                                     editorState={editorState} onToggle={this.toggleInlineStyle}
                                 /> : undefined}

                            <BlockStyleControls
                                BLOCK_TYPES_HEADER={this.props.BLOCK_TYPES_HEADER != false}
                                BLOCK_TYPES_ALIGNMENT={this.props.BLOCK_TYPES_ALIGNMENT != false}
                                BLOCK_TYPES_CODE={this.props.BLOCK_TYPES_CODE != false}
                                editorState={editorState}
                                onToggle={this.toggleBlockType}/>

                           <span className='RichEditor-controls'>
                               {imgDisabled&&<Tooltip content="添加图片" placement="bottom">
                                   <span className='RichEditor-styleButton' onMouseDown={this.addImg}>图片</span>
                               </Tooltip>}
                               {hotImgDisabled&&<Tooltip content="添加热区图" placement="bottom">
                                   <span className='RichEditor-styleButton' onMouseDown={this.addHotImg}>热区图</span>
                               </Tooltip>}
                               {itemDisabled&&<Tooltip content="添加商品" placement="bottom">
                                   <span className='RichEditor-styleButton' onMouseDown={this.addItem}>商品</span>
                               </Tooltip>}
                               {shopDisabled&&<Tooltip content="添加店铺" placement="bottom">
                                   <span className='RichEditor-styleButton' onMouseDown={this.addShop}>店铺</span>
                               </Tooltip>}
                               {SPUDisabled&&<Tooltip content="添加产品" placement="bottom">
                                   <span className='RichEditor-styleButton' onMouseDown={this.addSPU}>产品</span>
                               </Tooltip>}
                           </span>
                            {numberDisabled&&
                                <Dropdown trigger="click" onCommand={value=>this.addSerialNumber(value)} menu={(
                                    <Dropdown.Menu>
                                        <Dropdown.Item key='1' command={1}>— ❶ —</Dropdown.Item>
                                        <Dropdown.Item key='2' command={2}>— ❷ —</Dropdown.Item>
                                        <Dropdown.Item key='3' command={3}>— ❸ —</Dropdown.Item>
                                        <Dropdown.Item key='4' command={4}>— ❹ —</Dropdown.Item>
                                        <Dropdown.Item key='5' command={5}>— ❺ —</Dropdown.Item>
                                        <Dropdown.Item key='6' command={6}>— ❻ —</Dropdown.Item>
                                        <Dropdown.Item key='7' command={7}>— ❼ —</Dropdown.Item>
                                        <Dropdown.Item key='8' command={8}>— ❽ —</Dropdown.Item>
                                        <Dropdown.Item key='9' command={9}>— ❾ —</Dropdown.Item>
                                        <Dropdown.Item key='10' command={10}>— ❿ —</Dropdown.Item>
                                    </Dropdown.Menu>
                                )}>
                                  <span className="el-dropdown-link">
                                    插入编号<i className="el-icon-caret-bottom el-icon--right"> </i>
                                  </span>
                                </Dropdown>}
                            </span>
                    </div> : undefined}
                <Editor
                    style={{height: "500px"}}
                    blockStyleFn={getBlockStyle}  //块风格 对应的clsaa   左对其 右对其
                    blockRenderMap={DefaultDraftBlockRenderMap.merge(blockRenderMap)} //自定义渲染块 使用的html标签
                    blockRendererFn={this.mediaBlockRenderer} //自定义渲染组件
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={this.props.handleKeyCommand ? this.props.handleKeyCommand : this.handleKeyCommand}
                    keyBindingFn={this.props.keyBindingFn && this.props.keyBindingFn}
                    onChange={this.onChange}
                    stripPastedStyles={true} //设置是否从粘贴的内容中删除除明文之外的所有信息
                    ref='editor'
                    readOnly={this.props.readOnly}
                />
                {(SPUDisabled || imgDisabled) &&
                <BundleLoading load={UpImages} ref={e => this.addImgModal = e}
                               callback={this.state.hotImg ? this.state.addEditHotImg : this.state.addImgCallback}/>}
                {itemDisabled &&
                <BundleLoading load={UpIitem} ref={e => this.addItemModal = e} callback={this.state.addItemCallback}
                               choiceItemPool={this.props.constraint ? this.props.constraint.props.choiceItemPool : undefined}
                               data={this.props.data} judge={true} {...props}
                               categoryListApiQuery={p ? (p.categoryListApiQuery ? p.categoryListApiQuery : o) : o}
                               activityId={p && (p.activityId && p.activityId)}/>}
                {hotImgDisabled &&
                <BundleLoading load={UpHotImages} ref={e => this.upHotImages = e}
                               callback={this.state.addHotImgCallback} item={b}
                               activityId={b && (b.activityId && b.activityId)}
                               categoryListApiQuery={b ? (b.categoryListApiQuery ? b.categoryListApiQuery : undefined) : undefined}/>}
                {shopDisabled &&
                <BundleLoading load={UpShop} ref={e => this.upShop = e} callback={this.state.addShopCallback}/>}
                {SPUDisabled && <BundleLoading load={UpSPUItem} ref={e => this.upSPUItem = e} constraint={spu}
                                               callback={this.state.addSPUCallback}/>}
                {ContentComments && <Comment ref={e => this.comment = e} callback={this.state.commentCallback}
                                             readOnly={this.props.readOnly}/>}
            </div>
        );
    }
}

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            data: {},
        };
    }

    open = (data) => {
        this.setState({data, dialogVisible: true}, () => {
            let editBox = this.editBox;
            if (data.comment) {
                let contentState = convertFromRaw(data.comment);
                let editorState = EditorState.createWithContent(contentState);
                editBox.onChange(editorState);
            } else {
                let editorState = EditorState.createEmpty();
                editBox.onChange(editorState);
            }
        });
    };

    onChange = (value) => {
        let {data} = this.state;
        data.comment = value;
        this.setState({data});
    };

    submit = () => {
        let {data} = this.state;
        this.setState({dialogVisible: false, data: {}}, () => {
            this.props.callback(data);
        })
    };

    render() {
        let {dialogVisible} = this.state;
        let parameters = {
            imgDisabled: true,
            itemDisabled: true
        };
        return (
            <Dialog title="点评" size="tiny" visible={dialogVisible}
                        onCancel={() => this.setState({dialogVisible: false, data: {}})}
                        lockScroll={false} style={{textAlign: 'left'}}>
                <Dialog.Body>
                    <div className='commentEditBox'>
                        <MyEditor ref={e => this.editBox = e} onChange={this.onChange} {...parameters}
                                  readOnly={this.props.readOnly}/>
                    </div>
                </Dialog.Body>
                {!this.props.readOnly &&
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={() => this.setState({dialogVisible: false, data: {}})} size="small">取消</Button>
                    <Button type="primary" onClick={this.submit} size="small">确定</Button>
                </Dialog.Footer>}
            </Dialog>
        )
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' ' + 'RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.node ? this.props.node : this.props.label}
                </span>
        );
    }
}

const blockRenderMap = Immutable.Map({
    'header-two': {
        element: 'h2',
        aliasedElements: ['p'],
    },
    'alignLeft': {
        element: 'div',
    },
    'alignRight': {
        element: 'div',
    },
    'alignCenter': {
        element: 'div',
    },
});

function getBlockStyle(block) {

    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        case 'alignLeft':
            return 'align-left';
        case 'alignCenter':
            return 'align-center';
        case 'alignRight':
            return 'align-right';
        default:
            return null;
    }
}

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
    NOTDELETE: {
        color: "#02028b"
    },
    STRIKETHROUGH: {
        textDecoration: 'line-through',
        color: "#a2a2a2"
    },
    INSERTS: {
        color: "#b1bc01"
    }
};

const BLOCK_TYPES_HEADER = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},

];

const BLOCK_TYPES_ALIGNMENT = [
    {
        label: '左对齐',
        node:<Tooltip content="左对齐" placement="top">
            <i className="iconfont">&#xec89;</i>
        </Tooltip>,
        style: 'alignLeft'
    },
    {
        label: '居中',
        node:<Tooltip content="居中" placement="top">
            <i className="iconfont">&#xec80;</i>
        </Tooltip>,
        style: 'alignCenter'
    },
    {
        label: '右对齐',
        node:<Tooltip content="右对齐" placement="top">
            <i className="iconfont">&#xec82;</i>
        </Tooltip>,
        style: 'alignRight'
    },

];

const BLOCK_TYPES_CODE = [

    {label: '引用', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: '代码块', style: 'code-block'}
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    let BLOCK = [];
    if (props.BLOCK_TYPES_ALIGNMENT) BLOCK = BLOCK.concat(BLOCK_TYPES_ALIGNMENT);
    if (props.BLOCK_TYPES_HEADER) BLOCK = BLOCK.concat(BLOCK_TYPES_HEADER);
    if (props.BLOCK_TYPES_CODE) BLOCK = BLOCK.concat(BLOCK_TYPES_CODE);

    return (
        <span className="RichEditor-controls">

                {BLOCK.map((type) =>
                    <StyleButton
                        key={type.label}
                        active={type.style === blockType}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                        node={type.node}
                    />
                )}
                </span>
    );
};


var INLINE_STYLES = [
    {
        label: '加粗',
        node:<Tooltip content="加粗" placement="top">
            <i className="iconfont">&#xec83;</i>
        </Tooltip>,
        style: 'BOLD'
    },
    {
        label: '斜体',
        node:<Tooltip content="斜体" placement="top">
            <i className="iconfont">&#xec87;</i>
        </Tooltip>,
        style: 'ITALIC'
    },
    {
        label: '下划线',
        node:<Tooltip content="下划线" placement="top">
            <i className="iconfont">&#xec86;</i>
        </Tooltip>,
        style: 'UNDERLINE'
    }
];

const InlineStyleControls = (props) => {
    let currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <span className="RichEditor-controls">
                {INLINE_STYLES.map(type =>
                    <StyleButton
                        key={type.label}
                        active={currentStyle.has(type.style)}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                        node={type.node}
                    />
                )}
                </span>
    );
};

class ImgComment extends React.Component {
    render() {
        let {commentClick, children, commentValue} = this.props;
        let judge = (array) => {
            let ju = false;
            array.forEach((item) => {
                if (item.text) {
                    ju = true
                }
            });
            return ju;
        };
        return (
            <div>
                <div style={{position: 'relative'}}>
                    <div style={{position: 'absolute', zIndex: 66, right: 0, top: 0}}>
                        {commentValue && commentValue.blocks && judge(commentValue.blocks) ? <Badge value={'new'}>
                            <Button size="small" onClick={(e) => {
                                e.preventDefault();
                                commentClick();
                            }}>点评</Button>
                        </Badge> : <Button size="small" onClick={(e) => {
                            e.preventDefault();
                            commentClick();
                        }}>点评</Button>}
                    </div>
                </div>
                {children}
            </div>
        )
    }
}

const Item = (props) => {
    let imgDiv=<a href={"https://detail.tmall.com/item.htm?id=" + props.data.itemId} target="_blank">
        <img src={props.data.coverUrl}/>
    </a>;
    return <div className="editItem">
        {props.ContentComments ?
            <ImgComment commentClick={() => props.replace({
                entityKey: props.entityKey,
                blockKey: props.blockKey,
                item: props.data
            })}
                        commentValue={props.data.comment ? props.data.comment : ''}>
                {imgDiv}
            </ImgComment> : imgDiv}
        <h4 className="modalTitle">{props.data.title}</h4>
        <p>{props.data.description}</p>
        <div className="media_buttonG">
            {(props.readOnly != true && !props.ContentComments)&&
            <OperationButton delMedia={props.delMedia} edit={props.edit} entityKey={props.entityKey} blockKey={props.blockKey}/>}
        </div>
    </div>;
};

const OperationButton=(props)=>{
    return(
        <Layout.Row gutter="2">
            {props.noEdit?
                <Layout.Col span="24">
                    <Button type="danger" icon="delete" style={{width:'100%'}} onClick={(e)=>{
                        e.preventDefault();
                        props.delMedia(props.entityKey, props.blockKey);
                    }} size="small">删除</Button>
                </Layout.Col>:
                <React.Fragment>
                    <Layout.Col span="12">
                        <Button type="primary" icon="edit" style={{width:'100%'}} onClick={(e)=>{
                            e.preventDefault();
                            props.edit(props.entityKey, props.blockKey);
                        }} size="small">编辑</Button>
                    </Layout.Col>
                    <Layout.Col span="12">
                        <Button type="danger" icon="delete" style={{width:'100%'}} onClick={(e)=>{
                            e.preventDefault();
                            props.delMedia(props.entityKey, props.blockKey);
                        }} size="small">删除</Button>
                    </Layout.Col>
                </React.Fragment>}
        </Layout.Row>
    )
};

const ImageCustom = (props) => {

    return <div className="editImg">
        {props.ContentComments ?
            <ImgComment commentClick={() => props.replace({
                entityKey: props.entityKey,
                blockKey: props.blockKey,
                item: props.data
            })}
                        commentValue={props.data.comment ? props.data.comment : ''}>
                <img src={props.data.url}/>
            </ImgComment> : <img src={props.data.url}/>}
        <div className="media_buttonG">
            {(props.readOnly != true && !props.ContentComments)&&
            <OperationButton delMedia={props.delMedia} edit={props.edit} entityKey={props.entityKey} blockKey={props.blockKey}/>}
        </div>
    </div>;
};
const ImageHot = (props) => {
    let ImageHotDiv = <div style={{position: "relative"}}>
        <img src={props.data.url} width="100%" className="imgStyle"/>
        <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
            {props.data.hotSpaces.map((item, i) => {
                return (
                    <div className="hotImgAreaNum" key={+new Date() + i} onClick={() => {
                        window.open(item.data.detailUrl);
                    }} style={{
                        position: "absolute",
                        top: item.y + "%",
                        left: item.x + "%",
                        width: item.width + "%",
                        height: item.height + "%",
                        zIndex: 10000,
                        cursor: "pointer",
                        backgroundColor: "rgba(158, 213, 248, 0.24)",
                    }}>
                    </div>
                )
            })}
            {props.data.showPoint && props.data.hotSpaces.map((item, i) => {
                return (
                    <div key={i} style={{
                        position: "absolute",
                        top: (item.y + item.height / 2) + "%",
                        left: (item.x + item.width / 2) + "%",
                        zIndex: 10000 + 50,
                        cursor: "move",
                    }}>
                        <div style={{
                            width: '18px',
                            height: '18px',
                            backgroundColor: '#fff',
                            borderRadius: '9px',
                            top: '-9px',
                            left: '-9px',
                            position: "relative",
                            textAlign: 'center'
                        }}>
                            +
                        </div>
                    </div>
                )
            })}
        </div>
    </div>;
    return <div className="editImg">
        {props.ContentComments ?
            <ImgComment commentClick={() => props.replace({
                entityKey: props.entityKey,
                blockKey: props.blockKey,
                item: props.data
            })}
                        commentValue={props.data.comment ? props.data.comment : ''}>
                {ImageHotDiv}
            </ImgComment> : ImageHotDiv}
        <div className="media_buttonG">
            {(props.readOnly != true && !props.ContentComments) &&
            <OperationButton delMedia={props.delMedia} edit={props.edit} entityKey={props.entityKey} blockKey={props.blockKey}/>}
        </div>
    </div>;
};
const Shop = (props) => {
    let ShopDiv = <div style={{width: "248px"}}>
        <div style={{verticalAlign: "middle"}}>
            <img src="https://gw.alicdn.com/bao/uploaded/TB1RIsiPpXXXXXpXVXXXXXXXXXX-300-300.jpg"/>
        </div>
        <div className="shop-title">
            <img src={shop}/>
            {props.data.title}
        </div>
    </div>;
    return (
        <div style={{maxWidth: "248px"}}>
            {props.ContentComments ?
                <ImgComment commentClick={() => props.replace({
                    entityKey: props.entityKey,
                    blockKey: props.blockKey,
                    item: props.data
                })}
                            commentValue={props.data.comment ? props.data.comment : ''}>
                    {ShopDiv}
                </ImgComment> : ShopDiv}
            <div className="media_buttonG">
                {(props.readOnly != true && !props.ContentComments)&&
                <OperationButton delMedia={props.delMedia} noEdit={true} entityKey={props.entityKey} blockKey={props.blockKey}/>}
            </div>
        </div>
    )
};

const SPU = (props) => {
    let SPU_div = <div style={{width: "248px"}}>
        <div style={{verticalAlign: "middle"}}>
            <a href={props.data.url} target="_blank">
                <img src={props.data.coverUrl}/>
            </a>
        </div>
        <div className="spu-title" title={props.data.title}>
            {props.data.title}
        </div>
    </div>;
    return (
        <div style={{maxWidth: "248px"}}>
            {props.ContentComments ?
                <ImgComment commentClick={() => props.replace({
                    entityKey: props.entityKey,
                    blockKey: props.blockKey,
                    item: props.data
                })}
                            commentValue={props.data.comment ? props.data.comment : ''}>
                    {SPU_div}
                </ImgComment> : SPU_div}
            <div className="media_buttonG">
                {(props.readOnly != true && !props.ContentComments)&&
                <OperationButton delMedia={props.delMedia} noEdit={true} entityKey={props.entityKey} blockKey={props.blockKey}/>}
            </div>
        </div>
    )
};


MyEditor.propTypes = {};

export default MyEditor;
