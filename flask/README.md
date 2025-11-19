# Flask Backend - Medical Assistant Chatbot

## Setup

### 1. Install Python Dependencies

```bash
cd flask
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create or verify `.env` file in the `flask/` directory with:

```env
GEMINI_API_KEY=AIzaSyDqPT6Fu1drcRSskPvJETzRXsLe1A-YJa8
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Start Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Fetch Medical Data
- **POST** `/fetch`
- Body: `{ "patient_id": "uuid" }`
- Returns patient's diagnoses, prescriptions, and lab reports

### Chat with Medical Data
- **POST** `/chat_with_data`
- Body:
  ```json
  {
    "patient_id": "uuid",
    "user_input": "your question",
    "diagnoses": [],
    "prescriptions": [],
    "lab_reports": []
  }
  ```
- Returns AI-generated response based on medical data

## Architecture

```
flask/
├── app.py              # Flask API server with endpoints
├── chatbot_logic.py    # Gemini AI integration
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
└── README.md          # This file
```

## Testing

1. Check health: `curl http://localhost:5000/health`
2. Test fetch endpoint with a valid patient_id
3. Test chatbot with patient data

## Notes

- Ensure Supabase database has tables: `diagnoses`, `prescriptions`, `lab_reports`
- All tables should have `patient_id` foreign key
- CORS enabled for frontend at `http://localhost:5173`
