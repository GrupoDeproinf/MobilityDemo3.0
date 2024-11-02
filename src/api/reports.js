import settings from "./enviroment";
import Axios from "axios";

const urlCliente = settings.API_URL + "clientes/";
const urlFormularios = settings.API_URL + "formularios/";
const urlregiones = settings.API_URL + "regiones/";
const urlreportes = settings.API_URL + "reportes/";
const token = settings.ACTIVE_TOKEN;

export const getClients = () => {
  const promise = Axios.get(urlCliente + "getClients");
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const getForms = (cliente) => {
  const promise = Axios.post(urlFormularios + "getFormsWeb", { cliente: cliente });
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const getRegion = () => {
  const promise = Axios.get(urlregiones + "getRegion");
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const generateReports = (data) => {
  const promise = Axios.post(urlreportes + "generateReports", data);
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const generateReportsFormateado = (data) => {
  const promise = Axios.post(urlreportes + "generateReportsFormateado", data);
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const generateSpecialReports = (data) => {
  const promise = Axios.post(urlreportes + "generateEspecialReports", data);
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const generateSpecialReportsUsuarios = (data) => {
  const promise = Axios.post(urlreportes + "generateEspecialReportsUsuarios", data);
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

// export const createUpdateClient = (data) => {
//     const promise = Axios.post(url + 'createUpdateClient', data, header)
//     const dataPromise = promise.then((response) => { return response })
//     return dataPromise;
// }

// export const deleteClient = (id) => {
//     const promise = Axios.put(url + 'deleteClient', {id: id}, header)
//     const dataPromise = promise.then((response) => { return response })
//     return dataPromise;
// }
