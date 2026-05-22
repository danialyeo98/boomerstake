[README.md](https://github.com/user-attachments/files/28161653/README.md)
# BoomersStake — Vercel Deployment

## File Structure
```
boomerstake/
├── index.html      ← main page
├── style.css       ← all styles
├── script.js       ← all JavaScript
├── vercel.json     ← Vercel config
└── README.md       ← this file
```

## Deploy to Vercel (3 ways)

### Option 1 — Drag & Drop (easiest, no account needed)
1. Go to https://vercel.com/new
2. Drag this entire `boomerstake` folder onto the page
3. Click **Deploy**
4. Done ✅

### Option 2 — Vercel CLI
```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Inside the boomerstake folder
cd boomerstake
vercel

# Follow the prompts, then for production:
vercel --prod
```

### Option 3 — GitHub + Vercel (best for ongoing edits)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new
3. Click **Import Git Repository**
4. Select your repo
5. Framework: **Other** (it's static HTML)
6. Click **Deploy**
7. Every future `git push` auto-deploys ✅

## Local Preview
Just open `index.html` in any browser — no build step needed.

## Customisation
- **Partner links**: Find `href="#"` in index.html and replace with real URLs
- **Telegram link**: Search for `href="#"` on the Telegram buttons
- **Partner names/bonuses**: Edit the `.pcard` sections in index.html
- **Colours**: Edit CSS variables at the top of style.css (`:root { ... }`)
- **Logo**: Replace the `B` text in `.logo-gem` divs with an `<img>` tag

## Responsible Gambling
Remember to update the footer disclaimer and helpline numbers for your jurisdiction.
18+ content — ensure age-gating complies with local regulations.
