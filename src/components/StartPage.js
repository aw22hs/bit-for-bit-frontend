import Button from './Button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { PuzzleContext } from './contexts/PuzzleContext'

/**
 * The start page component that allows users to log in or create a new account.
 * @returns {JSX.Element} The JSX element representing the StartPage component.
 */
const StartPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [message, setMessage] = useState('')
  const { setIsLoadingPuzzles } = useContext(PuzzleContext)
  const [errorMessage, setErrorMessage] = useState('')
  const [state, setState] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    // Retrieve the query parameters from the URL
    const urlParams = new URLSearchParams(location.search)
    // Get the value of the 'message' parameter from the query parameters
    const storedMessage = urlParams.get('message')
    // If a 'message' parameter value exists, set it as the message state
    if (storedMessage) {
      setMessage(storedMessage)
      // If no 'message' parameter exists, get the message from location state (if available)
    } else {
      const newMessage = location.state?.message || ''
      setMessage(newMessage)
    }
    // Dependencies include location search and location state message
  }, [location.search, location.state?.message])

  useEffect(() => {
    // Clear the message from the URL when the component is unmounted
    return () => {
      const newUrl = `${window.location.pathname}`
      window.history.replaceState(null, '', newUrl)
    }
  }, [])

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
    setIsLoadingPuzzles(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: state.username,
          password: state.password
        })
      })
      if (response.ok) {
        // If the login is successful, store the token in local storage and redirect the user to the my-puzzles page.
        const token = await response.json()
        localStorage.setItem('token', token)
        navigate('/my-puzzles')
      } else {
        // If the login is unsuccessful, display an error message.
        const errorMessage = await response.text()
        throw new Error(JSON.parse(errorMessage).message)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className='start-page'>
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
              <button type='submit'>Logga in</button>
            </div>
          </form>
        </div>
        <Link to='/create-user'>
          <Button className='create-account' buttonText='Skapa nytt konto' />
        </Link>
        <div>
          {message ? ( // If a message exists, display it; otherwise, display nothing
            <p className='system-message'>{message}</p>
          ) : (
            null
          )}
        </div>
        <div>
          {errorMessage ? ( // If an error message exists, display it; otherwise, display nothing
            <p className='system-message'>{errorMessage}</p>
          ) : (
            null
          )}
        </div>
      </div>
    </div >
  )
}

export default StartPage