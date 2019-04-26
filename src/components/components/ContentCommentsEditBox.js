import React from "react";
import EditBox from '../lib/sharing/editBox/EditBox'
import {
    EditorState,
    ContentState,
    Modifier,
    Entity,
    RichUtils,
    CharacterMetadata,
    SelectionState,
    getDefaultKeyBinding, convertFromRaw
} from "draft-js";
import AuditOpinion from "../page/visible/page/auditOpinion";

class ContentCommentsEditBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        document.title = "内容审稿-哇掌柜";

        let editBox = this.editBox;
        let data = this.props.data;
        if (data) {
            let oldData = data.oldData;
            let newData = data.newData;
            this.oldDataCL(oldData, () => {
                if (newData && typeof  newData == "object") {
                    let contentState = convertFromRaw(newData);
                    let editorState = EditorState.createWithContent(contentState);
                    editBox.onChange(editorState);
                }
            })
        }

    }

    oldDataCL = (oldData, callback) => {

        let editBox = this.editBox;

        if (typeof oldData == "string") {

            let editorState = editBox.state.editorState;
            let contentState = editorState.getCurrentContent();
            let selectionState = editorState.getSelection();
            contentState = Modifier.insertText(contentState, selectionState, oldData);
            selectionState = selectionState.merge({
                focusOffset: oldData.length,
                anchorOffset: 0
            });
            contentState = Modifier.applyInlineStyle(contentState, selectionState, "NOTDELETE");
            editorState = EditorState.push(editorState, contentState, "insert-characters");
            editorState = EditorState.push(editorState, contentState, "insert-characters");
            let text = this.getPlainText(editorState);
            this.setState({text: text}, () => {
                editBox.onChange(editorState);
                callback();
            })

        } else if (oldData) {
            let contentState = convertFromRaw(oldData);
            let editorState = EditorState.createWithContent(contentState);
            let selectionState = editorState.getSelection();
            let bls = contentState.getBlocksAsArray();
            selectionState = selectionState.merge({
                anchorKey: bls[0].getKey(),
                anchorOffset: 0,
                focusKey: bls[bls.length - 1].getKey(),
                focusOffset: bls[bls.length - 1].getLength()
            })
            contentState = Modifier.applyInlineStyle(contentState, selectionState, "NOTDELETE");
            editorState = EditorState.push(editorState, contentState, "insert-characters");
            let text = this.getPlainText(editorState);
            this.setState({text: text}, () => {
                editBox.onChange(editorState);
                callback();
            })
        } else {
            let contentState = ContentState.createFromText("");
            let editorState = EditorState.createWithContent(contentState);
            editBox.onChange(editorState);
            callback();
        }
    }


    keyBindingFn = (e) => {

        if (e.keyCode == 8) {
            return "backspace"
        }
        let s = getDefaultKeyBinding(e);

        if (!s) {
            let ins = "INSERTS";
            let editorState = this.editBox.state.editorState;
            let selectionState = editorState.getSelection();
            let contentState = editorState.getCurrentContent();
            contentState = Modifier.removeInlineStyle(contentState, selectionState, "NOTDELETE");
            contentState = Modifier.insertText(contentState, selectionState, " ");
            selectionState = selectionState.merge({focusOffset: selectionState.getEndOffset() + 1});
            contentState = Modifier.applyInlineStyle(contentState, selectionState, ins);
            editorState = EditorState.forceSelection(editorState, selectionState);
            editorState = EditorState.push(editorState, contentState, "change-inline-style");
            this.editBox.onChange(editorState);
        }
        return s;
    }

    handleKeyCommand = (command) => {

        let editorState = this.editBox.state.editorState;
        let selectionState = editorState.getSelection();
        let contentState = editorState.getCurrentContent();
        let startOffset = selectionState.getStartOffset();

        if (command == "backspace" && editorState.getCurrentInlineStyle().has("NOTDELETE")) {
            let s = "STRIKETHROUGH";
            let key = selectionState.getStartKey();
            if (startOffset >= 0) {
                let anchorOffset = startOffset - 1;
                if (selectionState.getStartOffset() == selectionState.getEndOffset() && selectionState.getStartKey() == selectionState.getEndKey()) {
                    selectionState = selectionState.merge({
                        anchorOffset: anchorOffset,
                    });
                } else {
                    anchorOffset = selectionState.getStartOffset();
                }
                let lineStyle = editorState.getCurrentInlineStyle();
                let hasOwnProperty = lineStyle.has(s);
                if (hasOwnProperty) {
                    contentState = Modifier.removeInlineStyle(contentState, selectionState, s);
                } else {
                    contentState = Modifier.applyInlineStyle(contentState, selectionState, s);
                }

                editorState = EditorState.push(editorState, contentState, "change-inline-style");
                selectionState = selectionState.merge({
                    focusOffset: anchorOffset,
                    focusKey: key,
                    anchorKey: key,
                    anchorOffset: anchorOffset
                });
                editorState = EditorState.forceSelection(editorState, selectionState);
                this.editBox.onChange(editorState);
            }
            return 'handled';
        } else {
            return 'not-handled';
        }
        return 'not-handled';
    }

    onChangeBefore = (editorState) => {
        this.getPlainText(editorState);
        let nText = this.getPlainText(editorState);
        // return editorState;
        if (this.state.text == nText) {
            return editorState;
        } else {
            let changeType = editorState.getLastChangeType();
            if ("undo" == changeType) {
                return EditorState.redo(editorState);
            } else {
                return EditorState.undo(editorState);
            }
        }
    }

    getPlainText = (editorState) => {
        let contentState = editorState.getCurrentContent();
        let blocksAsArray = contentState.getBlocksAsArray();
        let plainText = "";
        for (let i in blocksAsArray) {
            let bk = blocksAsArray[i];
            let text = bk.getText();
            for (let j = 0; j < text.length; j++) {
                if (bk.getInlineStyleAt(j).has("NOTDELETE") || bk.getInlineStyleAt(j).has("STRIKETHROUGH")) {
                    plainText += text[j];
                }
            }
        }
        return plainText;
    };


    render() {
        let parameters={
            imgDisabled:true,
            itemDisabled:true
        };
        return <EditBox ref={e => this.editBox = e} readOnly={this.props.disabled} ContentComments
                        onChange={this.props.onChange}
                        onChangeBefore={this.onChangeBefore} {...parameters}
                        handleKeyCommand={this.handleKeyCommand} keyBindingFn={this.keyBindingFn}/>
    }

}

export default ContentCommentsEditBox;

