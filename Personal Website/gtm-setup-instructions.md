<!-- Google Tag Manager Setup Instructions -->

# Google Tag Manager Implementation for Mohamed Shahin Website

## Step 1: Create GTM Account
1. Go to https://tagmanager.google.com/
2. Create a new account for "Mohamed Shahin Website"
3. Create a container for the website
4. Get the GTM Container ID (GTM-XXXXXXX)

## Step 2: Add GTM Code to All Pages
Replace the current analytics setup with GTM code in the <head> section:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-CONTAINER_ID');</script>
<!-- End Google Tag Manager -->
```

And add this immediately after the opening <body> tag:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-CONTAINER_ID"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## Step 3: Configure Tags in GTM
1. Google Analytics 4 Configuration Tag
2. Facebook Pixel Base Code Tag
3. Enhanced Ecommerce Events
4. Custom Event Triggers for form submissions
5. WhatsApp click tracking
6. Social media engagement tracking

## Benefits of GTM:
- Manage all tracking codes from one place
- No need to edit website code for new tracking
- Version control for tracking changes
- Debug mode for testing
- Enhanced event tracking capabilities