import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'  // Styles for the date picker
import { useNavigate } from 'react-router-dom'

const AddPuzzle = () => {
  const navigate = useNavigate()

  const initialFormData = {
    image: '',
    title: '',
    piecesNumber: '',
    height: '',
    width: '',
    manufacturer: '',
    lastPlayed: '',
    location: '',
    complete: true,
    missingPiecesNumber: '',
    privateNote: '',
    sharedNote: '',
    isLentOut: false,
    lentOutToString: '',
    isPrivate: true
  }

  const [formData, setFormData] = useState(initialFormData)

  const createFormData = () => {
    const data = new FormData()
    Object.keys(formData).forEach(key => {
      if (formData[key] != null) {
        if (key === 'image') {
          data.append(key, document.querySelector('input[type="file"]').files[0])
        } else {
          data.append(key, formData[key])
        }
      }
    })
    return data
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      lastPlayed: date
    }))
  }

  const handleSubmit = async (event) => {
    const formDataInput = createFormData();
    event.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8090/my/puzzles', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataInput
      })
      if (response.ok) {
        navigate('/my-puzzles')
        console.log('Puzzle added')
      } else {
        console.log('Could not add puzzle')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className="add-puzzle-form" onSubmit={handleSubmit}>
      <label>
        Bild:
        <input type="file" name="image" onChange={handleChange} accept="image/*" />
      </label>
      <label>
        Titel:
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </label>
      <label>
        Antal bitar:
        <input type="text" name="piecesNumber" value={formData.piecesNumber} onChange={handleChange} />
      </label>
      <label>
        Höjd (cm):
        <input type="text" name="height" value={formData.height} onChange={handleChange} />
      </label>
      <label>
        Bredd (cm):
        <input type="text" name="width" value={formData.width} onChange={handleChange} />
      </label>
      <label>
        Tillverkare:
        <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
      </label>
      <label>
        Senast lagt:
        <DatePicker selected={formData.lastPlayed} onChange={handleDateChange} />
      </label>
      <label>
        Plats:
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
      </label>
      <label>
        Komplett:
        <input type="checkbox" name="complete" checked={formData.complete} onChange={handleChange} />
      </label>
      {!formData.complete && (
        <label>
          Antal saknade bitar:
          <input type="text" name="missingPiecesNumber" value={formData.missingPiecesNumber} onChange={handleChange} />
        </label>
      )}
      <label>
        Privat anteckning:
        <input type="text" name="privateNote" value={formData.privateNote} onChange={handleChange} />
      </label>
      <label>
        Delad anteckning:
        <input type="text" name="sharedNote" value={formData.sharedNote} onChange={handleChange} />
      </label>
      <label>
        Är utlånat:
        <input type="checkbox" name="isLentOut" checked={formData.isLentOut} onChange={handleChange} />
      </label>
      {formData.isLentOut && (
        <label>
          Utlånat till:
          <input type="text" name="lentOutToString" value={formData.lentOutToString} onChange={handleChange} />
        </label>
      )}
      <label>
        Är privat:
        <input type="checkbox" name="isPrivate" checked={formData.isPrivate} onChange={handleChange} />
      </label>
      <button type="submit">Add Puzzle</button>
    </form>
  )
}

export default AddPuzzle