import { createContext, ReactNode, useState } from "react";
import { destroyCookie } from "nookies";
import Router from 'next/router';

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
    Router.push('/login')
  } catch (err) {
    console.log("erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  //Função de login
  async function signIn({ email, password }: SignInProps) {
    console.log({
      email,
      password,
    });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
