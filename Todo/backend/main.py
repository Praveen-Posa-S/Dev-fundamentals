import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Todo API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoCreate(BaseModel):
    title: str

class TodoUpdate(BaseModel):
    is_completed: bool

@app.get("/health")
def check_db_health():
    try:
        response = supabase.table("todos").select("count", count="exact").execute()
        return {"status": "connected", "total_records": response.count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Todo API is running"}

@app.get("/todos")
def get_todos():
    response = supabase.table("todos").select("*").order("id", desc=False).execute()
    return response.data

@app.post("/todos")
def create_todo(todo: TodoCreate):
    response = supabase.table("todos").insert({"title": todo.title}).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Error creating todo")
    return response.data[0]

@app.put("/todos/{todo_id}")
def update_todo_status(todo_id: int, todo: TodoUpdate):
    response = (
        supabase.table("todos")
        .update({"is_completed": todo.is_completed})
        .eq("id", todo_id)
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Todo not found")
    return response.data[0]

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    response = supabase.table("todos").delete().eq("id", todo_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)