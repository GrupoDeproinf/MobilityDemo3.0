import settings from "./enviroment";
import Axios from "axios";

const url = settings.API_URL + "regiones/";

export const getRegion = () => {
  const promise = Axios.get(url + "getRegion");
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const createUpdateRegiones = (data) => {
  const promise = Axios.post(url + "createUpdateRegiones", data);
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const deleteRegions = (id) => {
  const promise = Axios.put(url + "deleteRegions", { id: id });
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};
