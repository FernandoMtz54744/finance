import React from 'react'
import Header from '../pages/header/Header'
import { useAuth } from '../context/AuthContext';
import '../styles/header.css'

export default function HeaderContainer() {
  const context = useAuth();

  return (
    <Header usuario={context.user} loginGoogle={context.loginWIthGoogle} logout={context.logout}/>
  )
}
