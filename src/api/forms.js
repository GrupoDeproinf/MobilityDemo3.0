import settings from './enviroment';
import Axios from "axios";

const url = settings.API_URL + 'formularios/';

export const getForms = (client) => {
    const promise = Axios.post(url + 'getFormsWeb', {cliente: client})
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const addFrom = (form) => {
    const promise = Axios.post(url + 'addForms', {formulario: form})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const updateDataForm = (form) => {
    const promise = Axios.post(url + 'updateDataForm', {formulario: form})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const updateForm = (idForm, fotos) => {
    const promise = Axios.post(url + 'updateForm', {id: idForm, fotos: fotos})
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const getSavedForms = (obj) => {
    const promise = Axios.post(url + 'getSavedForms', obj)
    const dataPromise = promise.then((response) => { return response });
    return dataPromise;
}

export const foundForms = (obj) => {
    const promise = Axios.post(url + 'foundAndUpdateForms', obj)
    const dataPromise = promise.then((response) => { return response });
    return dataPromise;
}

export const deleteForms = (obj) => {
    const promise = Axios.post(url + 'deleteForms', obj)
    const dataPromise = promise.then((response) => { return response });
    return dataPromise;
}