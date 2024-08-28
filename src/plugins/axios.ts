import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost',
});

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default api;