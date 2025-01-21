#!/bin/bash

cd "$(dirname "$0")/../.."

# Define constants
PORT=3001
API_ENDPOINT="http://localhost:$PORT/api/scheduler"
PAYLOAD='{"key":"value"}'  # Replace this with your actual JSON payload
LOG_FILE="scheduler.log"   # Log file for output and errors
 
# Function to log messages
log_message() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}
 
# Start the Next.js app in the background
log_message "Starting Next.js app on port $PORT..."
npx next start -p $PORT &
 
# Get the process ID of the Next.js app
NEXT_PID=$!
 
# Wait for the app to be ready
log_message "Waiting for Next.js app to be ready..."
while ! curl -s http://localhost:$PORT > /dev/null; do
  sleep 1
done
log_message "Next.js app is running at http://localhost:$PORT"
 
# Send POST request to the scheduler API
log_message "Sending POST request to $API_ENDPOINT..."
if curl -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" >> "$LOG_FILE" 2>&1; then
  log_message "POST request to $API_ENDPOINT was successful."
else
  log_message "POST request to $API_ENDPOINT failed. Check the log file for details."
fi
 
# Keep the script running so the Next.js app doesn't exit
log_message "Keeping the Next.js app running. Press Ctrl+C to stop."
wait $NEXT_PID