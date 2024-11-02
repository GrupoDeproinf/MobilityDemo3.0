import settings from './enviroment';
import Axios from "axios";

const url = settings.API_URL + "manager/";

export const Cipher = (data) => {
    console.log(data)
    const promise = Axios.post(url + 'cipher', data)
    const dataPromise = promise.then((response) => {  return response.data })
    return dataPromise;
}

export const Decipher = (data) => {
    const promise = Axios.post(url + 'decipher', data)
    const dataPromise = promise.then((response) => {  return response.data })
    return dataPromise;
}