import { createContext, ReactNode, useState } from "react";
import { destroyCookie, setCookie } from "nookies";
import Router from "next/router";
import { api } from "../services/apiCliente";

interface AuthContextData {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
}
interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string | null;
  subscriptions?: SubscriptionProps | null;
}
interface SubscriptionProps {
  id: string;
  status: string;
}
type AuthProviderProps = {
  children: ReactNode;
};
interface SignInProps {
  email: string;
  password: string;
}
export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  console.log("ERROR LOGOUT");
  try {
    destroyCookie(null, "@barber.token", { path: "/" });
    Router.push("/login");
  } catch (err) {
    console.log("erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  //Função de login
  async function signIn({ email, password }: SignInProps) {
    /* console.log({
      email,
      password,
    }); */
    try {
      const response = await api.post("/auth", {
        email,
        password,
      });
      const { id, name, token, subscriptions, endereco } = response.data;

      setCookie(undefined, "@barber.token", token, {
        //o token expira em 30dias [1 mês]
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setUser({
        id,
        name,
        email,
        endereco,
        subscriptions,
      });
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')

    } catch (err) {
      /* console.log("Erro ao fazer login", err); */
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
