import React from 'react'
import { useAuth } from '../context/AuthContext';
import AccountsContainer from './AccountsContainer';
import Home from '../pages/login/Home';


export default function HomeContainer() {
    const context = useAuth();

  return (
    <>
    {
      context.user?(
        <AccountsContainer/>
      ):(
        <Home/>
      )
    }
    </>
  )
}
