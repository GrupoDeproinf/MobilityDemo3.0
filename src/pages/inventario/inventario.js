import {
  Button,
  DataGrid,
  ScrollView,
  Popup,
  Form,
  SelectBox,
  NumberBox,
} from "devextreme-react";
import {
  Column,
  ColumnChooser,
  Export,
  FilterRow,
  HeaderFilter,
  Paging,
} from "devextreme-react/data-grid";
import React, { useEffect, useState } from "react";
import { articulos, empresa, inventario as initialInventario, tipo } from "./data_test";
import { GroupItem, Item, Label } from "devextreme-react/form";

import * as DinamicQueries from "../../api/DinamicsQuery";
import * as ReportsService from "../../api/reports";

const InventarioPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dataForm, setDataForm] = useState({
    tipo_movimiento: "",
    numero_orden: "",
    no_factura: "",
    empresa: "",
    region: "",
    cuenta_dotar: "",
    empleado_interno: "",
    responsable: "",
    tipo_articulo: "",
    articulo: "",
    detalle_orden: [{ monto_unitario: 0, cantidad: 0, monto_total: 0 }],
  });
  const [regiones, setRegiones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [inventario, setInventario] = useState(initialInventario);

  useEffect(() => {
    DinamicQueries.getData("getRegiones", "inventario/").then((res) => {
      console.log("🚀 ~ DinamicQueries.getData ~ res.data:", res.data);
      const data = res.data
      data.forEach(element => {
        
      });
    });

    ReportsService.getClients().then((resp) => {
      console.log("🚀 ~ ReportsService.getClients ~ resp:", resp.data);
      setClientes(resp.data);
    });
  }, []);

  useEffect(() => {
    const detalle_orden = dataForm.detalle_orden[0];
    const monto_total = detalle_orden.monto_unitario * detalle_orden.cantidad;
    setDataForm((prevData) => ({
      ...prevData,
      detalle_orden: [{ ...detalle_orden, monto_total }],
    }));
  }, [dataForm.detalle_orden[0].monto_unitario, dataForm.detalle_orden[0].cantidad]);

  const options = [
    { id: 1, name: "Entrada", value: "entrada" },
    { id: 2, name: "Salida", value: "salida" },
    { id: 3, name: "Baja", value: "baja" },
  ];

  const openPopup = () => {
    setShowPopup(true);
  };

  const hidePopup = () => {
    setShowPopup(false);
    resetForm();
  };

  const resetForm = () => {
    setDataForm({
      tipo_movimiento: "",
      numero_orden: "",
      no_factura: "",
      empresa: "",
      region: "",
      cuenta_dotar: "",
      empleado_interno: "",
      responsable: "",
      tipo_articulo: "",
      articulo: "",
      detalle_orden: [{ monto_unitario: 0, cantidad: 0, monto_total: 0 }],
    });
  };

  const handleSubmit = () => {
    const newMovimiento = { ...dataForm, id_movimiento: inventario.length + 1 };
    if (newMovimiento.tipo_movimiento === "salida") {
      newMovimiento.detalle_orden[0].cantidad = -Math.abs(newMovimiento.detalle_orden[0].cantidad);
    }
    setInventario([...inventario, newMovimiento]);
    resetForm();
    hidePopup();
  };

  const renderContent = () => {
    return (
      <ScrollView height="100%" width="100%">
        <Form className="form-container" style={{ height: "100%" }}>
          <GroupItem colCount={3} style={{ height: "100%" }}>
            <Item>
              <Label text="Tipo de Movimiento" />
              <SelectBox
                dataSource={options}
                valueExpr="value"
                displayExpr="name"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, tipo_movimiento: e.value })
                }
              />
            </Item>
            <Item>
              <Label>Número de Orden</Label>
              <NumberBox
                showClearButton={true}
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, numero_orden: e.value })
                }
              />
            </Item>
            <Item>
              <Label>Número de Factura</Label>
              <NumberBox
                showClearButton={true}
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, no_factura: e.value })
                }
              />
            </Item>
          </GroupItem>
          <GroupItem colCount={3}>
            <Item>
              <Label text="Empresa" />
              <SelectBox
                dataSource={empresa}
                valueExpr="value"
                displayExpr="name"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, empresa: e.value })
                }
              />
            </Item>
            <Item>
              <Label text="Región" />
              <SelectBox
                dataSource={regiones}
                valueExpr="cod_region"
                displayExpr="nombre_region"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, region: e.value })
                }
              />
            </Item>
            <Item>
              <Label text="Cuenta a dotar" />
              <SelectBox
                dataSource={clientes}
                valueExpr="cod_cliente"
                displayExpr="nombre_cliente"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, cuenta_dotar: e.value })
                }
              />
            </Item>
          </GroupItem>
          <GroupItem colCount={2}>
            <Item>
              <Label text="Empleado Interno" />
              <SelectBox
                dataSource={clientes}
                valueExpr="cod_cliente"
                displayExpr="nombre_cliente"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, empleado_interno: e.value })
                }
              />
            </Item>
            <Item>
              <Label text="Responsable" />
              <SelectBox
                dataSource={clientes}
                valueExpr="cod_cliente"
                displayExpr="nombre_cliente"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, responsable: e.value })
                }
              />
            </Item>
          </GroupItem>
          <GroupItem colCount={2}>
            <Item>
              <Label text="Tipo de artículo" />
              <SelectBox
                dataSource={tipo}
                valueExpr="value"
                displayExpr="name"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, tipo_articulo: e.value })
                }
              />
            </Item>
            <Item>
              <Label text="Artículos" />
              <SelectBox
                dataSource={articulos}
                valueExpr="value"
                displayExpr="name"
                onValueChanged={(e) =>
                  setDataForm({ ...dataForm, articulo: e.value })
                }
              />
            </Item>
          </GroupItem>
          <GroupItem colCount={3}>
            <Item>
              <Label>Monto Unitario</Label>
              <NumberBox
                showClearButton={true}
                onValueChanged={(e) =>
                  setDataForm({
                    ...dataForm,
                    detalle_orden: [
                      { ...dataForm.detalle_orden[0], monto_unitario: e.value },
                    ],
                  })
                }
              />
            </Item>
            <Item>
              <Label>Cantidad</Label>
              <NumberBox
                showClearButton={true}
                onValueChanged={(e) =>
                  setDataForm({
                    ...dataForm,
                    detalle_orden: [
                      { ...dataForm.detalle_orden[0], cantidad: e.value },
                    ],
                  })
                }
              />
            </Item>
            <Item>
              <Label>Total</Label>
              <NumberBox
                showClearButton={true}
                readOnly={true}
                value={dataForm.detalle_orden[0].monto_total}
              />
            </Item>
          </GroupItem>
        </Form>
      </ScrollView>
    );
  };

  return (
    <div>
      <div className="header-grid-right">
        <Button className="btn-agregar mt-3" onClick={openPopup}>
          Añadir Movimiento
        </Button>
      </div>
      <DataGrid
        className="tabla-Cliente"
        dataSource={inventario}
        showBorders={true}
        remoteOperations={true}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        style={{ height: "430px", width: "100%" }}
        keyExpr="id_movimiento"
        wordWrapEnabled={true}
      >
        <Export enabled={true} />
        <ColumnChooser enabled={true} mode="select" />
        <FilterRow visible={true} />
        <Paging defaultPageSize={12} />
        <HeaderFilter visible={true} />
        <Column
          width={100}
          caption="ID Movimiento"
          dataField="id_movimiento"
          dataType="number"
          sortOrder="asc"
        />
        <Column
          width={120}
          caption="Tipo de Movimiento"
          dataField="tipo_movimiento"
          dataType="string"
        />
        <Column
          width={120}
          caption="Número de Orden"
          dataField="numero_orden"
          dataType="string"
        />
        <Column
          width={120}
          caption="Número de Factura"
          dataField="no_factura"
          dataType="string"
        />
        <Column
          width={200}
          caption="Empresa"
          dataField="empresa"
          dataType="string"
        />
        <Column
          width={140}
          caption="Región"
          dataField="region"
          dataType="string"
        />
        <Column
          width={200}
          caption="Cuenta a dotar"
          dataField="cuenta_dotar"
          dataType="string"
        />
        <Column
          width={150}
          caption="Empleado Interno"
          dataField="empleado_interno"
          dataType="string"
        />
        <Column
          width={150}
          caption="Responsable"
          dataField="responsable"
          dataType="string"
        />
        <Column
          width={150}
          caption="Tipo Artículo"
          dataField="tipo_articulo"
          dataType="string"
        />
        <Column
          width={150}
          caption="Artículo"
          dataField="articulo"
          dataType="string"
        />
        <Column
          width={150}
          caption="Monto Unitario"
          dataField="detalle_orden[0].monto_unitario"
          dataType="number"
        />
        <Column
          width={150}
          caption="Cantidad"
          dataField="detalle_orden[0].cantidad"
          dataType="number"
        />
        <Column
          width={150}
          caption="Monto Total"
          dataField="detalle_orden[0].monto_total"
          dataType="number"
        />
      </DataGrid>

      <Popup
        width={"80%"}
        height={"85%"}
        visible={showPopup}
        onHiding={hidePopup}
        showCloseButton={true}
        contentRender={renderContent}
        toolbarItems={[
          {
            widget: "dxButton",
            toolbar: "bottom",
            location: "after",
            options: {
              text: "Guardar",
              onClick: handleSubmit,
            },
          },
          {
            widget: "dxButton",
            toolbar: "bottom",
            location: "after",
            options: {
              text: "Cancelar",
              onClick: hidePopup,
            },
          },
        ]}
      />
    </div>
  );
};

export default InventarioPage;
