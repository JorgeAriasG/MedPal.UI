# Design System Quick Reference

## 🎨 Color Palette

```
PRIMARY        #1976D2  ████████████████  Blue
PRIMARY DARK   #1565C0  ████████████████  Dark Blue
PRIMARY LIGHT  #42A5F5  ████████████████  Light Blue

SUCCESS        #4CAF50  ████████████████  Green (Completed)
WARNING        #FF9800  ████████████████  Orange (Pending)
DANGER         #F44336  ████████████████  Red (Error)
INFO           #2196F3  ████████████████  Light Blue

ALLERGY        #FF5252  ████████████████  Red (Critical)
PRESCRIPTION   #7B1FA2  ████████████████  Purple
CONSULTATION   #0097A7  ████████████████  Cyan
CLINIC         #558B2F  ████████████████  Green

BG PAGE        #F5F7FA  ████████████████  Light Gray
BG SURFACE     #FFFFFF  ████████████████  White
BORDER         #E0E0E0  ████████████████  Gray
DIVIDER        #EEEEEE  ████████████████  Very Light Gray

TEXT PRIMARY   #212121  ████████████████  Dark (Main text)
TEXT SECONDARY #757575  ████████████████  Gray (Labels)
TEXT DISABLED  #BDBDBD  ████████████████  Light Gray (Disabled)
```

## 📐 Spacing Scale (Base: 4px)

```
xs   =  4px  (1 unit)
sm   =  8px  (2 units)
md   = 16px  (4 units)  ← Use for normal padding/margin
lg   = 24px  (6 units)  ← Use for section spacing
xl   = 32px  (8 units)  ← Use for large gaps
2xl  = 48px  (12 units)
3xl  = 64px  (16 units)
```

**Usage Rules:**
- **Card padding**: `md` (16px)
- **Between cards**: `lg` (24px)
- **Between sections**: `xl` (32px)
- **Header margin**: `2xl` (48px)

## 🔤 Typography

### Font Sizes
```
Display   2.5rem (40px)  - Page titles
Headline  2rem   (32px)  - Section titles
Title     1.5rem (24px)  - Card headers
Subtitle  1.25rem (20px) - Subsections
Body L    1rem   (16px)  - Main text
Body      0.95rem (15px) - Default
Small     0.875rem (14px) - Labels
Caption   0.75rem (12px)  - Hints
```

### Font Weights
```
Regular  400  - Body text
Medium   500  - Labels, emphasis
Bold     700  - Headers
```

### Line Heights
```
Tight     1.2  - Headlines
Normal    1.5  - Body text
Relaxed   1.75 - Long content
```

## 🎯 Component Sizes

### Buttons
```
Small:   32px height
Normal:  40px height  ← Most common
Large:   48px height
```

### Touch Targets
```
Minimum: 44x44px (mobile)
         32x32px (desktop)
```

### Cards
```
Border radius: 8px
Padding:       16px (md)
Margin below:  24px (lg)
Shadow:        0 2px 8px rgba(0,0,0,0.1)
Hover shadow:  0 4px 16px rgba(0,0,0,0.12)
```

## 🎭 States

### Button States
```
Default   → Normal styling
Hover     → Shadow increases, slight scale
Active    → Color darkens
Disabled  → 50% opacity, cursor not-allowed
Loading   → Spinner inside button
```

### Form Input States
```
Default   → Border color #E0E0E0
Focus     → Border color #1976D2, shadow
Valid     → Green border #4CAF50
Invalid   → Red border #F44336 + error message
Disabled  → 50% opacity
```

### Data States
```
Active     → Color: SUCCESS (#4CAF50)
Pending    → Color: WARNING (#FF9800)
Expired    → Color: DANGER (#F44336)
Draft      → Color: TEXT SECONDARY (#757575)
```

## 📏 Responsive Breakpoints

```
Mobile        <  576px   (Phone)
Tablet       576px+     (Tablet)
Desktop      992px+     (Desktop)
Wide         1400px+    (Large displays)
```

**Grid Columns:**
```
Mobile:   4 columns
Tablet:   8 columns
Desktop: 12 columns
```

## 🎪 Shadows

```
Small:  0 2px 4px rgba(0,0,0,0.08)
Medium: 0 2px 8px rgba(0,0,0,0.1)    ← Cards
Large:  0 4px 16px rgba(0,0,0,0.12)  ← Hover
XL:     0 8px 24px rgba(0,0,0,0.15)  ← Modals
```

## ⏱️ Transitions

```
Fast:   150ms ease-in-out
Normal: 250ms ease-in-out  ← Most common
Slow:   350ms ease-in-out
```

## 🔄 Border Radius

```
Extra Small: 2px   - Minimal rounding
Small:       4px   - Input fields
Medium:      8px   - Cards, buttons  ← Most common
Large:       12px  - Large elements
Full:        50%   - Circles
```

## 📝 CSS Variables Reference

