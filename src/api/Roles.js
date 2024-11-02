import settings from "./enviroment";
import Axios from "axios";

const url = settings.API_URL + "roles/";

export const getRoles = () => {
  const promise = Axios.get(url + "getRoles");
  const dataPromise = promise.then((response) => {
    return response;
  });
  return dataPromise;
};

export const createUpdateRoles = (data) => {
  const promise = Axios.post(url + "createUpdateRoles", data);
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
