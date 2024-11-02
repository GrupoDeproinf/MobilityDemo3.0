// import React, { useEffect, useState } from "react";

// import { Button } from "devextreme-react/button";
// import SelectBox from "devextreme-react/select-box";
// import "./CuentasBanc.css";
// import TextBox from "devextreme-react/text-box";
// import { Form, SimpleItem, GroupItem, Label } from "devextreme-react/form";
// import { useAuth } from "../../contexts/auth";
// import axios from "axios";
// import settings from '../../api/enviroment';

// import DataGrid, {
//   Column,
//   Grouping,
//   GroupPanel,
//   Pager,
//   Paging,
//   SearchPanel,
// } from 'devextreme-react/data-grid';

// export default function CuentasBanc() {
//   const apiUrl = settings.apiUrl;

//   const [Agregar, setAgregar] = useState(false);
//   const [Editar, setEditar] = useState(false);
//   const { user } = useAuth();
//   const { token } = useAuth();
//   const [imagen, setimagen] = useState("");
//   const [check1, setcheck1] = useState(false);
//   const [check2, setcheck2] = useState(false);
//   const [uiduser, setuiduser] = useState("");
//   const [numeroCuen, setnumeroCuen] = useState("");
//   const [nombreBanco, setnombreBanco] = useState("");
//   const [tipoCuenta, settipoCuenta] = useState("");
//   const [estatus, setestatus] = useState("");
//   const [numeroBanco, setnumeroBanco] = useState("");

//   useEffect(() => {
//     console.log(nombreBanco);
//     console.log(numeroBanco);
//   }, []);

//   const abrirFormularioEditar = (
//     ncuenta,
//     nbanco,
//     tipoCuenta,
//     estatus,
//     nuBanco
//   ) => {
//     setnumeroCuen(ncuenta);
//     setnombreBanco(nbanco);
//     settipoCuenta(tipoCuenta);
//     setestatus(estatus);
//     setnumeroBanco(nuBanco);
//     setEditar(!Editar);
//   };

//   const abrirFormulario = () => {
//     setAgregar(!Agregar);
//   };

//   const Check1 = (e) => {
//     setcheck1(!check1);
//     if (check1 === true) {
//       settipoCuenta(e);
//     }
//   };

//   const Check2 = (e) => {
//     setcheck2(!check2);
//     if (check2 === true) {
//       settipoCuenta(e);
//     }
//   };

//   console.log(tipoCuenta);

//   function onSubmit() {
//     axios
//       .post(
//         `${apiUrl}AddBanco`,
//         {
//           uiduser: user.uid,
//           numeroCuen: numeroCuen,
//           nombreBanco: nombreBanco,
//           tipoCuenta: tipoCuenta,
//           estatus: estatus,
//           numeroBanco: numeroBanco,
//         },

//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )

//       .then((res) => {
//         if (res.data) {
//           console.log(res.data);
//           alert("Banco agregado con exito");
//           setnumeroCuen("");
//           setnombreBanco("");
//           settipoCuenta("");
//           setestatus("");
//           setnumeroBanco("");
//           setEditar(false);
//           setAgregar(false);
//         }
//       })
//       .catch((er) => {
//         console.log(er);
//         alert("intentelo de nuevo");
//       });
//   }

//   function cancelar() {
//     setnumeroCuen("");
//     setnombreBanco("");
//     settipoCuenta("");
//     setestatus("");
//     setnumeroBanco("");
//     setEditar(false);
//     setAgregar(false);
//   }

//   function onChange() {
//     axios
//       .post(
//         `${apiUrl}UpdateBanco`,
//         {
//           uiduser: user.uid,
//           numeroCuen: numeroCuen,
//           nombreBanco: nombreBanco,
//           tipoCuenta: tipoCuenta,
//           estatus: estatus,
//           numeroBanco: numeroBanco,
//         },

//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )

