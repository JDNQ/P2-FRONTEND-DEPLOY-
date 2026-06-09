---
name: Vibrant Marketplace
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#584237'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#8c7164'
  outline-variant: '#e0c0b1'
  surface-tint: '#9d4300'
  primary: '#9d4300'
  on-primary: '#ffffff'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#ffb690'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#d78900'
  on-tertiary-container: '#492c00'
  error: '#ef4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  primary-50: '#fff4ed'
  primary-900: '#7c2d12'
  flash-sale: '#ff2d2d'
  success: '#22c55e'
  border-subtle: '#f1f5f9'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  price-xl:
    fontFamily: Sora
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  caption:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gap-section: 40px
  gap-component: 16px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  card-padding: 20px
  gutter: 16px
---

## Brand & Style

The design system is engineered to evoke a sense of **Playful Urgency** and **Optimistic Minimalism**. It serves a modern, fast-paced consumer base that values both aesthetic clarity and the excitement of discovery. The visual language balances high-energy "Flash Sale" mechanics—using vibrant gradients and dynamic micro-animations—with a premium, structured layout that ensures a trustworthy shopping experience.

The style is **Corporate / Modern** with a **Tactile** edge. It utilizes generous whitespace, sophisticated typography, and soft, dimensional layers to avoid the cluttered feel of traditional discount marketplaces. The interface feels "bubbly" yet disciplined, moving away from flat design toward a more depth-oriented, interactive experience.

## Colors

The palette is anchored by a high-energy orange gradient (`#f97316` to `#ea580c`), symbolizing warmth, action, and accessibility. This is supported by a deep "Brand Deep" brown-orange for high-contrast typography, ensuring legibility without the harshness of pure black.

- **Primary & Secondary:** Used for major CTAs, navigation highlights, and brand-building elements.
- **Urgency (Flash Sale):** A dedicated bright red (`#ff2d2d`) is reserved exclusively for countdown timers and limited-time offer badges to maintain psychological impact.
- **Neutrals:** The background uses a very cool Slate (`#f8fafc`) to provide a crisp contrast against the warm brand colors, while surfaces like cards remain pure white for maximum depth separation.

## Typography

This design system employs a dual-font strategy: **Sora** for high-impact display and financial information, and **Be Vietnam Pro** for functional interface text.

- **Sora (Headings):** Its geometric, open counters provide a modern, premium feel. It is used specifically for product titles, page headers, and large price displays to command attention.
- **Be Vietnam Pro (Body):** Chosen for its exceptional legibility at small sizes and friendly, humanist character. It handles all metadata, descriptions, and UI labels.
- **Styling Note:** Prices should always utilize Sora to feel distinct from descriptive text. Strikethrough pricing (discounts) should use a medium weight in a neutral-400 tone.

## Layout & Spacing

The system follows a strict 4px/8px incremental rhythm to ensure mathematical harmony across all components.

- **Grid:** A 12-column fluid grid is used for desktop (1280px max width), collapsing to a single column on mobile. 
- **Section Gaps:** Major content blocks are separated by 40px (`gap-10`) to provide breathing room and prevent cognitive overload.
- **Stacking:** Form fields and vertical text groups use a consistent 16px (`space-y-4`) stack.
- **Margins:** Mobile views should maintain a 16px safety margin on the horizontal axis, while desktop expands to 32px or follows the centered container constraint.

## Elevation & Depth

This design system uses **Tonal Layering** and **Ambient Shadows** to create a clear spatial hierarchy. 

1.  **Level 0 (Base):** The global background (`#f8fafc`).
2.  **Level 1 (Surfaces):** White cards with a subtle 1px border in `border-subtle` and a very soft `shadow-sm`.
3.  **Level 2 (Interaction):** Upon hover, cards should translate -4px vertically and increase shadow density to `shadow-lg`.
4.  **Level 3 (Primary CTAs):** Primary buttons utilize a "Primary Glow"—a shadow tinted with the brand color (`shadow-primary-500/30`)—to make them feel luminous and significantly more clickable than secondary actions.
5.  **Level 4 (Floating):** Quick-action buttons (like "Add to Wishlist" over images) use a standard medium shadow with a high blur radius to appear physically detached from the image content.

## Shapes

The shape language is rounded and approachable. The system leans toward large radii for containers to emphasize the "friendly marketplace" aesthetic.

- **Containers:** Product cards and large sections use `rounded-2xl` (16px).
- **Interactive Elements:** Buttons and input fields use `rounded-xl` (12px) to feel substantial and easy to tap.
- **Small Components:** Badges and thumbnails use `rounded-lg` (8px).
- **Utility:** Status indicators (tags, sale counts) and circular action buttons (wishlist) are always `rounded-full` (Pill/Circle).

## Components

### Buttons
- **Primary:** Features the brand gradient (#f97316 to #ea580c), white text, and a primary glow shadow. 14px vertical padding.
- **Secondary:** White background with a 1px `border-subtle`. No shadow unless hovered.
- **Micro-interactions:** Buttons should scale to 1.02 on hover to provide tactile feedback.

### Cards
- **Product Card:** Pure white background, `rounded-2xl`, subtle border. Image should have a slight `hover:scale-105` transition. Content inside uses 12px padding (`p-3`).
- **Info Card:** Used for descriptions or specifications. Uses 20px padding (`p-5`) to increase readability.

### Input Fields
- **Text Inputs:** `rounded-xl`, 1px border, and a primary-50 background on focus. Labels are positioned above the input using the `label-md` typography.

### Chips & Badges
- **Sale Badges:** Use the `flash-sale` red with white text, positioned in the top-left of product images.
- **Stock Status:** Green-600 text with a light green tinted background for "In Stock" indicators.

### Iconography
- Use **Lucide React** icons with a consistent stroke weight. Standard size is 18px for buttons and 24px for section headers. Primary icons should use the brand orange to draw the eye.