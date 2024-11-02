import settings from './enviroment';
import Axios from "axios";

const url = settings.API_URL + 'clientes/';

export const getClients = () => {
    const promise = Axios.get(url + 'getClients')
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const createUpdateClient = (data) => {
    const promise = Axios.post(url + 'createUpdateClient', data)
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const deleteClient = (id) => { 
    const promise = Axios.put(url + 'deleteClient', {id: id})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
} 
