import React from 'react';
import List from 'devextreme-react/list';

export default function LeftListForm(props) {

    const listAttrs = { class: 'list' };

    // const searchExpression = useState(['categoria']);

    const renderListGroup = (group) => {
        return <div className="city">{group.key}</div>;
    }

    return (
        <div className="leftListForm">
            <List
              selectionMode="single"
              dataSource={props.dataSource}
              grouped={true}
              collapsibleGroups={true}
              searchEnabled={true}
              searchMode='contains'
              itemRender={props.itemRender}
              groupRender={renderListGroup}
              elementAttr={listAttrs}
              className="formList"
              searchEditorOptions={{placeholder: 'Buscar'}}
            />
        </div>
    )
}