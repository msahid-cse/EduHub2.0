import React, { useState } from 'react';
import { checkServerConnection, apiClient, adminService, communityAPI } from './api/apiClient';

function TestConnection() {
  const [connectionResult, setConnectionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEndpoint, setTestEndpoint] = useState('');
  const [customEndpointResult, setCustomEndpointResult] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionResult(null);
    setError(null);
    
    try {
      const result = await checkServerConnection();
      setConnectionResult(result);
    } catch (err) {
      setError('Failed to test connection: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomEndpoint = async () => {
    if (!testEndpoint) return;
    
    setIsLoading(true);
    setCustomEndpointResult(null);
    setError(null);
    
    try {
      // Ensure it starts with / if needed
      const endpoint = testEndpoint.startsWith('/') ? testEndpoint : `/${testEndpoint}`;
      console.log(`Testing custom endpoint: ${endpoint}`);
      
      const response = await apiClient.get(endpoint);
      setCustomEndpointResult({
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
    } catch (err) {
      console.error('Custom endpoint test failed:', err);
      setError(`Error testing ${testEndpoint}: ${err.response?.data?.message || err.message}`);
      setCustomEndpointResult({
        status: err.response?.status || 'Unknown',
        statusText: err.response?.statusText || 'Error',
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDashboardStats = async () => {
    setIsLoading(true);
    setCustomEndpointResult(null);
    setError(null);
    
    try {
      console.log('Testing dashboard stats endpoint');
      const response = await adminService.getDashboardStats();
      setCustomEndpointResult({
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
    } catch (err) {
      console.error('Dashboard stats test failed:', err);
      setError(`Error testing dashboard stats: ${err.response?.data?.message || err.message}`);
      setCustomEndpointResult({
        status: err.response?.status || 'Unknown',
        statusText: err.response?.statusText || 'Error',
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testUserCount = async () => {
    setIsLoading(true);
    setCustomEndpointResult(null);
    setError(null);
    
    try {
      console.log('Testing user count fallbacks');
      
      let userCountResults = [];
      
      // Method 1: Admin user count endpoint
      try {
        const response = await adminService.getUserCount();
        userCountResults.push({
          method: 'adminService.getUserCount()',
          status: response.status,
          data: response.data
        });
      } catch (err) {
        userCountResults.push({
          method: 'adminService.getUserCount()',
          error: err.message
        });
      }
      
      // Method 2: Community API users
      try {
        const response = await communityAPI.getAdminUsers();
        userCountResults.push({
          method: 'communityAPI.getAdminUsers()',
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 'Not an array'
        });
      } catch (err) {
        userCountResults.push({
          method: 'communityAPI.getAdminUsers()',
          error: err.message
        });
      }
      
      // Method 3: Global members endpoint
      try {
        const response = await communityAPI.getGlobalMembers();
        userCountResults.push({
          method: 'communityAPI.getGlobalMembers()',
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 'Not an array'
        });
      } catch (err) {
        userCountResults.push({
          method: 'communityAPI.getGlobalMembers()',
          error: err.message
        });
      }
      
      // Method 4: Standard members endpoint
      try {
        const response = await communityAPI.getMembers();
        userCountResults.push({
          method: 'communityAPI.getMembers()',
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 'Not an array'
        });
      } catch (err) {
        userCountResults.push({
          method: 'communityAPI.getMembers()',
          error: err.message
        });
      }
      
      setCustomEndpointResult({
        userCountTests: userCountResults
      });
    } catch (err) {
      setError(`Error testing user count methods: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Basic Connection Test</h2>
        <button 
          onClick={testConnection}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          {isLoading ? 'Testing...' : 'Test Server Connection'}
        </button>
        
        {connectionResult && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h3 className="font-semibold">Result:</h3>
            <div className="mt-2">
              <div className="flex">
                <span className="font-medium w-32">Status:</span> 
                <span className={connectionResult.success ? 'text-green-600' : 'text-red-600'}>
                  {connectionResult.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <div className="flex mt-1">
                <span className="font-medium w-32">Message:</span> 
                <span>{connectionResult.message}</span>
              </div>
              {connectionResult.data && (
                <div className="mt-2">
                  <span className="font-medium">Data:</span>
                  <pre className="bg-gray-100 p-2 mt-1 rounded text-sm overflow-auto">
                    {JSON.stringify(connectionResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Custom Endpoint Test</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={testEndpoint}
            onChange={(e) => setTestEndpoint(e.target.value)}
            placeholder="Enter endpoint (e.g. /api/health)"
            className="flex-1 px-3 py-2 border rounded mr-2"
          />
          <button 
            onClick={testCustomEndpoint}
            disabled={isLoading || !testEndpoint}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            {isLoading ? 'Testing...' : 'Test Endpoint'}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Common Tests</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={testDashboardStats}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Test Dashboard Stats
          </button>
          
          <button 
            onClick={testUserCount}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Test User Count Methods
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {customEndpointResult && (
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold text-lg mb-2">Test Result:</h3>
          
          {customEndpointResult.userCountTests ? (
            <div>
              <h4 className="font-medium text-lg mb-2">User Count Test Results:</h4>
              {customEndpointResult.userCountTests.map((test, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
                  <div className="font-medium">{test.method}</div>
                  {test.error ? (
                    <div className="text-red-600 mt-1">Error: {test.error}</div>
                  ) : (
                    <div>
                      <div className="text-green-600 mt-1">Success (Status: {test.status})</div>
                      {test.count !== undefined && <div className="mt-1">Count: {test.count}</div>}
                      {test.data && (
                        <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex">
                <span className="font-medium w-32">Status:</span> 
                <span className={customEndpointResult.status === 200 ? 'text-green-600' : 'text-yellow-600'}>
                  {customEndpointResult.status} {customEndpointResult.statusText}
                </span>
              </div>
              
              {customEndpointResult.error ? (
                <div className="flex mt-2">
                  <span className="font-medium w-32">Error:</span>
                  <span className="text-red-600">{customEndpointResult.error}</span>
                </div>
              ) : (
                <div className="mt-3">
                  <span className="font-medium">Data:</span>
                  <pre className="bg-gray-100 p-2 mt-1 rounded text-sm overflow-auto max-h-96">
                    {JSON.stringify(customEndpointResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TestConnection; 