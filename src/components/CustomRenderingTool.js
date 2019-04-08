
import * as React from 'react';
import Button from '@material-ui/core/Button';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

export const customToolRendering = function(Tool) {
    return function(props) {
        return (
            <Tool
                {...props}
                render={defaultRendering => {
                    return (
                        renderCustomTool(defaultRendering.props)
                    );
                }}
            />
        );
    };
};


export const renderCustomTool = function(toolProps) {
    const { icon, look, primary, togglable, selected, ...rest } = toolProps;
    let toolState = toolProps.disabled ? ' k-state-disabled' : '';
    const setContent = function() {
        if(toolProps.icon === "undo"){
            return <UndoIcon/>;
        }
        if(toolProps.icon === "redo") {
            return <RedoIcon/>;
        }
        return toolProps.title
    }
    return (
        <Button
            className={toolState}
            color={toolProps.selected ? "secondary" : "primary"}
            {...rest}
        >
        {setContent()}
        </Button>
    );
};