```css
/* Copy-paste ready */

/* Colors */
--color-primary: #1976D2;
--color-success: #4CAF50;
--color-warning: #FF9800;
--color-danger: #F44336;
--color-allergy: #FF5252;
--color-bg-page: #F5F7FA;
--color-bg-surface: #FFFFFF;
--color-text-primary: #212121;
--color-text-secondary: #757575;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Typography */
--font-size-body: 0.95rem;
--font-size-small: 0.875rem;
--font-weight-medium: 500;
--line-height-normal: 1.5;

/* Styling */
--border-radius-md: 8px;
--shadow-md: 0 2px 8px rgba(0,0,0,0.1);
--transition-normal: 250ms ease-in-out;
```

## 🎛️ Utility Classes

### Spacing
```html
<!-- Padding -->
<div class="p-md">16px padding all sides</div>
<div class="px-lg">24px padding left+right</div>
<div class="py-md">16px padding top+bottom</div>
<div class="pt-lg">24px padding top only</div>

<!-- Margin -->
<div class="m-lg">24px margin all sides</div>
<div class="mb-xl">32px margin bottom</div>
<div class="mt-md">16px margin top</div>
<div class="mx-lg">24px margin left+right</div>
```

### Layout
```html
<div class="flex-center">Centered flex</div>
<div class="flex-between">Space-between flex</div>
<div class="d-flex gap-lg">Flex with gap</div>
<div class="container">Max 1200px, centered</div>
```

### Text
```html
<p class="text-primary">Primary color text</p>
<p class="text-muted">Secondary color text</p>
<p class="text-small">Smaller text</p>
<p class="text-caption">Caption text</p>
```

### Styling
```html
<div class="rounded shadow">Card-like styling</div>
<div class="rounded-lg shadow-lg">Large radius + shadow</div>
<div class="w-100">Full width</div>
<div class="h-100">Full height</div>
```

### Grid
```html
<div class="row">
  <div class="col-6">Half width</div>
  <div class="col-6">Half width</div>
</div>

<div class="row">
  <div class="col-4">Third width</div>
  <div class="col-4">Third width</div>
  <div class="col-4">Third width</div>
</div>
```

## 📋 Common Patterns

### Card Header
```html
<div class="card-header">
  <h3 class="card-title">
    <mat-icon>icon_name</mat-icon>
    Title
  </h3>
</div>
```

### Data Row
```html
<div class="info-row">
  <span class="label">Label</span>
  <span class="value">Value</span>
</div>
```

### Alert Banner
```html
<div class="allergy-banner">
  <div class="alert-icon">
    <mat-icon>warning</mat-icon>
  </div>
  <div class="alert-content">
    <h3>Alert Title</h3>
    <p>Alert message</p>
  </div>
</div>
```

### Empty State
```html
<div class="empty-state">
  <div class="empty-icon">
    <mat-icon>inbox</mat-icon>
  </div>
  <h3>No Data</h3>
  <p>Description</p>
  <button mat-raised-button color="primary">Action</button>
</div>
```

### Loading State
```html
<div *ngIf="isLoading" class="loading-overlay">
  <mat-spinner diameter="48"></mat-spinner>
  <p class="mt-md text-muted">Loading...</p>
</div>
```

## 🎓 Implementation Checklist

Before considering a component done:

```
COLORS
  ☐ No hardcoded colors
  ☐ All from --color-* variables
  ☐ Contrast ratio 4.5:1+

SPACING
  ☐ No arbitrary pixels
  ☐ All from --spacing-* variables
  ☐ Follows 4px grid

TYPOGRAPHY
  ☐ Uses --font-size-* variables
  ☐ Uses --font-weight-* variables
  ☐ Uses --line-height-* variables
  ☐ Size hierarchy clear

RESPONSIVE
  ☐ Tested at 375px (mobile)
  ☐ Tested at 768px (tablet)
  ☐ Tested at 1920px (desktop)
  ☐ No horizontal scroll

ACCESSIBILITY
  ☐ Semantic HTML
  ☐ ARIA labels where needed
  ☐ Keyboard navigation works
  ☐ Focus visible
  ☐ Touch targets 44x44px+

STATES
  ☐ Loading state visible
  ☐ Error state clear
  ☐ Empty state helpful
  ☐ Hover effects smooth

PERFORMANCE
  ☐ No console errors
  ☐ Smooth animations (60fps)
  ☐ No memory leaks
```

## 🔗 Quick Links

**Full Documentation:**
- 🎨 Design System: `DESIGN_SYSTEM.md`
- 📚 Components: `COMPONENT_LIBRARY.md`
- 🛠️ Implementation: `IMPLEMENTATION_STANDARDS.md`
- 📦 Summary: `DESIGN_SYSTEM_SUMMARY.md`

**CSS Files:**
- 🌍 Global Styles: `src/styles.css`
- 🎯 Component Example: `patient-detail.component.css`

**Component Reference:**
- 👤 Patient Detail: `patient-detail.component.html`

---

**Last Updated**: January 2026
**Version**: 1.0
**Status**: ✅ Production Ready
