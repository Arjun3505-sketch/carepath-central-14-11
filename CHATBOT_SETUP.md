# Medical Assistant Chatbot - Complete Setup Guide

## 🎯 Overview

This project includes a full-stack medical assistant chatbot that uses Google Gemini AI to help users query their medical data. The chatbot can answer questions about diagnoses, prescriptions, and lab reports stored in Supabase.

## 🏗️ Architecture

```
Frontend (React + TypeScript + Vite)
  ↓ HTTP Requests (axios)
Flask Backend (Python)
  ↓ Queries
Supabase (PostgreSQL)
  ↓ Medical Data
Gemini AI (Google)
  ↓ Intelligent Responses
```

## 📦 Installation

### 1. Frontend Setup

```powershell
# Install Node dependencies (already done)
npm install

# Key packages installed:
# - axios: HTTP client for API calls
# - @google/generative-ai: Gemini SDK (for OCR feature)
# - shadcn/ui components
```

### 2. Backend Setup

```powershell
# Navigate to Flask directory
cd flask

# Install Python dependencies (already done)
pip install -r requirements.txt

# Key packages installed:
# - Flask: Web framework
# - flask-cors: CORS support
# - google-generativeai: Gemini AI SDK
# - supabase: Database client
# - python-dotenv: Environment variables
```

## 🔧 Configuration

### Frontend Environment (`.env` in root directory)

```env
VITE_GEMINI_API_KEY=AIzaSyDqPT6Fu1drcRSskPvJETzRXsLe1A-YJa8
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend Environment (`flask/.env`)

```env
GEMINI_API_KEY=AIzaSyDqPT6Fu1drcRSskPvJETzRXsLe1A-YJa8
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
```

**Important:** The backend needs the **service role key** for full database access, not the anon key.

## 🚀 Running the Application

### Step 1: Start Flask Backend

```powershell
# In a NEW terminal window
cd "c:\Users\KRISH AGRAWAL\OneDrive\Desktop\sem V\mini\carepath-central-14-11\flask"
python app.py
```

Expected output:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

### Step 2: Start Frontend Development Server

```powershell
# In another terminal window
cd "c:\Users\KRISH AGRAWAL\OneDrive\Desktop\sem V\mini\carepath-central-14-11"
npm run dev
```

Expected output:
```
VITE v5.x ready in XXX ms
➜  Local:   http://localhost:8080/
```

### Step 3: Access the Application

Open browser to `http://localhost:8080` (or the port Vite shows)

## 🎮 Using the Chatbot

### 1. Click the Chatbot Button

A floating purple button appears in the bottom-right corner of all pages with a message icon.

### 2. Enter Patient ID

When the chatbot opens, enter the patient's UUID from the database.

### 3. Start Chatting

Ask questions like:
- "What are my latest diagnoses?"
- "Show me my prescriptions"
- "What were my recent lab test results?"
- "Any abnormal findings in my reports?"
- "What medications am I currently taking?"

### 4. AI Responses

The chatbot will:
1. Fetch all medical records from Supabase
2. Send data + your question to Gemini AI
3. Return a detailed, context-aware answer

## 🧪 Testing the System

### Test Flask Backend Directly

```powershell
# Health check
curl http://localhost:5000/health

# Fetch patient data (replace with real patient_id)
curl -X POST http://localhost:5000/fetch `
  -H "Content-Type: application/json" `
  -d '{"patient_id":"123e4567-e89b-12d3-a456-426614174000"}'

# Test chatbot endpoint
curl -X POST http://localhost:5000/chat_with_data `
  -H "Content-Type: application/json" `
  -d '{"patient_id":"123e4567-e89b-12d3-a456-426614174000","user_input":"What are my diagnoses?","diagnoses":[],"prescriptions":[],"lab_reports":[]}'
```

### Check Frontend-Backend Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Open chatbot and enter patient ID
4. Watch for requests to `http://localhost:5000/fetch` and `/chat_with_data`
5. Check Console for any errors

## 📊 Database Schema

Ensure your Supabase database has these tables:

### `diagnoses`
- `id` (uuid, primary key)
- `patient_id` (uuid, foreign key)
- `condition_name` (text)
- `diagnosed_date` (date)
- `severity` (text)
- `status` (text)
- `notes` (text)

### `prescriptions`
- `id` (uuid, primary key)
- `patient_id` (uuid, foreign key)
- `medication_name` (text)
- `dosage` (text)
- `frequency` (text)
- `start_date` (date)
- `end_date` (date)
- `prescribing_doctor` (text)

### `lab_reports`
- `id` (uuid, primary key)
- `patient_id` (uuid, foreign key)
- `test_name` (text)
- `test_date` (date)
- `result` (text)
- `reference_range` (text)
- `status` (text)

## 🔍 Features

### Document OCR (AddDiagnosis Page)
- Upload any document (image, PDF, DOC, DOCX)
- Gemini AI extracts medical information
- Auto-fills diagnosis form fields

### Medical Chatbot (All Pages)
- Floating button accessible everywhere
- Context-aware conversations
- Fetches real-time data from Supabase
- Powered by Gemini 1.5 Flash model

## 🐛 Troubleshooting

### Issue: "axios is not defined"
**Solution:** Run `npm install axios` in root directory

### Issue: "Failed to fetch from Flask"
**Solution:** 
1. Verify Flask is running on port 5000
2. Check CORS settings in `flask/app.py`
3. Ensure frontend is using correct API URL

### Issue: "Invalid API key"
**Solution:**
1. Check both `.env` files have correct Gemini API key
2. Restart both servers after changing .env files

### Issue: "No patient data found"
**Solution:**
1. Verify patient_id exists in Supabase database
2. Check Supabase URL and key are correct
3. Ensure backend has service role key (not anon key)

### Issue: Port already in use
**Solution:**
```powershell
# Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Or change port in flask/app.py:
# app.run(port=5001, debug=True)
```

## 📝 File Structure

```
carepath-central-14-11/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── Chatbot.tsx              # Main chat interface
│   │   │   └── ChatbotButton.tsx        # Floating toggle button
│   │   └── ocr/
│   │       └── ImageUploader.tsx        # Document OCR component
│   └── pages/
│       └── AddDiagnosis.tsx             # Form with OCR integration
├── flask/
│   ├── app.py                           # Flask API server
│   ├── chatbot_logic.py                 # Gemini AI brain
│   ├── requirements.txt                 # Python dependencies
│   ├── .env                             # Backend config
│   └── README.md                        # Backend docs
├── .env                                 # Frontend config
└── CHATBOT_SETUP.md                     # This file
```

## 🎯 Next Steps

1. ✅ All dependencies installed
2. ✅ Frontend integration complete
3. ⏳ Configure Supabase credentials
4. ⏳ Start Flask backend
5. ⏳ Test chatbot with real patient data
6. ⏳ Deploy to production (optional)

## 🚨 Security Notes

- Never commit `.env` files to Git
- Use service role key only in backend (never frontend)
- Implement proper authentication before production
- Rate-limit API calls to prevent abuse
- Validate all patient IDs before database queries

## 📚 API Reference

See `flask/README.md` for detailed API endpoint documentation.

## 💬 Support

For issues or questions:
1. Check console logs (browser & terminal)
2. Verify all environment variables
3. Test endpoints with curl
4. Review Supabase database structure
