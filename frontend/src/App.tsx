import { useState } from 'react'
import { SignIn, SignUp, useUser, useAuth } from '@clerk/clerk-react'

function PostingForm() {
  const [message, setMessage] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const { getToken } = useAuth()

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsPosting(true)
    setResult(null)

    try {
      const token = await getToken()
      
      const response = await fetch('http://localhost:8000/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ type: 'success', message: data.message })
        setMessage('')
      } else {
        setResult({ type: 'error', message: data.detail || 'Failed to post' })
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="container">
      <h1>Post to Facebook</h1>
      <p>Write your message below and it will be posted to your Facebook feed.</p>
      
      <form onSubmit={handlePost}>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={2000}
            required
          />
        </div>
        
        <button type="submit" disabled={isPosting || !message.trim()}>
          {isPosting ? 'Posting...' : 'Post to Facebook'}
        </button>
      </form>

      {result && (
        <div className={`message ${result.type}`}>
          {result.message}
        </div>
      )}
    </div>
  )
}

function App() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="loading">Loading...</div>
  }

  if (!isSignedIn) {
    return (
      <div className="container">
        <h1>Auther - Facebook Posting</h1>
        <p>Sign in with Facebook to post to your feed.</p>
        <SignIn />
        <p>Don't have an account? <SignUp /></p>
      </div>
    )
  }

  return <PostingForm />
}

export default App

