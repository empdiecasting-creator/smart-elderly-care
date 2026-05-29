# Smart Elderly Care — B2B Export Website

A professional, static B2B export website for elderly health assistive products. Built for overseas wholesalers, distributors, and nursing home buyers.

## Project Structure

```
smart-elderly-care/
├── index.html                  # Homepage
├── contact.html                # Inquiry form page
├── about.html                  # About company
├── css/
│   └── style.css               # Global stylesheet (~27KB)
├── js/
│   └── main.js                 # Global JavaScript
├── products/
│   ├── smart-cane.html         # Smart Walking Cane
│   ├── smart-rail.html         # Smart Support Rail
│   ├── smart-ring.html         # Health Smart Ring
│   └── patient-lifter.html     # Patient Transfer Aid
└── README.md                   # This file
```

## Features

- **Semantic HTML5** — accessible, SEO-friendly markup
- **Fully responsive** — mobile-first with CSS Grid/Flexbox
- **Sticky navigation** with mobile hamburger menu
- **B2B-focused** — showcases OEM/ODM, bulk pricing, certifications
- **Product detail pages** — technical specs table, B2B benefits, "Get a Quote" CTAs
- **Contact form** — pre-populated product interest via URL parameters
- **Smooth animations** — scroll reveals, counter animations
- **Dark/light mode ready** — CSS custom properties throughout

## Color Scheme

| Role       | Color     | Hex       |
|------------|-----------|-----------|
| Primary    | Deep Blue | `#1a365d` |
| Accent     | Teal      | `#319795` |
| Background | White     | `#ffffff` |
| Text       | Dark Gray | `#2d3748` |

## Deployment — Cloudflare Pages

This is a pure static site. No build step required.

1. Push this folder to a Git repository
2. In Cloudflare Dashboard → Pages → Create a project
3. Connect your Git provider and select the repo
4. **Build settings:**
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: *(leave as root `/`)*
5. Deploy!

Alternatively, use any static host: Netlify, Vercel, GitHub Pages, or AWS S3.

## Customization

### Adding a new product

1. Create a new `.html` file in `products/`
2. Copy the structure from an existing product page
3. Update breadcrumbs, specs table, and product name
4. Add a card to `index.html` in the products grid
5. Add a link in the footer product column

### Changing colors

Edit the `:root` CSS custom properties in `css/style.css`.

### Contact form

The form is frontend-only and simulates submission. To make it functional:
- Integrate with a form backend (Formspree, Web3Forms, etc.)
- Or replace the `setTimeout` handler in `js/main.js` with a `fetch` POST to your API

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Chrome for Android

## License

Private — for client use only.
