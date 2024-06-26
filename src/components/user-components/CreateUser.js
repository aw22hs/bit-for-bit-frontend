import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Button.js'
import { Link } from 'react-router-dom'

/**
 * Component for creating a user.
 *
 * @returns {JSX.Element} The JSX element representing the CreateUser component.
 */
const CreateUser = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [state, setState] = useState({
    username: '',
    password: '',
    repeatPassword: ''
  })

  /**
   * Handles the change of input fields.
   *
   * @param {Event} event - The input change event.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setState((prevProps) => ({
      ...prevProps,
      [name]: value
    }))
  }

  /**
   * Handles the form submission.
   *
   * @param {Event} event - The form submit event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
          repeatPassword: state.repeatPassword
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        const errorMessage = JSON.parse(errorText).message
        throw new Error(errorMessage)
      }
      // If the user is created successfully, redirect them to the start page.
      const message = await response.text()
      const messageData = JSON.parse(message).message
      navigate('/', { state: { message: messageData } })
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className='create-user'>
      <div className='logo-container'>
        <h1 className='logo coiny colorful-title'>
          Bit För Bit
        </h1>
      </div>
      <div className='form-container'>
        <div>
          <form onSubmit={handleSubmit}>
            <div className='form-control'>
              <label>Användarnamn</label>
              <input
                type='text'
                name='username'
                value={state.username}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-control'>
              <label>Lösenord</label>
              <input
                type='password'
                name='password'
                value={state.password}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-control'>
              <label>Upprepa lösenord</label>
              <input
                type='password'
                name='repeatPassword'
                value={state.repeatPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-control'>
              <button type='submit'>Skapa</button>
            </div>
          </form>
          <Link to='/'><Button buttonText='Tillbaka till startsidan' /></Link>
          <div>
            {errorMessage ? ( // If there is an error message, display it.
              <p className='system-message'>{errorMessage}</p>
            ) : (
              null
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
