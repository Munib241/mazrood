# Mazrood Shopify Theme

A custom Shopify Online Store 2.0 theme built for Mazrood: obsidian background,
bone-white typography (Space Grotesk headings, Inter body), brand-blue #000f9f
wordmark, sharp editorial corners.

## Install

1. Zip this folder (or use the provided zip).
2. In Shopify admin go to **Online Store → Themes → Add theme → Upload zip file**.
3. Upload, then click **Customize** on the Mazrood theme.

## Set up after install

- **Colors and fonts** are editable under Theme settings → Colors / Typography
  (defaults already match the Mazrood design).
- **Logo**: Theme settings → Logo. Leave empty to use the text wordmark
  (default "MAZROOD" in brand blue, with the ™).
- **Header menu**: the header uses Shopify's `main-menu` navigation. The footer
  uses the `footer` menu — edit both under Online Store → Navigation.
- **Homepage**: in the theme editor, pick a background image for the Hero,
  choose a collection for "Featured collection", and add images/text to the
  two Lookbook blocks.
- **Newsletter**: signups land in Shopify Customers tagged `newsletter`.
- Customer accounts use Shopify's new hosted account experience (no legacy
  templates needed).

## Structure

- `layout/theme.liquid` — base layout, renders header/footer section groups
- `sections/` — header, footer, hero, featured collection, lookbook,
  newsletter, and main templates (product, collection, cart, search, blog…)
- `snippets/product-card.liquid` — shared product card
- `assets/base.css`, `assets/theme.js` — styles and AJAX add-to-cart
- `templates/*.json` — Online Store 2.0 JSON templates

## Not included

- Gift card page (`gift_card.liquid`) — add it before selling gift cards.
- Variant-specific image swapping and color-swatch pickers — variants are
  chosen from a single dropdown (standard, reliable).