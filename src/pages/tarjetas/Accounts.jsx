import React from 'react'
import "../../styles/accounts.css"
import { Link } from 'react-router-dom'

export default function Accounts({accounts}) {

  return (
    <div>
      <div className='accounts-container'>
          {accounts.map((account, i) => (
              <Link className='account-card' to={`/periodos/${account.id}`} key={i}
              style={{backgroundColor: account.color}}>
                  <div>{account.alias}</div>
                  <div>Fecha de corte: {account.fechaCorte}</div> 
                  <div>Tipo: {account.tipo}</div>
              </Link>
          ))}
      </div>
      <Link className='agregar-button' to="/agregarTarjeta">+</Link>
    </div>
  )
}
