@echo off
echo Starting FastAPI server...
cd %~dp0
call .venv\Scripts\activate
uvicorn main:app --reload
