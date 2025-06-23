
# AI Calling Platform FastAPI

This FastAPI application replicates all the Supabase Edge Functions from the AI Calling Platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example` and add your Supabase credentials:
```bash
cp .env.example .env
```

3. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, you can view the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Agents
- `POST /agents/create` - Create a new agent
- `GET /agents/list` - List all agents for authenticated user
- `GET /agents/by-number` - Get agent by number

### Campaigns
- `POST /campaigns/create` - Create a new campaign
- `GET /campaigns/list` - List all campaigns for authenticated user
- `GET /campaigns/extracted-data/{campaign_id}` - Get extracted data for campaign

### Contacts
- `POST /contacts/create` - Create a new contact
- `GET /contacts/list` - List all contacts for authenticated user

### Scripts
- `POST /scripts/create` - Create a new script
- `GET /scripts/list` - List all scripts for authenticated user
- `GET /scripts/user-scripts` - Get user scripts (alias for list)

### Knowledge Base
- `POST /knowledge-base/create` - Create a new knowledge base entry
- `GET /knowledge-base/list` - List all knowledge base entries for authenticated user

### Voices
- `POST /voices/create` - Create a new custom voice
- `GET /voices/list` - List all custom voices for authenticated user

### Call Details
- `GET /call-details/caller-details` - Get caller details by phone number
- `GET /call-details/outbound-call-details` - Get outbound call details

### Call Data
- `POST /call-data/receive-call-data` - Receive and store call data

### Entities
- `POST /entities/create-entity` - Create any type of entity (agent, contact, etc.)

## Authentication

The API supports two authentication methods:
1. **Session Token**: Use a Supabase session token in the Authorization header
2. **API Key**: Use a custom API key (starting with 'dhwani_') in the Authorization header

Example:
```
Authorization: Bearer your_session_token_or_api_key
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in JSON format.
