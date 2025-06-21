# 🔐 Authentication Database Models
# This file is reserved for future authentication-related database tables
# such as refresh tokens, login sessions, etc.
#
# Note: LoginRequest and AuthToken are Pydantic schemas and belong in 
# app/schemas/token.py, not here.

# Currently no database tables needed for basic JWT authentication.
# Future tables might include:
# - RefreshToken (for token rotation)
# - UserSession (for session management)
# - LoginAttempt (for security logging) 