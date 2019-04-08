import React from 'react';
import './App.css';
import * as ReactDOM from 'react-dom';

import { Toolbar, ToolbarItem, ButtonGroup } from '@progress/kendo-react-buttons';
import '@progress/kendo-theme-material/dist/all.css';

import {
  EditorUtils, EditorDialogs,
  EditorToolsSettings, ProseMirror, EditorTools
} from '@progress/kendo-react-editor';

//Material UI
import Button from '@material-ui/core/Button';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

import CustomEditor from '../src/components/CustomEditor';
import ViewHtml from '../src/components/CustomViewHtml';
import { customToolRendering  } from '../src/components/CustomRenderingTool'


const Bold = customToolRendering(EditorTools.Bold);
const Italic = customToolRendering(EditorTools.Italic);
const Underline = customToolRendering(EditorTools.Underline);
const Undo = customToolRendering(EditorTools.Undo);
const Redo = customToolRendering(EditorTools.Redo);

class App extends React.Component {
  render() {
    return <CustomEditor
      defaultContent="Hello world"
      tools={[Bold, Italic, Underline, Undo, Redo, ViewHtml]} />
  }
}

export default App;
