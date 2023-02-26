import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from '../assets/wrappers/RegisterPage';
import { Logo, Alert, FormRow } from '../components';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true
};

const Register = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialState);
  const { user, isLoading, showAlert, displayAlert, setupUser } = useAppContext()

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/")
      }, 3000)
    }
  }, [user, navigate])

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return
    }
    const currentUser = { name, email, password };

    let endPoint;
    isMember ? endPoint = "login" : endPoint = "register"

    setupUser(currentUser, endPoint)
  };
  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}

        {/* name field */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}>
          </FormRow>
        )}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}>
        </FormRow>
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}>
        </FormRow>
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          submit
        </button>
        <button
          type='button'
          className='btn btn-block btn-hipster'
          disabled={isLoading}
          onClick={() => {
            setupUser(
              { email: 'testUser@test.com', password: '123456' },
              'login'
            );
          }}
        >
          {isLoading ? 'loading...' : 'demo app'}
        </button>

        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}

          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  )
}
export default Register