import { auth, db } from "@/firebase/firebase.config";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User} from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Tarjeta } from "@/interfaces/Tarjeta";
import { Periodo } from "@/interfaces/Periodo";

interface AuthContextType {
    loginWIthGoogle: ()=> void,
    logout: ()=> void,
    user: User | null,
    tarjetas: Tarjeta[],
    periodos: Periodo[]
}

export const authContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType =>{
    const context = useContext(authContext);
    if(!context){
        throw new Error("Error al cargar el contexto")
    }
    return context;
}

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
    const [periodos, setPeriodos] = useState<Periodo[]>([]);

    useEffect(()=>{
        const suscribed = onAuthStateChanged(auth, (currentUser)=>{
            if(currentUser){
                setUser(currentUser);
                /*CONSULTA TARJETAS*/
                try{
                    onSnapshot(query(collection(db, "Tarjetas"), where("idUsuario", "==", currentUser.uid)), (snapshot)=>{
                        setTarjetas(snapshot.docs.map(tarjeta =>{
                            const data = tarjeta.data();
                            return {
                                id: tarjeta.id,
                                idUsuario: data.idUsuario,
                                nombre: data.nombre,
                                color: data.color,
                                correo: data.correo,
                                diaCorte: data.diaCorte,
                                tipo: data.tipo
                            }   
                        }));
                    });
                }catch(error){
                    console.log(error)
                }
                /*CONSULTA PERIODOS*/
                try{
                    onSnapshot(query(collection(db, "Periodos"), where("idUsuario", "==", currentUser.uid)), (snapshot)=>{
                        setPeriodos(snapshot.docs.map(periodo =>{
                            const data = periodo.data();
                            return {
                                id: periodo.id,
                                idTarjeta: data.idTarjeta,
                                idUsuario: data.idUsuario,
                                nombre: data.nombre,
                                fechaInicio: data.fechaInicio.toDate(),
                                fechaCorte: data.fechaCorte.toDate(),
                                saldoInicial: data.saldoInicial,
                                saldoFinal: data.saldoFinal,
                                totalPeriodo: data.totalPeriodo,
                                pagado: data.pagado
                            }   
                        }));
                    });
                }catch(error){
                    console.log(error)
                }
            }
        });
        return ()=>suscribed();
    }, []);

    const loginWIthGoogle = ()=>{
        const responseGoogle = new GoogleAuthProvider();
        return signInWithPopup(auth, responseGoogle);
    }

    const logout = async ()=>{
        await signOut(auth);
    }

    return <authContext.Provider
            value={{
                loginWIthGoogle,
                logout,
                user, 
                tarjetas,
                periodos
            }}>{children}
        </authContext.Provider>
}