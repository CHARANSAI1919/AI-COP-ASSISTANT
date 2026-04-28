# AI Cop NLP Service — Startup Guide

## Prerequisites
- Python 3.10+

## Setup & Run
```bash
cd nlp_service
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
```

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET  | `/` | Health check |
| POST | `/parse-command` | Parse a natural language command |

## Sample Request
```bash
curl -X POST http://localhost:5000/parse-command \
  -H "Content-Type: application/json" \
  -d '{"command": "Issue challan to MH12AB1234 for jumping red light"}'
```
