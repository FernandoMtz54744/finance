import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();  

  return (
    user ?
      <Navigate to="/" replace />
    :
      <div className='flex flex-col items-center justify-center'>
        <div className='account-title text-3xl my-6'>HOME</div>
      </div>
  )

}
