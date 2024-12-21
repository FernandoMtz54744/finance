import { auth, db } from "../firebase/firebase.config";
import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup,
    signOut, onAuthStateChanged} from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { authenticateGoogleDrive } from "../googleDrive/googleDrive.config";

export const authContext = createContext();

export const useAuth = () =>{
    const context = useContext(authContext);
    if(!context){
        console.log("Error al crear el contexto de autenticación");
    }
    return context;
}

export function AuthProvider({children}){
    const [user, setUser] = useState();
    const [tarjetas, setTarjetas] = useState([]);
    const [periodos, setPeriodos] = useState([]);

    useEffect(()=>{
        const suscribed = onAuthStateChanged(auth, (currentUser)=>{  
            if(!currentUser){
                setUser("");
            }else{
                setUser(currentUser);
                /*CONSULTA TARJETAS*/
                try{
                    onSnapshot(query(collection(db, `Tarjetas`), where("idUsuario", "==", currentUser.uid)), (snapshot)=>{
                        const tarjetasTemp = [];
                        snapshot.docs.forEach(tarjeta =>{
                            tarjetasTemp.push({...tarjeta.data(), id: tarjeta.id})
                        });
                        setTarjetas(tarjetasTemp);
                    });
                }catch(error){
                    console.log(error)
                }
                /*CONSULTA PERIODOS*/
                try{
                    onSnapshot(query(collection(db, "Periodos"), where("idUsuario", "==", currentUser.uid)), (snapshot)=>{
                        const periodosTemp = [];
                        snapshot.docs.forEach(periodo =>{
                            periodosTemp.push({...periodo.data(), idPeriodo: periodo.id})
                        })
                        setPeriodos(periodosTemp);
                    });
                }catch(error){
                    console.log(error)
                }

                //Inicia google drive
                // authenticateGoogleDrive();
            }         
        })
        return ()=>suscribed();
    }, []);

    const loginWIthGoogle = ()=>{
        const responseGoogle = new GoogleAuthProvider();
        return signInWithPopup(auth, responseGoogle);
    }

    const logout = async ()=>{
        const response = await signOut(auth);
        console.log(response);
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