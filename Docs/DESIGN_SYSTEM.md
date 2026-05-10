# Design System & UI/UX Guidelines

## 1. Design Principles

### 1.1 Core Values
- **Clarity**: Information hierarchy is clear and intuitive
- **Consistency**: All components follow unified patterns
- **Efficiency**: Minimize cognitive load, maximize user productivity
- **Accessibility**: WCAG 2.1 AA compliance for all users
- **Responsiveness**: Seamless experience across all devices

### 1.2 User Experience Goals
- Medical data should be discoverable and scannable
- Actions should have clear visual affordances
- Forms should guide users through complex workflows
- Error states should be helpful, not punitive

---

## 2. Color Palette

### 2.1 Primary Colors
- **Primary**: `#1976D2` (Blue) - Primary actions, focus states
- **Primary Dark**: `#1565C0` - Hover states
- **Primary Light**: `#42A5F5` - Secondary contexts

### 2.2 Status Colors
- **Success**: `#4CAF50` (Green) - Completed, verified
- **Warning**: `#FF9800` (Orange) - Caution, pending
- **Danger**: `#F44336` (Red) - Error, critical
- **Info**: `#2196F3` (Light Blue) - Information

### 2.3 Neutral Colors
- **Background**: `#F5F7FA` - Page background
- **Surface**: `#FFFFFF` - Cards, panels
- **Border**: `#E0E0E0` - Dividers, borders
- **Text Primary**: `#212121` - Main text
- **Text Secondary**: `#757575` - Secondary text
- **Text Disabled**: `#BDBDBD` - Disabled states

### 2.4 Medical-Specific Colors
- **Allergy**: `#FF5252` - Allergies (high visibility)
- **Prescription**: `#7B1FA2` - Prescriptions
- **Consultation**: `#0097A7` - Consultations
- **Clinic**: `#558B2F` - Clinic data

---

## 3. Typography

### 3.1 Font Family
- **Primary Font**: Roboto
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### 3.2 Type Scale
```
Display:     2.5rem (40px) - Page titles
Headline:    2rem    (32px) - Section titles
Title:       1.5rem  (24px) - Card titles
Subtitle:    1.25rem (20px) - Subsections
Body Large:  1rem    (16px) - Main body text
Body Normal: 0.95rem (15px) - Default text
Body Small:  0.875rem (14px) - Secondary, labels
Caption:     0.75rem (12px) - Hints, timestamps
```

### 3.3 Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasis, labels
- **Bold**: 700 - Headers, emphasis

### 3.4 Line Heights
- **Tight**: 1.2 - Headlines
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form text

---

## 4. Spacing System

