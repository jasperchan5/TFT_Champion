import axios from 'axios';

const instance = axios.create({
    baseURL: "https://dbam2bbb0j.execute-api.us-west-2.amazonaws.com"
})

export default instance;