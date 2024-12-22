import { Link } from 'react-router-dom'
import Menu from './Menu'

export default function Header({usuario, loginGoogle, logout}) {

  return (
    <div className='header'>
      <div className='left-header'>
        <Link to="/">Finance</Link>
        <Menu></Menu>
      </div>
        {usuario? (
          <div className='auth-menu'>
            <img src={usuario.photoURL} className='user-image' alt='user-image'/>
            <div className='displayname'>{usuario.displayName}</div>
            <div className='login-button' onClick={logout}>Log out</div>
        </div>
        ):(
          <div className='login-button' onClick={loginGoogle}>Log In</div>
        )}
        
    </div>
  )
}
