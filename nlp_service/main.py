from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
from datetime import datetime, timedelta
import random
import string

app = FastAPI(title="AI Cop NLP Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommandRequest(BaseModel):
    command: str


VIOLATION_FINES = {
    "red light": 1000,
    "signal jump": 1000,
    "over speeding": 2000,
    "speeding": 2000,
    "wrong side": 500,
    "no helmet": 500,
    "without helmet": 500,
    "drunk driving": 10000,
    "triple riding": 1000,
    "no seatbelt": 500,
    "without seatbelt": 500,
    "mobile phone": 1500,
    "phone while driving": 1500,
    "no insurance": 2000,
    "expired rc": 1500,
    "expired registration": 1500,
    "rash driving": 5000,
    "dangerous driving": 5000,
}

LOCATIONS = [
    "MG Road Junction, Bengaluru",
    "Koramangala Signal, Bengaluru",
    "Brigade Road, Bengaluru",
    "Silk Board Junction, Bengaluru",
    "Hebbal Flyover, Bengaluru",
]

def extract_plate(text: str) -> str | None:
    """Extract Indian vehicle registration number from command.
    Matches formats like KA 51 ML 1234, KA-51-ML-1234, KA01AB1234, etc.
    """
    pattern = r'\b([A-Za-z]{2}[-\s]?\d{2}[-\s]?[A-Za-z]{1,2}[-\s]?\d{4})\b'
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        # Normalize: remove all spaces and dashes, convert to uppercase
        return re.sub(r'[-\s]+', '', match.group(1)).upper()
    return None

def detect_intent(text: str) -> str:
    lower = text.lower()
    if any(kw in lower for kw in ["help", "what can you", "commands", "how to"]):
        return "help"
    if any(kw in lower for kw in ["challan", "issue", "fine", "penalty", "ticket"]):
        return "issue_challan"
    if any(kw in lower for kw in ["check", "lookup", "verify", "search", "details", "info"]):
        return "check_vehicle"
    return "check_vehicle"  # default if plate is found

def extract_violation(text: str):
    lower = text.lower()
    for violation, fine in VIOLATION_FINES.items():
        if violation in lower:
            return violation, fine
    return "traffic violation", 500

def generate_challan_id():
    suffix = ''.join(random.choices(string.digits, k=6))
    return f"CH{suffix}"

@app.get("/")
def health():
    return {"status": "ok", "service": "AI Cop NLP Service", "version": "1.0.0"}

@app.post("/parse-command")
def parse_command(request: CommandRequest):
    command = request.command
    plate = extract_plate(command)
    intent = detect_intent(command) if plate else ("help" if "help" in command.lower() else "unknown")

    if intent == "help":
        return {
            "intent": "help",
            "message": "You can say: 'Issue challan to MH12AB1234 for jumping red light' or 'Check vehicle TN09CD5678'"
        }

    if not plate:
        return {
            "intent": "unknown",
            "message": "No license plate detected. Please include a valid plate number."
        }

    violation, fine = extract_violation(command)
    now = datetime.now()
    due = now + timedelta(days=15)

    result = {
        "intent": intent,
        "plate": plate,
        "entities": {
            "license_plate": plate,
            "violation": violation if intent == "issue_challan" else None,
            "amount": fine if intent == "issue_challan" else None,
        }
    }

    if intent == "issue_challan":
        result["challan_suggestion"] = {
            "id": generate_challan_id(),
            "violation": violation,
            "amount": fine,
            "datetime": now.strftime("%d/%m/%Y %I:%M %p"),
            "location": random.choice(LOCATIONS),
            "dueDate": due.strftime("%d/%m/%Y"),
        }

    return result