### 4.1 Base Unit: 4px
```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### 4.2 Application Rules
- **Padding within cards**: `md` (16px)
- **Margin between cards**: `lg` (24px)
- **Margin between sections**: `xl` (32px)
- **Button padding**: `md` vertical, `lg` horizontal

---

## 5. Components & Patterns

### 5.1 Cards
- **Purpose**: Container for related information
- **Border Radius**: 8px
- **Box Shadow**: `0 2px 8px rgba(0,0,0,0.1)`
- **Padding**: 16px (md)
- **Spacing between cards**: 24px (lg)
- **Hover**: Light shadow elevation, subtle scale

### 5.2 Buttons
- **Primary Button**: Full color background, white text
- **Secondary Button**: Outlined, 2px border
- **Tertiary Button**: Text only
- **Disabled**: 50% opacity, cursor not-allowed
- **Sizes**: Small (32px), Normal (40px), Large (48px)
- **States**: Default, Hover (+shadow), Active, Disabled, Loading

### 5.3 Forms
- **Label**: 14px medium, above input
- **Input Height**: 40px (normal), 48px (large)
- **Border**: 1px solid, neutral color
- **Border Radius**: 4px
- **Focus**: Blue border (2px), shadow
- **Error**: Red border, error message below
- **Success**: Green checkmark

### 5.4 Tabs
- **Underline**: 3px solid, primary color
- **Font Weight**: 500 (medium)
- **Spacing**: Sufficient padding for touch targets
- **Active**: Primary color, bold underline
- **Inactive**: Secondary text color

### 5.5 Chips/Tags
- **Height**: 32px
- **Padding**: 8px 12px
- **Border Radius**: 16px
- **Font Size**: 14px
- **Types**: Default, Colored (specialty), Removable

### 5.6 Data Tables
- **Header**: Medium font weight, subtle background
- **Row Height**: 48px
- **Alternating Rows**: Optional light background
- **Hover Row**: Subtle background change
- **Striping**: Light background on alternate rows

### 5.7 Status Indicators
- **Size**: 8px dot or icon
- **Colors**: Success (green), Warning (orange), Danger (red)
- **Label**: Always paired with text description
- **Position**: Left of content for scannability

---

## 6. Layout Rules

### 6.1 Page Structure
```
┌─────────────────────────────────┐
│         Header/Title             │ (lg margin bottom)
├─────────────────────────────────┤
│     Action Buttons/Filters       │ (md margin bottom)
├─────────────────────────────────┤
│                                 │
│      Primary Content            │ (lg margin between sections)
│                                 │
├─────────────────────────────────┤
│      Secondary Content          │
└─────────────────────────────────┘
```

### 6.2 Responsive Breakpoints
```
Mobile:  < 576px   (Single column, full width)
Tablet:  576px+    (Two columns, max 90% width)
Desktop: 992px+    (Three columns, max 1200px)
Wide:    1400px+   (Four+ columns)
```

### 6.3 Container Rules
- **Max Width**: 1200px for desktop
- **Horizontal Padding**: 16px (md) on mobile, 24px (lg) on desktop
- **Vertical Padding**: 24px (lg) between sections
- **Gutters**: 16px (md) between columns

### 6.4 Grid System
- **Columns**: 12 for desktop, 8 for tablet, 4 for mobile
- **Gutter**: 16px
- **Common Layouts**:
  - Full: 12 columns
  - Half: 6 columns each
  - Third: 4 columns each
  - Sidebar: 3 (sidebar) + 9 (content)

---

## 7. Medical Data Presentation

### 7.1 Patient Demographics
- **Layout**: Cards, grid format
- **Critical Fields**: Highlighted (name, ID, DOB)
- **Emergency Contact**: Distinct visual styling
- **Last Updated**: Subtle timestamp

### 7.2 Allergies
- **Visual**: Red chips with warning icon
- **Position**: Above content, immediately visible
- **Emphasis**: Cannot be missed
- **Interaction**: Click for details

### 7.3 Medical History Timeline
- **Format**: Vertical timeline or list
- **Chronological**: Newest first, oldest last
- **Grouping**: By date, by specialty, by type
- **Details**: Expandable sections
- **Status**: Visual indicators (open, closed, pending)

### 7.4 Prescriptions
- **Format**: Table or cards
- **Key Info**: Drug, dosage, frequency visible at glance
- **Status**: Color-coded (active, expired, filled)
- **Actions**: Refill, detail, print easily accessible

### 7.5 Consultation Notes
- **Format**: Cards with timestamp
- **Hierarchy**: Doctor name → specialty → note content
- **Emphasis**: Bold key findings
- **Scanning**: Scannable bullet points preferred

---

## 8. Interaction Patterns

### 8.1 Feedback
- **Success**: Toast notification (3-5 sec), checkmark icon
- **Error**: Toast notification, persist until dismissed
- **Loading**: Spinner overlay, disable interaction
- **Confirmation**: Modal dialog for destructive actions

### 8.2 Navigation
- **Breadcrumbs**: For deep hierarchies
- **Tabs**: For peer-level sections
- **Sidebar**: For primary navigation
- **Buttons**: Clear action labels (no "Submit")

### 8.3 Forms
- **Validation**: Real-time feedback on blur
- **Errors**: Specific, actionable messages
- **Hints**: Subtle gray text below field
- **Required**: Red asterisk, clear indication
- **Submit**: Disabled until valid

### 8.4 Modals
- **Size**: 600px (normal), 800px (large), 400px (small)
- **Backdrop**: Semi-transparent, clickable to close
- **Title**: Clear, action-oriented
- **Footer**: Close, Cancel, Action buttons

---

## 9. Accessibility Standards

### 9.1 Color Contrast
- **Normal Text**: 4.5:1 ratio (WCAG AA)
- **Large Text**: 3:1 ratio (WCAG AA)
- **UI Components**: 3:1 ratio (WCAG AA)

### 9.2 Touch Targets
- **Minimum Size**: 44x44px (mobile), 32x32px (desktop)
- **Spacing**: 8px minimum between interactive elements

### 9.3 Focus Management
- **Visible**: 2px outline, primary color
- **Order**: Logical tab order
- **Modals**: Focus trap inside modal

### 9.4 Semantic HTML
- **Headings**: Proper hierarchy (h1 → h2 → h3)
- **Labels**: Associated with form inputs
- **ARIA**: Used for dynamic content, loading states
- **Icons**: Always labeled or bundled with text

---

## 10. Implementation Guide

### 10.1 CSS Custom Properties (Variables)
Use CSS variables for all design tokens:
```css
--color-primary: #1976D2;
--color-success: #4CAF50;
--spacing-md: 16px;
--border-radius-md: 8px;
--font-size-body: 16px;
```

### 10.2 Utility Classes
Create utility classes for common patterns:
```css
.p-md { padding: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.text-secondary { color: var(--text-secondary); }
```

### 10.3 Component Structure
All components should follow:
1. **Template**: Clean, semantic HTML
2. **Styles**: Scoped CSS with variables
3. **Behavior**: Consistent interactions
4. **Accessibility**: Proper ARIA, labels

### 10.4 Testing
- **Visual**: Looks good at all breakpoints
- **Interaction**: All buttons, links respond correctly
- **Accessibility**: Tab through all controls
- **Performance**: Loads within 2 seconds

---

## 11. Medical App Specific Rules

### 11.1 Data Density
- **Patient List**: Medium density (scannable)
- **Patient Detail**: High density (comprehensive)
- **Consultations**: Medium density (readable)

### 11.2 Safety Features
- **Destructive Actions**: Require confirmation
- **Medication**: Clearly visible, highlighted
- **Allergies**: Never hidden, always prominent
- **Patient ID**: Always visible in context

### 11.3 Printability
- **Print Styles**: Black text on white background
- **No Logos**: Only essential data
- **Clear Structure**: Hierarchical, logical
- **Page Breaks**: Between major sections

---

## 12. Scalability Strategy

### 12.1 Component Library
- Reusable components follow design rules
- Props for customization (size, color, state)
- Consistent naming conventions

### 12.2 Theming
- Light theme (default)
- Dark theme (optional future)
- Custom themes for clinics (future)

### 12.3 Future Extensions
- Add new specialties without redesign
- Add new data types with consistent presentation
- Extend colors, spacing as needed
- All changes backward-compatible

---

## 13. Best Practices Checklist

- [ ] All text has sufficient contrast (4.5:1)
- [ ] All interactive elements are 44x44px minimum
- [ ] Spacing follows 4px grid system
- [ ] Colors meaningful, not decorative
- [ ] Forms have clear labels and errors
- [ ] Loading states visible
- [ ] No action without confirmation for critical data
- [ ] Mobile layout tested
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## References

- Material Design 3: https://m3.material.io
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Web.dev Accessibility: https://web.dev/accessible/