//       .then((res) => {
//         if (res.data) {
//           console.log(res.data);
//           alert("editado con exito");
//           setnumeroCuen("");
//           setnombreBanco("");
//           settipoCuenta("");
//           setestatus("");
//           setnumeroBanco("");
//           setEditar(false);
//           setAgregar(false);
//         }
//       })
//       .catch((er) => {
//         console.log(er);
//         alert("intentelo de nuevo");
//       });
//   }

//   function onDelete(e) {
//     axios
//       .post(
//         `${apiUrl}DeleteBanco`,
//         {
//           uiduser: user.uid,
//           numeroCuen: e,
//         },

//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )

//       .then((res) => {
//         if (res.data) {
//           console.log(res.data);
//         }
//       })
//       .catch((er) => {
//         console.log(er);
//       });
//   }

//   return (
//     <div className={"content-block dx-card responsive-paddings"}>
//       <div>
//         {Editar === true || Agregar === true ? (
//           ""
//         ) : (
//           <div>
//             <div className={"tituloCuentasBancarias"}>
//               Cuentas Bancarias
//               <Button onClick={abrirFormulario} className="btnBanco">
//                 Agregar
//               </Button>
//             </div>

//             <DataGrid
//               dataSource={DatosBancarios}
//               showBorders={true}
//               remoteOperations={true}
//               style={{height: '500px'}}
//             >
//               <Column
//                 caption='Nombre del banco'
//                 dataField="nombreBanco"
//                 dataType="string"
//               />
//               <Column
//                 caption='Numero de cuenta'
//                 dataField="numeroCuen"
//                 dataType="number"
//               />
//               <Column
//                 caption='Tipo de cuenta'
//                 dataField="tipoCuenta"
//                 dataType="string"
//               />
//               <Column
//                 caption='Estatus'
//                 dataField="estatus"
//                 dataType="string"
//               />
//               {/* <Column
//                 caption='Acción'
//                 dataType="string"
//               /> */}
//               <Paging defaultPageSize={12} />
//               <Pager
//                 showPageSizeSelector={true}
//                 allowedPageSizes={allowedPageSizes}
//               />
//             </DataGrid>

//             {/* <Table className="text-center">
//               <thead>
//                 <tr>
//                   <th>Nombre del banco</th>
//                   <th>Numero de cuenta</th>
//                   <th>Tipo de cuenta</th>
//                   <th>Cedula</th>
//                   <th>Estatus</th>
//                   <th>Acción</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {user.DatosBancarios.map((items) => (
//                   <tr>
//                     <td>{items.nombreBanco}</td>
//                     <td>{items.numeroCuen}</td>
//                     <td>{items.tipoCuenta}</td>
//                     <td>{user.cedula}</td>
//                     <td>{items.estatus}</td>
//                     <td>
//                       <Button
//                         className="edi"
//                         onClick={() =>
//                           abrirFormularioEditar(
//                             items.numeroCuen,
//                             items.nombreBanco,
//                             items.tipoCuenta,
//                             items.estatus,
//                             items.numeroBanco
//                           )
//                         }
//                         color="primary"
//                       >
//                         Editar
//                       </Button>
//                       <Button
//                         type="danger"
//                         onClick={() => onDelete(items.numeroCuen)}
//                         color="primary"
//                       >
//                         Eliminar
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table> */}
//           </div>
//         )}
//         {Agregar === false ? (
//           <></>
//         ) : (
//           <div className={"content-block dx-card responsive-paddings"}>
//             <h2 className={"tituloCuentasBancarias"}>Cuentas Bancarias</h2>

//             <div>
//               <Button className="btnBancoAgregar" onClick={onSubmit}>
//                 Agregar
//               </Button>
//             </div>
//             <h2 className={"TituloBeneficiario"}>DATOS DEL BENEFICIARIO</h2>

//             <TextBox
//               className="inputCuentasBanco"
//               value={user.nombre}
//               label="Nombre"
//             />

//             <TextBox
//               className="inputCuentasBanco"
//               value={user.apellido}
//               label="Apellido"
//             />

//             <TextBox
//               className="inputCuentasBanco"
//               value={user.cedula}
//               label="Cedula"
//             />
//             <Form className="">
//               <GroupItem>
//                 <div className="flex-col  justify-center">
//                   <div className="selectBancos">
//                     <SelectBancos
//                       nombre={setnombreBanco}
//                       codigo={setnumeroBanco}
                      
