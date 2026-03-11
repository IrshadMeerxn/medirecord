# Deploy to Railway + Vercel (Step-by-Step)

## Prerequisites
- GitHub account
- Your code pushed to GitHub repository

---

## Part 1: Push to GitHub (If not done yet)

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name it: `medirecord`
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/medirecord.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend to Railway

### Step 1: Sign Up & Create Project
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway
4. Click "New Project"
5. Select "Deploy from GitHub repo"
6. Choose your `medirecord` repository

### Step 2: Configure Backend Service
1. Railway will auto-detect Node.js
2. Click on the service card
3. Go to "Settings" tab
4. Set **Root Directory**: `src/backend`
5. Set **Start Command**: `npm start`

### Step 3: Add Environment Variables
1. Click "Variables" tab
2. Add these variables:
   ```
   SUPABASE_URL=https://kjzvnzlsmlvpicsafptn.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqenZuemxzbWx2cGljc2FmcHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTYxODgsImV4cCI6MjA4ODc5MjE4OH0.TpnXDu5YQvFhC2glZFV29eS5zTfNZeAv4-BimGm1wEE
   PORT=3001
   ```
3. Click "Add" for each variable

### Step 4: Generate Public URL
1. Go to "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Copy your backend URL (looks like: `https://medirecord-production.up.railway.app`)

### Step 5: Wait for Deployment
- Watch the "Deployments" tab
- Wait for "Success" status (takes 2-3 minutes)
- Test your backend: Open `https://your-backend-url.railway.app/api/patient-records`

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Sign Up & Import Project
1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel
4. Click "Add New..." → "Project"
5. Import your `medirecord` repository

### Step 2: Configure Build Settings
1. **Framework Preset**: Vite
2. **Root Directory**: `src/frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 3: Add Environment Variable
1. Expand "Environment Variables"
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app/api`
   - (Use the Railway URL from Part 2, Step 4)
3. Click "Add"

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Vercel will show your live URL: `https://medirecord.vercel.app`

---

## Part 4: Test Your Live App

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Create a test patient record
4. Share the URL with anyone!

---

## Troubleshooting

### Backend Issues
- Check Railway logs: Dashboard → Your Service → "Deployments" → Click latest deployment
- Common issues:
  - Environment variables not set correctly
  - Root directory not set to `src/backend`

### Frontend Issues
- Check Vercel logs: Dashboard → Your Project → "Deployments" → Click latest
- Common issues:
  - `VITE_API_URL` not set or wrong
  - CORS errors (backend needs to allow your Vercel domain)

### CORS Fix (if needed)
If you get CORS errors, update `src/backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

Then push to GitHub - Railway will auto-redeploy.

---

## Your Live URLs

After deployment, you'll have:
- **Backend API**: `https://your-app.railway.app`
- **Frontend App**: `https://your-app.vercel.app`

Both are 100% free and will stay online 24/7!

---

## Auto-Deploy on Git Push

Both Railway and Vercel automatically redeploy when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Your changes will be live in 2-3 minutes!

---

## Need Help?

If you get stuck:
1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Verify environment variables are set correctly
4. Make sure your GitHub repo is up to date

Good luck! 🚀
