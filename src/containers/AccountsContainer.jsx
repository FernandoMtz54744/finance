import Accounts from '../pages/tarjetas/Accounts'
import { useAuth } from '../context/AuthContext';

export default function AccountsContainer() {
    const context = useAuth();

    return (
        <Accounts accounts={context.tarjetas} periodos={context.periodos}/>
    )
}
