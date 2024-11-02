import settings from "./enviroment";
import Axios from "axios";

const url = settings.API_URL + "acceso/";

export const getAcces = () => {
  const promise = Axios.get(url + "getAcceso");
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const createUpdateAcces = (data) => {
  const promise = Axios.post(url + "createUpdateAcceso", data);
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const deleteAcces = (id) => {
  const promise = Axios.put(url + "deleteAcces", { id: id });
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};
