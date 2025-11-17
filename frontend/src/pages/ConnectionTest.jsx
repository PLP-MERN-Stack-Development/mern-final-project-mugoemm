import { useState } from 'react';

const ConnectionTest = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection...');
    
    try {
      // Test backend root
      const response = await fetch('http://localhost:5000/');
      const data = await response.json();
      
      setStatus('success');
      setMessage('✓ Backend is connected!');
      setDetails(data);
    } catch (error) {
      setStatus('error');
      setMessage('✗ Cannot connect to backend');
      setDetails({ error: error.message });
    }
  };

  const testProducts = async () => {
    setStatus('testing');
    setMessage('Testing products API...');
    
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      
      setStatus('success');
      setMessage('✓ Products API is working!');
      setDetails(data);
    } catch (error) {
      setStatus('error');
      setMessage('✗ Products API failed');
      setDetails({ error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Backend Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Connection Status</h2>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Test Backend Connection
            </button>
            
            <button
              onClick={testProducts}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Test Products API
            </button>
          </div>
          
          {status !== 'idle' && (
            <div className={`mt-6 p-4 rounded-lg ${
              status === 'success' ? 'bg-green-100 text-green-800' :
              status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              <p className="font-semibold mb-2">{message}</p>
              {details && (
                <pre className="text-sm overflow-auto bg-white p-3 rounded mt-2">
                  {JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3">Configuration</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Frontend:</strong> http://localhost:5174</li>
            <li><strong>Backend:</strong> http://localhost:5000</li>
            <li><strong>MongoDB:</strong> Connected via .env</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
