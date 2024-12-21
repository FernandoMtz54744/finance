import { Link } from 'react-router-dom'

export default function Header({usuario, loginGoogle, logout}) {

  return (
    <div className='header'>
        <Link to="/">Finance</Link>
        {usuario? (
          <div className='auth-menu'>
            <div><Link to="/pagosConcurrentes">Pagos Concurrentes</Link></div>
            <img src={usuario.photoURL} className='user-image'/>
            <div className='displayname'>{usuario.displayName}</div>
            <div className='login-button' onClick={logout}>Log out</div>
        </div>
        ):(
          <div className='login-button' onClick={loginGoogle}>Log In</div>
        )}
        
    </div>
  )
}
