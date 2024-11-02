import settings from './enviroment';
import Axios from "axios";

const url = settings.API_URL + 'establecimientos/';

export const getEstablecimientos = () => {
    const promise = Axios.get(url + 'getEstablecimientos')
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const findEstablecimiento = (name) => {
    const promise = Axios.post(url + 'findEstablecimiento', name)
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const findEstablecimientoById = (id_establecimiento) => {
    const promise = Axios.post(url + 'findEstablecimientoById', {id_establecimiento: id_establecimiento})
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const findEstablecimientoByKey = (id_establecimiento) => {
    const promise = Axios.post(url + 'findEstablecimientoByKey', {id_establecimiento: id_establecimiento})
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const updateEstabsFromUser = (estabs, id_user) => {
    const promise = Axios.post(url + 'updateEstabsFromUser', {establecimientos: estabs, id_user: id_user})
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const createUpdateEstablecimientos = (data) => {
    const promise = Axios.post(url + 'createUpdateEstablecimientos', data)
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const deleteEstablecimientos = (id) => { 
    const promise = Axios.put(url + 'deleteEstablecimientos', {id: id})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
} 
