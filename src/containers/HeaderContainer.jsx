import React from 'react'
import Header from '../pages/header/Header'
import '../styles/header.css'
import { useAuth } from '../context/AuthContext';

export default function HeaderContainer() {
  const context = useAuth();

  return (
    <Header usuario={context.user} loginGoogle={context.loginWIthGoogle} logout={context.logout}/>
  )
}
