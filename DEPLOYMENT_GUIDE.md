# OwlFacts Deployment Guide

## ?? Quick Deploy to Cloudflare Pages

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `owlfacts-schengen-calculator`
3. Make it Public
4. Click "Create repository"

### Step 2: Upload Your Files

**Option A: GitHub Web Interface (Easiest)**
1. On your new repo page, click "uploading an existing file"
2. Drag and drop these 3 files:
   - index.html
   - style.css
   - script.js
3. Click "Commit changes"

**Option B: Git Command Line**
```bash
git init
git add index.html style.css script.js
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/owlfacts-schengen-calculator.git
git push -u origin main
```

### Step 3: Deploy on Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Click "Pages" in left sidebar
3. Click "Create a project"
4. Click "Connect to Git"
5. Select your GitHub repository: `owlfacts-schengen-calculator`
6. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: /
7. Click "Save and Deploy"

Your site will be live at: `https://owlfacts-schengen-calculator.pages.dev`

### Step 4: Add Custom Domain

1. In Cloudflare Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter: `owlfacts.com`
4. Follow DNS setup instructions
5. Wait 5-10 minutes for SSL certificate

---

## ?? Set Up Email Capture

### Option 1: Tally.so (Free)

1. Go to https://tally.so
2. Create free account
3. Create new form with single email field
4. Get form endpoint URL
5. Update `script.js` line 142:
```javascript
// Replace console.log with actual submission
fetch('YOUR_TALLY_FORM_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
});
```

### Option 2: Google Sheets (Free)

1. Use this tutorial: https://github.com/jamiewilson/form-to-google-sheets
2. Takes 10 minutes to set up
3. Emails go directly to Google Sheet

---

## ?? Add Affiliate Links

Update `script.js` around line 150 with your actual affiliate links:

```javascript
const affiliateLinks = {
    safetywing: 'https://safetywing.com/?referenceID=YOUR_ID',
    wise: 'https://wise.com/invite/u/YOUR_ID',
    airalo: 'https://ref.airalo.com/YOUR_ID'
};
```

### How to Get Affiliate IDs:

**SafetyWing:**
- Apply: https://safetywing.com/affiliates
- Commission: 10% recurring
- Cookie: 60 days

**Wise:**
- Apply: https://wise.com/partnerships
- Commission: $15-30 per signup

**Airalo:**
- Apply: https://www.airalo.com/partners
- Commission: 10%
- Cookie: 30 days

---

## ?? Add Google Analytics

1. Go to https://analytics.google.com
2. Create new property for owlfacts.com
3. Get your Measurement ID (looks like G-XXXXXXXXXX)
4. Update `script.js` line 159:
```javascript
gtag('config', 'G-XXXXXXXXXX'); // Replace with your ID
```

---

## ?? SEO Checklist (Do After Deployment)

### Immediate Actions:

1. **Submit to Google Search Console**
   - Go to https://search.google.com/search-console
   - Add owlfacts.com
   - Verify ownership (DNS method)
   - Submit sitemap: `owlfacts.com/sitemap.xml` (create this next)

2. **Create sitemap.xml**
   Create new file `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://owlfacts.com/</loc>
    <lastmod>2026-02-16</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

3. **Create robots.txt**
   Create new file `robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://owlfacts.com/sitemap.xml
```

### Week 1 Actions:

4. **Add Blog Posts**
   - Use Claude to generate 10 blog posts (I can do this for you)
   - Create `/blog` folder
   - Add one post per week

5. **Get First Backlinks**
   - Post on Reddit r/travel with helpful Schengen tip
   - Comment on 20 YouTube travel videos
   - Email 10 travel bloggers

---

## ?? Traffic Strategy (First 30 Days)

### Week 1: Foundation
- ? Deploy site
- ? Set up email capture
- ? Add affiliate links
- ? Submit to Google Search Console
- ? Write 5 Reddit posts (use Claude)

### Week 2: Content
- ? Add 3 blog posts
- ? Post to Reddit 3x
- ? Comment on 20 YouTube videos

### Week 3: Backlinks
- ? Email 20 travel bloggers
- ? Guest post on 1 travel blog
- ? Post in travel forums

### Week 4: Optimization
- ? Analyze Google Analytics
- ? A/B test affiliate placement
- ? Add more blog content

---

## ?? Quick Wins to Implement

### Add "Share" Buttons
Add this after the calculator results:
```html
<div class="share-section">
  <h4>Share OwlFacts with fellow travelers:</h4>
  <a href="https://twitter.com/intent/tweet?text=Free%20Schengen%20calculator&url=https://owlfacts.com">Twitter</a>
  <a href="https://www.facebook.com/sharer.php?u=https://owlfacts.com">Facebook</a>
</div>
```

### Add FAQ Schema
Add to `<head>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How is the 90-day limit calculated in 2026?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "It is a rolling 180-day window. On any day you are in Schengen, you look back at the last 180 days. Total stay must not exceed 90 days."
    }
  }]
}
</script>
```

---

## ?? Troubleshooting

### Site Not Loading?
- Check Cloudflare Pages deployment logs
- Verify all 3 files are in repo root
- Clear browser cache

### Calculator Not Working?
- Open browser console (F12)
- Check for JavaScript errors
- Verify script.js is loading

### Email Form Not Working?
- Check browser console for errors
- Verify Tally endpoint URL
- Test with your own email first

---

## ?? Expected Results

**Week 1:**
- 10-50 visitors (from Reddit)
- 0-5 email signups
- $0-5 from affiliates

**Month 1:**
- 200-500 visitors
- 20-50 email signups
- $10-50 from affiliates

**Month 3:**
- 1,000-2,000 visitors
- 100-200 email signups
- $100-300 from affiliates

**Month 6:**
- 5,000+ visitors (Google traffic kicks in)
- 500+ email signups
- $500-1,000 from affiliates

---

## ?? Important Notes

1. **Affiliate Links:** Replace placeholder links with YOUR actual affiliate IDs
2. **Email Service:** Set up Tally.so or Google Sheets form submission
3. **Analytics:** Add your Google Analytics ID
4. **Legal:** The site includes privacy policy and terms links - create these pages
5. **Accuracy Disclaimer:** Calculator is for informational purposes only

---

## ?? Customization Tips

### Change Colors
Edit `style.css` variables (lines 1-14):
```css
:root {
    --primary: #2D5016;  /* Change to your brand color */
    --accent: #D97706;   /* Change accent color */
}
```

### Change Fonts
Replace font import in `index.html` (line 29):
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

### Add More Affiliate Products
Edit `script.js` and add new cards to HTML

---

## ? Final Checklist Before Launch

- [ ] All 3 files uploaded to GitHub
- [ ] Cloudflare Pages deployment successful
- [ ] Custom domain connected
- [ ] SSL certificate active (https works)
- [ ] Email capture configured
- [ ] Affiliate links added (with YOUR IDs)
- [ ] Google Analytics installed
- [ ] Tested calculator with multiple trips
- [ ] Tested on mobile phone
- [ ] Submitted to Google Search Console
- [ ] Posted first Reddit post

---

## ?? Need Help?

If you get stuck:
1. Check Cloudflare Pages documentation
2. Ask in r/webdev or r/cloudflare
3. Or come back here and I'll help you debug!

---

**YOU'RE READY TO LAUNCH! ??**

Next: Get your first dollar within 7-14 days by following the traffic strategy above.
