
import Button from '../Button'
import { useContext } from 'react'
import nullPuzzleImage from '../../assets/images/null-puzzle.jpeg'
import PuzzleForm from './PuzzleForm'
import { useLocation } from 'react-router-dom'
import { TokenContext } from '../contexts/TokenContext'
import { useNavigate } from 'react-router-dom'

const EditPuzzle = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { puzzle } = location.state || {}
  const fetchWithToken = useContext(TokenContext)

  /**
   * Deletes a puzzle from the database.
   * @param {string} id - The id of the puzzle to delete.
   */
  const handleClickDelete = async (id) => {
    try {
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/my/puzzles/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        navigate('/my-puzzles')
      } else if (response.status === 401) {
        navigate('/')
      } else {
        throw new Error(`Server responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching puzzles:', error)
    }
  }

  return (
    <div className='puzzle-area'>
      <div className='puzzle-info'>
        {puzzle.imageUrl ? (
          <img src={puzzle.imageUrl} alt={puzzle.title} />
        ) : (
          <img src={nullPuzzleImage} alt={''} />
        )
        }
        <PuzzleForm
          fetchUrl={`my/puzzles/${puzzle.id}`}
          method='PUT'
          navigateUrl={`/puzzles/${puzzle.id}`}
          buttonText='Spara'
        />
        <div className='button-area'>
          <Button
            id='delete-button'
            buttonText='Radera pussel'
            onClick={() => handleClickDelete(puzzle.id)}
          />
          <Button
            buttonText='Tillbaka'
            onClick={() => navigate(`/puzzles/${puzzle.id}`)}
          />
        </div>
      </div>
    </div>
  )
}

export default EditPuzzle