//                     />
//                   </div>

//                   <TextBox
//                     className="inputCuentasBanco"
//                     label="Numero de cuenta"
//                     value={numeroCuen}
//                     onValueChanged={(e) => setnumeroCuen(e.value)}
//                   />
//                   <div className="Checks">
//                     <div>
//                       <FormControlLabel
//                         label={
//                           <Typography variant="" color="textSecondary">
//                             Cuenta corriente
//                           </Typography>
//                         }
//                         control={
//                           <Checkbox
//                             color="warning"
//                             checked={check1}
//                             onChange={() => Check1("Corriente")}
//                           />
//                         }
//                       />

//                       <FormControlLabel
//                         label={
//                           <Typography variant="" color="textSecondary">
//                             Cuenta ahorro
//                           </Typography>
//                         }
//                         control={
//                           <Checkbox
//                             color="warning"
//                             checked={check2}
//                             onChange={() => Check2("Ahorro")}
//                           />
//                         }
//                       />
//                     </div>
//                   </div>

//                   <TextBox
//                     className="inputCuentasBanco"
//                     label="Estatus"
//                     value={estatus}
//                     onValueChanged={(e) => setestatus(e.value)}
//                   />
//                 </div>
//               </GroupItem>
//             </Form>
//           </div>
//         )}

//         {Editar === false ? (
//           <></>
//         ) : (
//           <div className={"content-block dx-card responsive-paddings"}>
//             <h2 className={"tituloCuentasBancarias"}>Cuentas Bancarias</h2>

//             <div>
//               <Button className="btnBancoEditarAceptar" onClick={onChange}>Aceptar</Button>
//               <Button className="btnBancoEditarEliminar" onClick={cancelar} type="danger">
//                 cancelar
//               </Button>
//             </div>

//             <h2 className={"TituloBeneficiario"}>DATOS DEL BENEFICIARIO</h2>

//             <TextBox
//               className="inputCuentasBanco"
//               value={user.nombre}
//               label="Nombre"
//             />

//             <TextBox
//               className="inputCuentasBanco"
//               value={user.apellido}
//               label="Apellido"
//             />

//             <TextBox
//               className="inputCuentasBanco"
//               value={user.cedula}
//               label="Cedula"
//             />

//             <Form className="">
//               <GroupItem>
//                 <div className="flex-col  justify-center">
//                   <SelectBox 
//                     label="Banco"
//                     labelMode="floating"
//                     dataSource={Nacionalidad}
//                     valueExpr="ID"
//                     displayExpr="Name"
//                     className="selectBancos"

//                     nombre={setnombreBanco}
//                     codigo={setnumeroBanco}
//                   />

//                   <TextBox
//                     className="inputCuentasBanco"
//                     label="Numero de cuenta"
//                     value={numeroCuen}
//                     onValueChanged={(e) => setnumeroCuen(e.value)}
//                   />

//                   <div className="Checks">
//                     <div>
//                       <FormControlLabel
//                         label={
//                           <Typography variant="" color="textSecondary">
//                             Cuenta corriente
//                           </Typography>
//                         }
//                         control={
//                           <Checkbox
//                             color="warning"
//                             checked={check1}
//                             onChange={() => Check1("Corriente")}
//                           />
//                         }
//                       />

//                       <FormControlLabel
//                         label={
//                           <Typography variant="" color="textSecondary">
//                             Cuenta ahorro
//                           </Typography>
//                         }
//                         control={
//                           <Checkbox
//                             color="warning"
//                             checked={check2}
//                             onChange={() => Check2("Ahorro")}
//                           />
//                         }
//                       />
//                     </div>
//                   </div>

//                   <TextBox
//                     className="inputCuentasBanco"
//                     label="Estatus"
//                     value={estatus}
//                     onValueChanged={(e) => setestatus(e.value)}
//                   />
//                 </div>
//               </GroupItem>
//             </Form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
