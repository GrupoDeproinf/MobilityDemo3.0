import React, { useState, useCallback, useRef } from 'react';
import './dynamic-grid.scss';
import CustomStore from 'devextreme/data/custom_store';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
  ColumnChooser,
  Export
} from 'devextreme-react/data-grid';

import ODataStore from 'devextreme/data/odata/store';

export default function DynamicGrid({ dataSource, columns, children }) {

  const allowedPageSizes = [8, 12, 20];

  console.log('Columnas en grid', columns);
  console.log('Data ', dataSource);

  return (
    <div className={'dynamic-grid'}>
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        remoteOperations={true}
        style={{height: '500px'}}
      >
        <Export enabled={true} />
          <ColumnChooser
              enabled={true}
              mode="select" 
          />
        {columns.map((item, i) =>{
          return item.type ?
            <Column
              key={item.cod_cliente}
              dataField = {item.field}
              caption   = {item.caption}
              field     = {item.type}
            />
          : 
            <Column
              key={item.cod_cliente}
              dataField = {item.field}
              caption   = {item.caption}
            />
        })}
        
        {/* <Column
          dataField="OrderDate"
          dataType="date"
        />
        <Column
          dataField="StoreCity"
          dataType="string"
        />
        <Column
          dataField="StoreState"
          dataType="string"
        />
        <Column
          dataField="Employee"
          dataType="string"
        />
        <Column
          dataField="SaleAmount"
          dataType="number"
          format="currency"
        /> */}
        <Paging defaultPageSize={12} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={allowedPageSizes}
        />
      </DataGrid>
    </div>
  );
}

