import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ApiDocumentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const baseUrl = "https://vegryoncdzcxmornresu.supabase.co/functions/v1";
  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ3J5b25jZHpjeG1vcm5yZXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDQ2NzgsImV4cCI6MjA2NTAyMDY3OH0.5XnZzQzxL1ffFRmGrIjwe5NpAKQZloJ7yHd8w9uX1PI";

  const curlGetExample = `curl -X GET "${baseUrl}/get-caller-details?phone=%2B1234567890" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "apikey: ${authToken}" \\
  -H "Content-Type: application/json"`;

  const curlPostExample = `curl -X POST "${baseUrl}/get-caller-details" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "apikey: ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+1234567890"}'`;

  const jsExample = `const response = await fetch('${baseUrl}/get-caller-details', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${authToken}',
    'apikey': '${authToken}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '+1234567890'
  })
});

const data = await response.json();
console.log(data);`;

  const responseExample = `{
  "success": true,
  "campaign_id": "987fcdeb-51a2-43d7-8b5c-123456789abc",
  "caller": {
    "contact": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "status": "active"
    },
    "campaign": {
      "id": "987fcdeb-51a2-43d7-8b5c-123456789abc",
      "name": "Summer Campaign 2024",
      "description": "Promotional campaign for summer products",
      "status": "active"
    },
    "agent": {
      "id": "456e7890-a12b-34c5-d678-901234567890",
      "name": "AI Assistant",
      "voice": "nova",
      "status": "active",
      "description": "Customer service AI agent",
      "system_prompt": "You are a helpful customer service agent...",
      "first_message": "Hello! How can I help you today?",
      "company": "Your Company"
    },
    "user": {
      "id": "789a0123-b45c-67d8-e901-234567890123",
      "full_name": "Campaign Manager",
      "email": "manager@example.com"
    }
  }
}`;

  // New endpoint examples
  const callDataPostExample = `curl -X POST "${baseUrl}/receive-call-data" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "apikey: ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+1234567890",
    "campaign_id": "987fcdeb-51a2-43d7-8b5c-123456789abc",
    "duration": 180,
    "status": "completed",
    "direction": "outbound",
    "recording_url": "https://example.com/recording.mp3",
    "transcript": "Hello, this is a call transcript...",
    "call_id": "ext_call_123456",
    "started_at": "2024-01-15T10:30:00Z",
    "ended_at": "2024-01-15T10:33:00Z",
    "notes": "Customer was interested in our services"
  }'`;

  const callDataJsExample = `const response = await fetch('${baseUrl}/receive-call-data', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${authToken}',
    'apikey': '${authToken}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '+1234567890',
    campaign_id: '987fcdeb-51a2-43d7-8b5c-123456789abc',
    duration: 180,
    status: 'completed',
    direction: 'outbound',
    recording_url: 'https://example.com/recording.mp3',
    transcript: 'Hello, this is a call transcript...',
    call_id: 'ext_call_123456',
    started_at: '2024-01-15T10:30:00Z',
    ended_at: '2024-01-15T10:33:00Z',
    notes: 'Customer was interested in our services'
  })
});

const data = await response.json();
console.log(data);`;

  const callDataResponseExample = `{
  "success": true,
  "message": "Call data received successfully",
  "campaign_id": "987fcdeb-51a2-43d7-8b5c-123456789abc",
  "contact": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}`;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h1>
        <p className="text-gray-600">
          Documentation for the Dhwani Voice AI API endpoints
        </p>
      </div>

      {/* Get Caller Details Endpoint */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Get Caller Details</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">GET</Badge>
              <Badge variant="secondary">POST</Badge>
            </div>
          </div>
          <p className="text-gray-600">
            Retrieve caller information including contact details, campaign, agent, and user information based on phone number.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Endpoint URL */}
          <div>
            <h3 className="font-semibold mb-2">Endpoint URL</h3>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
              {baseUrl}/get-caller-details
            </div>
          </div>

          {/* Authentication */}
          <div>
            <h3 className="font-semibold mb-2">Authentication</h3>
            <p className="text-gray-600 mb-3">
              This API requires authentication using a Bearer token in the Authorization header and API key.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Required Headers:</strong>
              </p>
              <ul className="text-sm text-yellow-800 mt-1 list-disc list-inside">
                <li><code>Authorization: Bearer YOUR_TOKEN</code></li>
                <li><code>apikey: YOUR_API_KEY</code></li>
                <li><code>Content-Type: application/json</code></li>
              </ul>
            </div>
          </div>

          {/* Parameters */}
          <div>
            <h3 className="font-semibold mb-2">Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Parameter</th>
                    <th className="px-4 py-2 text-left border-b">Type</th>
                    <th className="px-4 py-2 text-left border-b">Required</th>
                    <th className="px-4 py-2 text-left border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">phone</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="destructive">Yes</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">
                      Phone number of the caller (can be passed as query parameter for GET or in request body for POST)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">campaign_id</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Campaign ID associated with the call</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold mb-4">Examples</h3>
            
            {/* GET Request */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">GET Request (Query Parameter)</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(curlGetExample, 'curl-get')}
                >
                  {copiedCode === 'curl-get' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                {curlGetExample}
              </pre>
            </div>

            {/* POST Request */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">POST Request (JSON Body)</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(curlPostExample, 'curl-post')}
                >
                  {copiedCode === 'curl-post' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                {curlPostExample}
              </pre>
            </div>

            {/* JavaScript Example */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">JavaScript Example</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(jsExample, 'js')}
                >
                  {copiedCode === 'js' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
                {jsExample}
              </pre>
            </div>
          </div>

          {/* Response */}
          <div>
            <h3 className="font-semibold mb-2">Response</h3>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Success Response (200)</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(responseExample, 'response')}
              >
                {copiedCode === 'response' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              {responseExample}
            </pre>
          </div>

          {/* Error Responses */}
          <div>
            <h3 className="font-semibold mb-2">Error Responses</h3>
            <div className="space-y-3">
              <div className="border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive">400</Badge>
                  <span className="font-medium">Bad Request</span>
                </div>
                <pre className="text-sm bg-red-50 p-2 rounded">{"{ \"error\": \"Phone number is required\" }"}</pre>
              </div>
              
              <div className="border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">404</Badge>
                  <span className="font-medium">Not Found</span>
                </div>
                <pre className="text-sm bg-yellow-50 p-2 rounded">{"{ \"error\": \"Contact not found\" }"}</pre>
                <pre className="text-sm bg-yellow-50 p-2 rounded mt-1">{"{ \"error\": \"No active campaigns found for this contact\" }"}</pre>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">500</Badge>
                  <span className="font-medium">Internal Server Error</span>
                </div>
                <pre className="text-sm bg-gray-50 p-2 rounded">{"{ \"error\": \"Internal server error\" }"}</pre>
              </div>
            </div>
          </div>

          {/* Rate Limiting */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Rate Limiting</h4>
            <p className="text-sm text-blue-700">
              This API is subject to rate limiting. Please ensure you don't exceed reasonable request rates to maintain service availability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* New: Receive Call Data Endpoint */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Receive Call Data</CardTitle>
            <Badge variant="secondary">POST</Badge>
          </div>
          <p className="text-gray-600">
            Endpoint for external systems to submit call-related data and update contact records.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Endpoint URL */}
          <div>
            <h3 className="font-semibold mb-2">Endpoint URL</h3>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
              {baseUrl}/receive-call-data
            </div>
          </div>

          {/* Authentication */}
          <div>
            <h3 className="font-semibold mb-2">Authentication</h3>
            <p className="text-gray-600 mb-3">
              This API requires authentication using a Bearer token in the Authorization header and API key.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Required Headers:</strong>
              </p>
              <ul className="text-sm text-yellow-800 mt-1 list-disc list-inside">
                <li><code>Authorization: Bearer YOUR_TOKEN</code></li>
                <li><code>apikey: YOUR_API_KEY</code></li>
                <li><code>Content-Type: application/json</code></li>
              </ul>
            </div>
          </div>

          {/* Parameters */}
          <div>
            <h3 className="font-semibold mb-2">Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Parameter</th>
                    <th className="px-4 py-2 text-left border-b">Type</th>
                    <th className="px-4 py-2 text-left border-b">Required</th>
                    <th className="px-4 py-2 text-left border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">phone</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="destructive">Yes</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Phone number of the caller</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">campaign_id</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Campaign ID associated with the call</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">duration</td>
                    <td className="px-4 py-2 border-b">number</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Call duration in seconds</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">status</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Call status (completed, missed, busy, failed)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">direction</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Call direction (inbound, outbound)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">recording_url</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">URL to the call recording</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">transcript</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Call transcript</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">call_id</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">External call ID</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">started_at</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Call start time (ISO 8601)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">ended_at</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Call end time (ISO 8601)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-sm">notes</td>
                    <td className="px-4 py-2 border-b">string</td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="outline">No</Badge>
                    </td>
                    <td className="px-4 py-2 border-b">Additional notes about the call</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold mb-4">Examples</h3>
            
            {/* cURL Example */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">cURL Example</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(callDataPostExample, 'call-curl')}
                >
                  {copiedCode === 'call-curl' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                {callDataPostExample}
              </pre>
            </div>

            {/* JavaScript Example */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">JavaScript Example</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(callDataJsExample, 'call-js')}
                >
                  {copiedCode === 'call-js' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
                {callDataJsExample}
              </pre>
            </div>
          </div>

          {/* Response */}
          <div>
            <h3 className="font-semibold mb-2">Response</h3>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Success Response (200)</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(callDataResponseExample, 'call-response')}
              >
                {copiedCode === 'call-response' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              {callDataResponseExample}
            </pre>
          </div>

          {/* Error Responses */}
          <div>
            <h3 className="font-semibold mb-2">Error Responses</h3>
            <div className="space-y-3">
              <div className="border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive">400</Badge>
                  <span className="font-medium">Bad Request</span>
                </div>
                <pre className="text-sm bg-red-50 p-2 rounded">{"{ \"error\": \"Phone number is required\" }"}</pre>
              </div>
              
              <div className="border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">404</Badge>
                  <span className="font-medium">Not Found</span>
                </div>
                <pre className="text-sm bg-yellow-50 p-2 rounded">{"{ \"error\": \"Contact not found\" }"}</pre>
              </div>
              
              <div className="border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">405</Badge>
                  <span className="font-medium">Method Not Allowed</span>
                </div>
                <pre className="text-sm bg-red-50 p-2 rounded">{"{ \"error\": \"Method not allowed\" }"}</pre>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">500</Badge>
                  <span className="font-medium">Internal Server Error</span>
                </div>
                <pre className="text-sm bg-gray-50 p-2 rounded">{"{ \"error\": \"Internal server error\" }"}</pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentation;
