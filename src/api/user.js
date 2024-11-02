import settings from './enviroment';
import Axios from "axios";

const url = settings.API_URL + 'user/';
const token = {
    headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.amVyaXNtYXJ2QGdtYWlsLmNvbQ.ty-QB5b4NLvipLzhFRJBul_Ps5ZVhfkO4_GOevxQb5U` }
};

export const Login = () => {
    const promise = Axios.get(url + 'getClients', token)
    const dataPromise = promise.then((response) => {  return response })
    return dataPromise;
}