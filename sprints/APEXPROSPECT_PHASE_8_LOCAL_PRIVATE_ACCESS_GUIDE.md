# APEXPROSPECT PHASE 8 — LOCAL / PRIVATE ACCESS GUIDE

Date: 2026-06-24
Tool: ApexProspect by AUKIY
Port: 3777

---

## ⚠ Security Notice

ApexProspect contains real prospect data, contact details, draft messages,
and operator action logs. Do NOT expose it publicly without a password set.

---

## 1. Run Locally (Recommended Default)

```bash
cd C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\tools\semi-auto-outreach
npm start
```

Open browser: **http://localhost:3777**

**What happens by default (no password set):**
- Server binds to `127.0.0.1` only (loopback interface)
- No other device on the network can reach it
- `remoteGuard` middleware blocks any non-localhost request with HTTP 403
- Safe to run with no additional firewall rules

---

## 2. LAN Access Option (Same WiFi, Home/Office Only)

Use this when you want to open ApexProspect on your phone or another PC
on the same private network.

**Step 1 — Set a password in `.env`:**

```env
APEX_OPERATOR_PASSWORD=your-strong-private-password
```

**Step 2 — Start the server:**

```bash
npm start
```

Server will now bind to `0.0.0.0` (all interfaces).

**Step 3 — Find your local IP:**

```powershell
ipconfig
# Look for: IPv4 Address . . . : 192.168.x.x
```

**Step 4 — Open on other device:**

```
http://192.168.x.x:3777
```

You will be prompted to enter the operator password.

**Risk:** Anyone on the same WiFi who knows the IP and port can reach the login
screen. Keep the password strong. Do not use on public WiFi.

---

## 3. Tailscale Option (Recommended for Remote/Mobile Access)

Tailscale creates a private encrypted mesh network between your own devices.
No port forwarding. No public exposure. Free for personal use (up to 3 users).

**Setup:**

1. Install Tailscale on PC: https://tailscale.com/download
2. Install Tailscale on phone/tablet
3. Sign in with the same account on both devices
4. Set password in `.env` (required for non-localhost access):

```env
APEX_OPERATOR_PASSWORD=your-strong-private-password
```

5. Start the server:

```bash
npm start
```

6. Find your Tailscale IP on PC:

```powershell
tailscale ip -4
# Example: 100.x.x.x
```

7. Open on any of your Tailscale devices:

```
http://100.x.x.x:3777
```

**Why this is the recommended remote option:**
- End-to-end encrypted (WireGuard)
- No public URL — only your enrolled devices can connect
- Free tier sufficient for personal use
- Works across mobile data and WiFi

---

## 4. Cloudflare Tunnel — Temporary / Emergency Only

Use only if you need to access ApexProspect from a device not on Tailscale
and cannot install it (e.g., borrowed device, internet cafe — NOT recommended).

**Requires: password set in `.env` first (mandatory before using tunnel)**

```bash
# One-time install (no account needed for quick tunnel)
winget install Cloudflare.cloudflared

# Start tunnel (run this AFTER npm start)
cloudflared tunnel --url http://localhost:3777
```

Cloudflare will print a temporary HTTPS URL like:
```
https://xxxx-xxxx.trycloudflare.com
```

Open that URL on any device. Enter password when prompted.

**Risks:**
- The URL is technically public (anyone who guesses it can reach the login page)
- Tunnel is temporary — URL changes each run
- Do NOT share the URL
- Close the tunnel when done (`Ctrl+C`)
- This is NOT for persistent use

---

## 5. What NOT to Do

| Action | Why Not |
|--------|---------|
| Deploy to Railway without auth | Exposes all prospect data publicly |
| Run `npm start` on a VPS without password | Server binds 0.0.0.0 with no auth — fully open |
| Share the Cloudflare tunnel URL | Anyone with the link can attempt login |
| Use public WiFi with LAN access enabled | Other users on the network can reach the server |
| Commit `.env` to git | Password exposed in repository history |
| Set a weak password (e.g., "1234") | Easily brute-forced if port is exposed |

---

## 6. Env / Config Reference

| Variable | Default | Effect |
|----------|---------|--------|
| `APEX_OPERATOR_PASSWORD` | (empty) | Sets operator password. When empty: localhost-only, no login. When set: enables remote access with login gate. |
| `PORT` | `3777` | Override listen port: `PORT=4000 npm start` |
| `BIND_HOST` | auto | Not a user variable — server sets `127.0.0.1` when unprotected, `0.0.0.0` when protected. Do not override manually. |

**`.env` file location:**
```
tools/semi-auto-outreach/.env
```

**Template (`.env.example`):**
```env
# ApexProspect Operator Security
# Copy to .env and set a strong password before exposing via ngrok/tunnel

APEX_OPERATOR_PASSWORD=your-strong-password-here
# PORT=3777
```

---

## 7. Recommended Option for Aliff

**Day-to-day use (PC only):**
→ Run locally, no password needed, open `http://localhost:3777`

**Access from phone on same WiFi:**
→ Set `APEX_OPERATOR_PASSWORD` in `.env`, use LAN IP

**Access from phone anywhere (best option):**
→ Install Tailscale on PC + phone, set password, use Tailscale IP

**Emergency remote access:**
→ Cloudflare Tunnel (temporary, close when done)

**Do not:**
→ Deploy to Railway, Render, or any public hosting until Phase 9 auth is complete

---

## 8. Phase 9 Recommendation

When ApexProspect is ready for multi-device or team use, Phase 9 should add:

- Session token auth (already partially implemented via `APEX_OPERATOR_PASSWORD`)
- HTTPS support (via reverse proxy or self-signed cert)
- Login page with rate limiting
- Operator audit log (who logged in, when)

This is not needed while usage remains single-operator on trusted devices.
