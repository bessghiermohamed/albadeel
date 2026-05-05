#!/bin/bash
# Auto-restart Next.js dev server
while true; do
  echo "Starting Next.js dev server..."
  npx next dev -p 3000 2>&1 | tee dev.log
  echo "Server died, restarting in 3s..."
  sleep 3
done
