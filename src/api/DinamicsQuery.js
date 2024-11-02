import settings from './enviroment';
import Axios from "axios";

const API_URL = settings.API_URL;
const token = settings.ACTIVE_TOKEN;

export const getData = (method, url) => {
    const promise = Axios.get(API_URL + url + method)
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const createUpdateData = (method, url, data) => {
    const promise = Axios.post(API_URL + url + method, data)
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const deleteClientPut = (method, url, id) => { 
    const promise = Axios.put(API_URL + url + method, {id: id})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
} 

export const deleteClientDelete = (method, url, id) => { 
    const promise = Axios.put(API_URL + url + method, {id: id})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
} 

export const getDataWithParameters = (method, url, data) => {
    const promise = Axios.post(API_URL + url + method,  data)
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}
