import { Link, Navigate } from "react-router-dom"
import { useAppContext } from '../context/appContext';
import main from "../assets/images/main.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import { Logo } from "../components"

const Landing = () => {
  const { user } = useAppContext()
  return (
    <>
      {user && <Navigate to='/' />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              job <span>tracking</span> app
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus ea officiis cumque perferendis dolorum asperiores itaque est amet inventore distinctio maxime vero doloremque, nihil aspernatur eaque optio laudantium minus tenetur? Quibusdam reiciendis, accusamus iusto ducimus corporis mollitia alias ratione minus incidunt aut possimus sint suscipit deleniti ipsam enim. Odio, ipsum?
            </p>
            <Link to='/register' className='btn btn-hero'>
              Login / Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </>
  )
}

export default Landing