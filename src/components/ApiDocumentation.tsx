
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

  const apiEndpoints = [
    {
      name: "Get Caller Details",
      methods: ["GET", "POST"],
      path: "/get-caller-details",
      description: "Retrieve caller information including contact details, campaign, agent, and user information based on phone number.",
      parameters: [
        { name: "phone", type: "string", required: true, description: "Phone number of the caller" },
        { name: "campaign_type", type: "string", required: false, description: "Filter campaigns by type (inbound/outbound)" }
      ]
    },
    {
      name: "Receive Call Data",
      methods: ["POST"],
      path: "/receive-call-data",
      description: "Endpoint for external systems to submit call-related data and update contact records.",
      parameters: [
        { name: "phone", type: "string", required: true, description: "Phone number of the caller" },
        { name: "campaign_id", type: "string", required: false, description: "Campaign ID associated with the call" },
        { name: "duration", type: "number", required: false, description: "Call duration in seconds" },
        { name: "status", type: "string", required: false, description: "Call status (completed, missed, busy, failed)" },
        { name: "direction", type: "string", required: false, description: "Call direction (inbound, outbound)" },
        { name: "recording_url", type: "string", required: false, description: "URL to the call recording" },
        { name: "transcript", type: "string", required: false, description: "Call transcript" },
        { name: "call_id", type: "string", required: false, description: "External call ID" },
        { name: "started_at", type: "string", required: false, description: "Call start time (ISO 8601)" },
        { name: "ended_at", type: "string", required: false, description: "Call end time (ISO 8601)" },
        { name: "notes", type: "string", required: false, description: "Additional notes about the call" }
      ]
    },
    {
      name: "Create Agent",
      methods: ["POST"],
      path: "/create-agent",
      description: "Create a new AI agent with specified configuration.",
      parameters: [
        { name: "name", type: "string", required: true, description: "Agent name" },
        { name: "voice", type: "string", required: false, description: "Voice type (default: nova)" },
        { name: "status", type: "string", required: false, description: "Agent status (default: inactive)" },
        { name: "description", type: "string", required: false, description: "Agent description" },
        { name: "system_prompt", type: "string", required: false, description: "System prompt for the agent" },
        { name: "first_message", type: "string", required: false, description: "Agent's first message" },
        { name: "agent_type", type: "string", required: false, description: "Agent type (inbound/outbound)" },
        { name: "company", type: "string", required: false, description: "Company name" }
      ]
    },
    {
      name: "Create Contact",
      methods: ["POST"],
      path: "/create-contact",
      description: "Create a new contact in the system.",
      parameters: [
        { name: "name", type: "string", required: true, description: "Contact name" },
        { name: "email", type: "string", required: false, description: "Contact email" },
        { name: "phone", type: "string", required: false, description: "Contact phone number" },
        { name: "address", type: "string", required: false, description: "Contact address" },
        { name: "city", type: "string", required: false, description: "Contact city" },
        { name: "state", type: "string", required: false, description: "Contact state" },
        { name: "zip_code", type: "string", required: false, description: "Contact zip code" },
        { name: "status", type: "string", required: false, description: "Contact status (default: active)" }
      ]
    },
    {
      name: "Create Knowledge Base",
      methods: ["POST"],
      path: "/create-knowledge-base",
      description: "Create a new knowledge base entry.",
      parameters: [
        { name: "title", type: "string", required: true, description: "Knowledge base title" },
        { name: "type", type: "string", required: false, description: "Knowledge base type (default: document)" },
        { name: "description", type: "string", required: false, description: "Knowledge base description" },
        { name: "content", type: "string", required: false, description: "Knowledge base content" },
        { name: "tags", type: "array", required: false, description: "Tags for categorization" },
        { name: "status", type: "string", required: false, description: "Status (default: draft)" }
      ]
    },
    {
      name: "Create Campaign",
      methods: ["POST"],
      path: "/create-campaign",
      description: "Create a new campaign with associated agents and contacts.",
      parameters: [
        { name: "name", type: "string", required: true, description: "Campaign name" },
        { name: "description", type: "string", required: false, description: "Campaign description" },
        { name: "agent_id", type: "string", required: false, description: "Associated agent ID" },
        { name: "contact_ids", type: "array", required: false, description: "Array of contact IDs" },
        { name: "status", type: "string", required: false, description: "Campaign status" },
        { name: "knowledge_base_id", type: "string", required: false, description: "Associated knowledge base ID" }
      ]
    },
    {
      name: "Create Script",
      methods: ["POST"],
      path: "/create-script",
      description: "Create a new call script with sections and configuration.",
      parameters: [
        { name: "name", type: "string", required: true, description: "Script name" },
        { name: "description", type: "string", required: false, description: "Script description" },
        { name: "company", type: "string", required: false, description: "Company name" },
        { name: "agent_type", type: "string", required: false, description: "Agent type (default: outbound)" },
        { name: "voice", type: "string", required: false, description: "Voice type (default: Sarah)" },
        { name: "first_message", type: "string", required: false, description: "Opening message" },
        { name: "sections", type: "array", required: false, description: "Script sections" }
      ]
    },
    {
      name: "Get User Scripts",
      methods: ["GET"],
      path: "/get-user-scripts",
      description: "Retrieve all scripts for the authenticated user.",
      parameters: []
    },
    {
      name: "Get Agent by Number",
      methods: ["GET", "POST"],
      path: "/get-agent-by-number",
      description: "Retrieve agent information by phone number.",
      parameters: [
        { name: "phone", type: "string", required: true, description: "Phone number to lookup" }
      ]
    },
    {
      name: "Get Outbound Call Details",
      methods: ["GET", "POST"],
      path: "/get-outbound-call-details",
      description: "Retrieve details for outbound call configuration.",
      parameters: [
        { name: "phone", type: "string", required: true, description: "Target phone number" },
        { name: "campaign_id", type: "string", required: false, description: "Campaign ID for the call" }
      ]
    },
    {
      name: "Create Entity",
      methods: ["POST"],
      path: "/create-entity",
      description: "Universal endpoint for creating various entity types.",
      parameters: [
        { name: "entityType", type: "string", required: true, description: "Type of entity (agent, contact, knowledge_base, campaign)" },
        { name: "data", type: "object", required: true, description: "Entity data object" }
      ]
    }
  ];

  const generateCurlExample = (endpoint: any) => {
    const method = endpoint.methods.includes('POST') ? 'POST' : 'GET';
    const hasBody = method === 'POST';
    
    let curl = `curl -X ${method} "${baseUrl}${endpoint.path}"`;
    curl += ` \\\n  -H "Authorization: Bearer ${authToken}"`;
    curl += ` \\\n  -H "apikey: ${authToken}"`;
    curl += ` \\\n  -H "Content-Type: application/json"`;
    
    if (hasBody && endpoint.parameters.length > 0) {
      const sampleData: any = {};
      endpoint.parameters.forEach((param: any) => {
        if (param.required) {
          switch (param.type) {
            case 'string':
              sampleData[param.name] = param.name.includes('phone') ? '+1234567890' : `sample_${param.name}`;
              break;
            case 'number':
              sampleData[param.name] = 180;
              break;
            case 'array':
              sampleData[param.name] = ['tag1', 'tag2'];
              break;
            case 'object':
              sampleData[param.name] = { key: 'value' };
              break;
          }
        }
      });
      
      if (Object.keys(sampleData).length > 0) {
        curl += ` \\\n  -d '${JSON.stringify(sampleData, null, 2).replace(/\n/g, '\\n')}'`;
      }
    }
    
    return curl;
  };

  const generateJsExample = (endpoint: any) => {
    const method = endpoint.methods.includes('POST') ? 'POST' : 'GET';
    const hasBody = method === 'POST';
    
    let js = `const response = await fetch('${baseUrl}${endpoint.path}', {\n`;
    js += `  method: '${method}',\n`;
    js += `  headers: {\n`;
    js += `    'Authorization': 'Bearer ${authToken}',\n`;
    js += `    'apikey': '${authToken}',\n`;
    js += `    'Content-Type': 'application/json'\n`;
    js += `  }`;
    
    if (hasBody && endpoint.parameters.length > 0) {
      const sampleData: any = {};
      endpoint.parameters.slice(0, 3).forEach((param: any) => {
        if (param.required) {
          switch (param.type) {
            case 'string':
              sampleData[param.name] = param.name.includes('phone') ? '+1234567890' : `sample_${param.name}`;
              break;
            case 'number':
              sampleData[param.name] = 180;
              break;
            case 'array':
              sampleData[param.name] = ['item1', 'item2'];
              break;
          }
        }
      });
      
      if (Object.keys(sampleData).length > 0) {
        js += `,\n  body: JSON.stringify(${JSON.stringify(sampleData, null, 4).replace(/^/gm, '    ')})`;
      }
    }
    
    js += `\n});\n\nconst data = await response.json();\nconsole.log(data);`;
    
    return js;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dhwani Voice AI API Documentation</h1>
        <p className="text-lg text-gray-600 mb-4">
          Complete REST API documentation for the Dhwani Voice AI platform
        </p>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Base URL</h3>
          <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded">{baseUrl}</code>
        </div>
      </div>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            All API endpoints require authentication using Bearer token and API key headers.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Required Headers</h4>
            <div className="space-y-2 text-sm">
              <div className="font-mono bg-yellow-100 p-2 rounded">
                <span className="text-yellow-700">Authorization:</span> Bearer YOUR_TOKEN
              </div>
              <div className="font-mono bg-yellow-100 p-2 rounded">
                <span className="text-yellow-700">apikey:</span> YOUR_API_KEY
              </div>
              <div className="font-mono bg-yellow-100 p-2 rounded">
                <span className="text-yellow-700">Content-Type:</span> application/json
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">API Endpoints</h2>
        
        {apiEndpoints.map((endpoint, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{endpoint.name}</CardTitle>
                <div className="flex gap-2">
                  {endpoint.methods.map(method => (
                    <Badge key={method} variant={method === 'GET' ? 'secondary' : 'default'}>
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{endpoint.description}</p>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                {endpoint.methods.join(' | ')} {baseUrl}{endpoint.path}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parameters */}
              {endpoint.parameters.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Parameters</h3>
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
                        {endpoint.parameters.map((param: any, paramIndex: number) => (
                          <tr key={paramIndex}>
                            <td className="px-4 py-2 border-b font-mono text-sm">{param.name}</td>
                            <td className="px-4 py-2 border-b">{param.type}</td>
                            <td className="px-4 py-2 border-b">
                              <Badge variant={param.required ? "destructive" : "outline"}>
                                {param.required ? "Yes" : "No"}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 border-b">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Examples */}
              <div>
                <h3 className="font-semibold mb-4">Examples</h3>
                
                {/* cURL Example */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">cURL</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateCurlExample(endpoint), `curl-${index}`)}
                    >
                      {copiedCode === `curl-${index}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {generateCurlExample(endpoint)}
                  </pre>
                </div>

                {/* JavaScript Example */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">JavaScript</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateJsExample(endpoint), `js-${index}`)}
                    >
                      {copiedCode === `js-${index}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {generateJsExample(endpoint)}
                  </pre>
                </div>
              </div>

              {/* Response Format */}
              <div>
                <h3 className="font-semibold mb-2">Response Format</h3>
                <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{endpoint.name.includes('Get Caller Details') ? 
`{
  "success": true,
  "campaign_id": "uuid",
  "caller": {
    "contact": { /* contact details */ },
    "campaign": { /* campaign details */ },
    "agent": { /* agent details */ },
    "user": { /* user details */ }
  }
}` :
endpoint.name.includes('Get') ? 
`{
  "success": true,
  "data": {
    /* endpoint specific data */
  }
}` :
`{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "user_id": "user-uuid",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
    /* other entity fields */
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Error Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive">400</Badge>
                <span className="font-medium">Bad Request</span>
              </div>
              <pre className="text-sm bg-red-50 p-3 rounded">{"{ \"error\": \"Validation error message\" }"}</pre>
            </div>
            
            <div className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive">401</Badge>
                <span className="font-medium">Unauthorized</span>
              </div>
              <pre className="text-sm bg-red-50 p-3 rounded">{"{ \"error\": \"Unauthorized\" }"}</pre>
            </div>
            
            <div className="border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">404</Badge>
                <span className="font-medium">Not Found</span>
              </div>
              <pre className="text-sm bg-yellow-50 p-3 rounded">{"{ \"error\": \"Resource not found\" }"}</pre>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">500</Badge>
                <span className="font-medium">Internal Server Error</span>
              </div>
              <pre className="text-sm bg-gray-50 p-3 rounded">{"{ \"error\": \"Internal server error\" }"}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Rate Limiting & Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Rate Limiting</h4>
              <p className="text-sm text-blue-700">
                All APIs are subject to rate limiting. Please implement appropriate retry logic and respect rate limits to maintain service availability.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Best Practices</h4>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>Always include proper authentication headers</li>
                <li>Handle error responses gracefully</li>
                <li>Implement retry logic for transient failures</li>
                <li>Cache responses when appropriate</li>
                <li>Use HTTPS for all API calls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentation;
