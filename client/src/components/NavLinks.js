import { NavLink } from "react-router-dom";
import links from "../utils/links"

const NavLinks = ({ toggleSidebar }) => {
  return (
    <div className="nav-links">
      {
        links.map(link => {
          return (
            <NavLink
              key={link.id}
              to={link.path}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <span className='icon'>{link.icon}</span>
              {link.text}
            </NavLink>
          )
        })
      }
    </div>
  )
}
export default NavLinks