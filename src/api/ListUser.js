import settings from './enviroment';
import Axios from "axios";

const url = settings.API_URL + 'usuarios/';

export const GetUser = () => {
    const promise = Axios.get(url + 'getUser')
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}


export const getDataUser = () => {
    const promise = Axios.get(url + 'getDataUser')
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const createUpdateUser = (data) => {
    const promise = Axios.post(url + 'createUpdateUser', data)
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const updateUserDeleted = (data) => {
    console.log(data)
    const promise = Axios.post(url + 'updateUserDeleted', data)
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const deleteUser = (uid) => { 
    const promise = Axios.put(url + 'deleteUser', {uid: uid})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}


export const getaByCedula = (cedula) => { 
    const promise = Axios.post(url + 'getaByCedula', {cedula: cedula})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const getaByKey = (key) => { 
    const promise = Axios.post(url + 'getaBykey', {key: key})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}

export const getaByEmail = (email) => { 
    const promise = Axios.post(url + 'getaByEmail', {email: email})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}