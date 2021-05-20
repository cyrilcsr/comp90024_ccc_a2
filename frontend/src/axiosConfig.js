import axios from 'axios';


const instance = axios.create({
// .. where we make our configurations
    baseURL: 'http://localhost:5000'
});



export default instance;