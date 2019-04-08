import React from 'react';
import * as ReactDOM from 'react-dom';

import { Toolbar, ToolbarItem, ButtonGroup } from '@progress/kendo-react-buttons';
import '@progress/kendo-theme-material/dist/all.css';

import {
  EditorUtils, EditorDialogs,
  EditorToolsSettings, ProseMirror, EditorTools
} from '@progress/kendo-react-editor';

//Material UI
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions  from '@material-ui/core/DialogActions';
import DialogContentText  from '@material-ui/core/DialogContentText';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

export default class CustomEditor extends React.Component {

    state = {
        view: undefined,
        linkDialog: false
    };

    _contentElement;

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        const { view } = this.state;
        if (view) {
            view.destroy();
        }
    }

    render() {
        const { tools = CustomEditor.defaultProps.tools } = this.props;
        const buttons = tools.map((item, index) =>
            Array.isArray(item) ?
                <ButtonGroup>{item.map(this.renderTool, index)}</ButtonGroup> :
                this.renderTool(item, index));

        return (
            <div
                className="k-widget k-editor"
            >
                <Toolbar>
                    {buttons.map((item, i) => <ToolbarItem className="k-tool-group" key={i}>{item}</ToolbarItem>)}
                </Toolbar>
                {(<div
                    style={{
                        height: '300px'
                    }}
                    className="k-content"
                >
                    <div
                        ref={e => this._contentElement = e}
                        style={{
                            boxSizing: 'border-box',
                            overflowY: 'scroll',
                            padding: '0 4px'
                        }}
                        className="k-editable-area"
                        suppressContentEditableWarning={true}
                    />
                </div>)}
                {this.renderDialog(EditorDialogs.InsertLinkDialog, EditorToolsSettings.link, 'linkDialog')}
            </div>
        );
    }

    renderDialog = (Component, settings, stateFlag) => {
        return this.state[stateFlag] && (
            <Component
                view={this.state.view}
                settings={settings}
                onClose={() => this.setState({ [stateFlag]: false })}
            />
        );
    }

    renderTool = (Tool, index) => {
        return (
            <Tool
                view={this.state.view}
                key={index}
            />
        );
    }

    // Here you can change anything of the Editor engine.
    initialize() {
        const { defaultContent = CustomEditor.defaultProps.defaultContent } = this.props;
        const schema = new ProseMirror.Schema({ nodes: EditorUtils.nodes, marks: EditorUtils.marks });
        const doc = EditorUtils.createDocument(schema, defaultContent);
        const state = ProseMirror.EditorState.create({ doc, plugins: this.plugins });
        const view = new ProseMirror.EditorView({ mount: this._contentElement }, {
            state,
            transformPastedHTML: this.onPasteHtml
        });

        this.setState({
            view: view
        });
    }

    get plugins() {
        let shortcuts = {
            ...EditorUtils.getShortcuts(),
            'Mod-k': () => {
                const { linkDialog } = this.state;
                if (!linkDialog) {
                    this.setState({ linkDialog: true });
                }
                return !linkDialog;
            }
        };

        return [
            new ProseMirror.Plugin({
                view: () => ({ update: editorView => this.setState({ view: editorView }) }),
                filterTransaction: (tr, editorState) => {
                    if (tr.docChanged) {
                        window.console.log('document is changed');
                    }

                    if (!tr.curSelection.eq(editorState.selection)) {
                        window.console.log('selection is changed');
                    }

                    // Returning false will prevent the change
                    return true;
                }
            }),
            ProseMirror.history(),
            ProseMirror.dropCursor(),
            ProseMirror.gapCursor(),
            ProseMirror.keymap(shortcuts),
            ProseMirror.keymap(ProseMirror.baseKeymap)
            // Add your custom plugin here.
        ];
    }

    onPasteHtml = (html) => {
        window.console.log(html);

        // Here you can modify and return the pasted HTML.
        return html;
    }
}