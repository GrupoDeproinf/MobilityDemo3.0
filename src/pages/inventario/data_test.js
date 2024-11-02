export const inventario = [
    {
      id_movimiento: 1,
      tipo_orden: "",
      numero_orden: "",
      no_factura: "",
      empresa: "CONSORCIO PROMOTING C.A.",
      region: "CAPITAL",
      fecha_creacion: "",
      cuenta_dotar: "",
      empleado_interno: "",
      cliente_op: "",
      orden_op: "",
      plan: "",
      responsable: "",
      detalle_orden: [
        {
          articulo: "",
          tipo: "",
          monto_unitario: 0,
          cantidad: 5,
          monto_total: 0,
          disponible: 0,
        },
      ],
      observaciones: "",
    },
  ];
  
  export const tipo = [
    { id: 1, name: "Uniformes", value: "uniforms" },
    { id: 2, name: "Otros", value: "others" },
  ];
  
  export const articulos = [
    { id: 1, name: "Camisa azul oscura", value: "camisa azul oscura" },
    { id: 2, name: "Camisa azul claro", value: "camisa azul claro" },
    { id: 3, name: "Camisa blanca", value: "camisa blanca" },
  ];
  
  export const empresa = [
    { id: 1, name: "CONSORCIO PROMOTING C.A.", value: "promoting" },
    { id: 2, name: "WORKFORCE", value: "workforce" },
    { id: 3, name: "TRADE", value: "trade" },
  ];
  