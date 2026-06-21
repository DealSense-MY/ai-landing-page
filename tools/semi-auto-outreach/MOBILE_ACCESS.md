# Mobile Access — ApexProspect

To open ApexProspect on your phone:

1. Start the server first (double-click ApexProspect on Desktop, or run
   START_APEXPROSPECT.bat)
2. Open a NEW terminal/cmd window and run:
   ngrok http 3777
3. ngrok will show a URL like: https://xxxx-xx-xx-xxx-xx.ngrok-free.app
4. Open that URL on your phone browser
5. You'll be asked for the operator password (same one in .env)
6. Close the ngrok window when done — this closes the tunnel

Note: the ngrok URL changes every time you restart ngrok (free tier).
This is normal — just copy the new URL each session.
