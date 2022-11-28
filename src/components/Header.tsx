import logo from '../logo.svg'
import ServerStatusCheck from './ServerStatusCheck';

export const Header = () => {
  return (
    <>
      <h1>
        <img
          width='34px'
          alt='logo'
          src={logo}
        />
        Timebank
      </h1>
      <ServerStatusCheck/>
    </>
  )
}
