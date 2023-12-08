@echo off
echo Starting Batch File

if [%1]==[] start chrome http://localhost:3000/
node server.js