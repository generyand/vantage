#  Supabase Integration Examples

## Using Supabase Client vs SQLAlchemy

### Supabase Client (for real-time, auth, storage)
```python
from fastapi import Depends
from supabase import Client
from app.api.deps import get_supabase_client

@router.get("/real-time-data")
def get_real_time_data(supabase: Client = Depends(get_supabase_client)):
    # Real-time subscriptions
    response = supabase.table("assessments").select("*").execute()
    return response.data
```

### SQLAlchemy (for complex queries, transactions)
```python
from fastapi import Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db

@router.get("/complex-query")
def complex_query(db: Session = Depends(get_db)):
    # Complex joins and transactions
    result = db.query(Assessment).join(User).filter(...).all()
    return result
```

## Quick Start Commands

1. Copy environment template:
   cp .env.example .env

2. Fill in your Supabase credentials from dashboard

3. Test connection:
   uv run python -c "from app.db.base import supabase; print(supabase.table(\"test\").select(\"*\").execute())"

