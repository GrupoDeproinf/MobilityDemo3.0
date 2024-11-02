import settings from './enviroment';
import Axios from "axios";

const url = settings.API_URL + 'usuarioscoord/';

export const GetUsercoord = (region) => {
    console.log(region);
    const promise = Axios.post(url + 'getUsercoord', region)
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}

export const createUpdateUser = (data) => {
    console.log(data)
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

export const getaByEmail = (email) => { 
    const promise = Axios.post(url + 'getaByEmail', {email: email})
    const dataPromise = promise.then((response) => { return response })
    return dataPromise;
}