# JFAUTODETAILING Editing Guide

## Good news: everything is editable
This website is built as plain HTML, CSS and JavaScript. That means you can edit literally everything later:
- text
- colours
- pages
- images
- pricing
- forms
- booking steps
- buttons
- layout
- service lists
- contact details

There is no locked builder and no hidden proprietary system.

## Fastest place to edit shared details
Edit `assets/js/site-config.js` to change the phone number, email, WhatsApp link, opening hours, social links, location and footer description across every page.

## Where to edit things
- `index.html` = homepage
- `services.html` = service descriptions
- `pricing.html` = price table
- `booking.html` = booking form layout and steps
- `gallery.html` = gallery page
- `reviews.html` = reviews and trust badges
- `about.html` = business story
- `areas.html` = areas covered
- `contact.html` = contact details and contact form
- `faq.html` = FAQs
- `assets/css/style.css` = colours, spacing, visual design, buttons, cards, logo sizing
- `assets/js/script.js` = menu, animations, FAQ behaviour, before/after slider, booking step logic

## Logo and colours
The cleaned logo file is saved at:
- `assets/images/jf-logo.png`

Current brand colours were adjusted to better match the logo:
- Orange deep: `#cf7227`
- Brand orange: `#f28c1f`
- Amber highlight: `#ffb321`
- Silver: `#d7d9dc`
- Charcoal: `#14181d`
- Dark background: `#0d1014`

These live at the top of `assets/css/style.css` inside `:root`, so they are very easy to change later.

## How to change the booking system later
The current booking page is a front-end demo. It now includes sensible `name` attributes, so it is easier to connect later.

### Future option 1 — simple and fast
Connect the form to:
- Formspree
- Netlify Forms
- Basin
- a simple PHP mail handler

Best if you mainly want booking requests sent to email.

### Future option 2 — proper custom booking system
Create a real backend using something like:
- Node.js + Express
- PHP
- Supabase / Firebase
- a custom database

Then the form can:
- save bookings
- send confirmation emails
- show available dates
- block unavailable times
- store customer notes
- create an admin dashboard

### Future option 3 — easiest no-code approach
Embed or link to a booking platform like:
- Calendly
- TidyCal
- SimplyBook.me
- Setmore

This is the fastest live solution if you want something working soon.

## How the current booking page works
The page is split into 5 steps:
1. Vehicle
2. Service
3. Date
4. Address
5. Customer details

The step behaviour is controlled in `assets/js/script.js`.
If you want to add, remove or rename steps later, we can do that.

## Speed notes
The site was adjusted to be a bit lighter by:
- removing the external Google font request
- using the local/system font stack instead
- reducing some visual overhead in the header
- keeping the site as plain HTML/CSS/JS with no framework bloat

When real images are added, the biggest speed improvements will come from:
- resizing images properly
- converting them to WebP or AVIF
- lazy-loading non-critical images
- keeping video compressed

## Important factual correction saved
The website template originally used the source note saying “16 years in business”. This has now been corrected in the files.
Use:
- `Since 2023`
- or a custom founder story

You can also mention that the owner is 16 on the About page if you want that to be part of the brand story.

## Visual refresh completed
- The exact logo filename is `assets/images/jf-logo.png`.
- The logo was cropped and compressed so it loads faster and appears larger in the header.
- A favicon and Apple touch icon were created from the JF mark.
- The site palette now matches the orange, amber, silver, charcoal and black logo colours.
- The header, buttons, cards, forms, placeholders and footer were refined.
- Shared business information now comes from `assets/js/site-config.js`.
