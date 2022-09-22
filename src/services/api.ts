import axios, {AxiosError} from 'axios';
import {parseCookies} from 'nookies'
import {AuthTokenError} from './errors/AuthTokenError'
import {signOut} from '../context/AuthContext'

export function setupAPICliente(ctx = undefined){
    let cookies = parseCookies(ctx)

    const api = axios.create({
        //Configuração da BASE URL
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            //Incluir autorização com o token do usuário
            Authorization: `Bearer ${cookies['@barber.token']}`
        }
    })
    api.interceptors.response.use(response => {
        return response
        //Casos de erro
    }, (error: AxiosError) => {
        if(error.response.status == 401){
            if(typeof window !== undefined){
                //deslogar usuário//
                signOut()
            }else{
                return Promise.reject(new AuthTokenError())
            }
        }
        return Promise.reject(error)
    })
    return api
}