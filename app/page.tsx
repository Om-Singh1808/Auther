'use client';

import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

function PostingForm() {
  const [message, setMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleDebug = async () => {
    console.log('🔍 [FRONTEND] Debug button clicked');
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      console.log('🔍 [FRONTEND] Debug response:', data);
      setDebugInfo(data);
    } catch (error) {
      console.error('💥 [FRONTEND] Debug error:', error);
      setDebugInfo({ error: 'Failed to get debug info' });
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [FRONTEND] Form submitted, message:', message);
    
    if (!message.trim()) {
      console.log('❌ [FRONTEND] Message is empty, returning');
      return;
    }

    console.log('📝 [FRONTEND] Starting post process...');
    setIsPosting(true);
    setResult(null);

    try {
      console.log('🌐 [FRONTEND] Making API request to /api/post');
      const requestBody = { message };
      console.log('📤 [FRONTEND] Request body:', requestBody);
      
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 [FRONTEND] Response received');
      console.log('📊 [FRONTEND] Response status:', response.status);
      console.log('📊 [FRONTEND] Response ok:', response.ok);

      const data = await response.json();
      console.log('📄 [FRONTEND] Response data:', data);

      if (response.ok) {
        console.log('✅ [FRONTEND] Post successful!');
        setResult({ type: 'success', message: data.message });
        setMessage('');
      } else {
        console.log('❌ [FRONTEND] Post failed with error:', data.error);
        setResult({ type: 'error', message: data.error || 'Failed to post' });
      }
    } catch (error) {
      console.error('💥 [FRONTEND] Network error:', error);
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      console.log('🏁 [FRONTEND] Post process completed');
      setIsPosting(false);
    }
  };

  return (
    <div className="container">
      <h1>Post to Facebook</h1>
      <p>Write your message below and it will be posted to your Facebook feed.</p>
      
      {/* Debug Section */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>🔍 Debug Information</h3>
        <button 
          onClick={handleDebug}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Check Authentication & Facebook Connection
        </button>
        
        {debugInfo && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
      
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
  );
}

function WelcomeMessage() {
  return (
    <div className="container">
      <h1>Welcome to Auther</h1>
      <p>Sign in with Facebook to start posting to your feed.</p>
      <p>This app allows you to post messages directly to your Facebook timeline.</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SignedIn>
        <PostingForm />
      </SignedIn>
      <SignedOut>
        <WelcomeMessage />
      </SignedOut>
    </>
  );
}

