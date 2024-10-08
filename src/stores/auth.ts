import { defineStore } from 'pinia'
import {ref} from "vue";
import api from "@/plugins/axios";

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const user = ref(JSON.parse(localStorage.getItem('user')));

    function setToken(tokenValue){
        localStorage.setItem('token', tokenValue);
        token.value = tokenValue;
    }

    function setUser(userValue){
        localStorage.setItem('user', JSON.stringify(userValue));
        user.value = userValue;
    }

    async function checkToken() {
        try {
            const tokenAuth = 'Bearer '+ token.value;
            const { data } = await api.get('/auth', {
                headers:{
                    Authorization: tokenAuth
                }
            });
            return data;
        }catch (error){
            console.log(error.response.data);
        }
    }

    function isAuthenticated() {
        return token.value && user.value;
    }

    function clear(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token.value = '';
        user.value = '';
    }

    return {
        setToken,
        setUser,
        token,
        user,
        checkToken,
        clear,
        isAuthenticated
    }
})
