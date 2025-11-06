# Claire Hamilton Website - Style Guide & Design System

## Overview

This document serves as the authoritative reference for all styling choices, design patterns, and visual elements used throughout the Claire Hamilton website. As a premium brand focused on professionalism and seduction, every design decision prioritizes elegance, sophistication, and user experience.

## Core Brand Philosophy

- **Professionalism**: Clean, sophisticated design that conveys trust and quality
- **Seduction**: Subtle sensuality through color, typography, and micro-interactions
- **Premium Experience**: Attention to detail, smooth animations, and luxurious feel
- **Conversion Optimization**: Strategic use of visual hierarchy and call-to-action elements

---

## Color Palette

### Primary Colors

```css
/* Rose/Pink Family - Core Brand Colors */
--rose-50: #fdf2f8; /* Very light rose - backgrounds */
--rose-100: #fce7f3; /* Light rose - subtle borders */
--rose-200: #fbcfe8; /* Medium light rose - card borders */
--rose-300: #f9a8d4; /* Medium rose - accents, gradients */
--rose-400: #f472b6; /* Primary rose - buttons, links */
--rose-500: #ec4899; /* Dark rose - hover states */
--rose-600: #db2777; /* Active navigation, headings */
--rose-700: #be185d; /* Dark accents */
--rose-800: #9d174d; /* Seductive button gradients */
--rose-900: #831843; /* Deep rose overlays */
```

### Secondary Colors

```css
/* Pink Family - Supporting Elements */
--pink-50: #fdf2f8; /* Light backgrounds */
--pink-100: #fce7f3; /* Subtle backgrounds */
--pink-200: #fbcfe8; /* Card backgrounds */
--pink-300: #f9a8d4; /* Gradient elements */
--pink-400: #f472b6; /* Secondary buttons */
--pink-500: #ec4899; /* Hover states */
--pink-600: #db2777; /* CTA buttons */
```

### Neutral Colors

```css
/* Gray Scale - Text and Structure */
--gray-50: #f9fafb; /* Very light backgrounds */
--gray-100: #f3f4f6; /* Light backgrounds */
--gray-200: #e5e7eb; /* Borders, dividers */
--gray-300: #d1d5db; /* Input borders */
--gray-400: #9ca3af; /* Placeholder text */
--gray-500: #6b7280; /* Secondary text */
--gray-600: #4b5563; /* Body text */
--gray-700: #374151; /* Headings */
--gray-800: #1f2937; /* Dark headings */
--gray-900: #111827; /* Primary headings, logo */
```

### Functional Colors

```css
/* Status and Feedback */
--blue-50: #eff6ff; /* Info backgrounds */
--blue-100: #dbeafe; /* Light info */
--blue-200: #bfdbfe; /* Info borders */
--blue-400: #60a5fa; /* Info accents */
--blue-500: #3b82f6; /* Info text */

--green-500: #10b981; /* Success states */
--red-500: #ef4444; /* Error states */
--yellow-50: #fffbeb; /* Warning backgrounds */
--yellow-200: #fde68a; /* Warning borders */
--yellow-800: #92400e; /* Warning text */
```

---

## Typography System

### Font Families

#### Primary Display Font: Playfair Display

```css
font-family: 'Playfair Display', serif;
font-weight: 300, 400, 500, 600, 700;
```

- **Usage**: Headlines, hero titles, major headings
- **Characteristics**: Elegant serif with strong personality
- **Sizes**: 3xl to 9xl (48px to 144px+)
- **Weights**: Light (300) for elegance, Medium-Bold (500-700) for impact

#### Secondary Body Font: Crimson Text

```css
font-family: 'Crimson Text', serif;
font-style: normal, italic;
font-weight: 400, 600;
```

- **Usage**: Subtitles, taglines, elegant body text
- **Characteristics**: Classic serif with excellent readability
- **Sizes**: xl to 4xl (20px to 48px)
- **Styles**: Regular and italic for emphasis

#### System Font: UI Sans Serif

```css
font-family: ui-sans-serif, system-ui, sans-serif;
```

- **Usage**: Body text, form elements, UI components
- **Characteristics**: Clean, highly legible system font
- **Weights**: Light (300), Normal (400), Medium (500)

### Typography Scale

```css
/* Display Sizes */
--text-9xl: 8rem; /* 128px - Hero titles */
--text-8xl: 6rem; /* 96px - Major headings */
--text-7xl: 4.5rem; /* 72px - Section headings */
--text-6xl: 3.75rem; /* 60px - Large headings */
--text-5xl: 3rem; /* 48px - Hero subtitles */
--text-4xl: 2.25rem; /* 36px - Subtitles */
--text-3xl: 1.875rem; /* 30px - Card titles */
--text-2xl: 1.5rem; /* 24px - Large body */
--text-xl: 1.25rem; /* 20px - Body text */

/* Body Sizes */
--text-lg: 1.125rem; /* 18px - Large body */
--text-base: 1rem; /* 16px - Standard body */
--text-sm: 0.875rem; /* 14px - Small text */
--text-xs: 0.75rem; /* 12px - Micro text */
```

### Font Weight Hierarchy

- **Light (300)**: Hero titles, elegant headings
- **Normal (400)**: Body text, form labels
- **Medium (500)**: Subheadings, button text
- **Semibold (600)**: Important headings, CTAs
- **Bold (700)**: Primary buttons, strong emphasis

---

## Layout & Spacing System

### Container System

```css
/* Responsive Containers */
.container {
  width: 100%;
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (min-width: 1280px) {
  .container {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
```

### Spacing Scale

```css
/* Margin/Padding Scale */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

### Section Spacing Patterns

- **Hero Sections**: `py-20 sm:py-24 md:py-32` (80px-128px vertical padding)
- **Content Sections**: `py-16 sm:py-20 md:py-24` (64px-96px vertical padding)
- **CTA Sections**: `py-20 sm:py-24` (80px-96px vertical padding)
- **Footer**: `py-12` (48px vertical padding)

---

## Component Patterns

### Navigation Header

```tsx
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-rose-100">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
    {/* Navigation content */}
  </div>
</header>
```

- **Background**: Semi-transparent white with blur effect
- **Border**: Subtle rose bottom border
- **Position**: Sticky with high z-index
- **Logo**: Light weight, rose hover effect
- **Links**: Conditional rose color for active page

### Hero Carousel

```tsx
<section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
  {/* Carousel with slide transitions */}
  <div className="absolute inset-0 w-full h-full overflow-hidden">
    {images.map((image, index) => (
      <img
        key={index}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out ${transformClass}`}
        style={{ zIndex }}
      />
    ))}
  </div>
</section>
```

- **Transitions**: 1-second transform transitions
- **Positioning**: Absolute positioning with z-index layering
- **Indicators**: Clickable dots with scale hover effects

### Content Cards

```tsx
<div className="group relative bg-white border-2 border-rose-200 p-8 sm:p-10 rounded-sm hover:shadow-2xl transition-all duration-500 hover:border-rose-400">
  {/* Card content with hover effects */}
</div>
```

- **Borders**: Rose color with hover state changes
- **Shadows**: Progressive shadow increase on hover
- **Transitions**: 500ms duration for smooth effects

### Primary Buttons

```tsx
<button className="group relative px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-red-800/60 to-red-900/70 text-white rounded-lg text-lg sm:text-xl font-bold tracking-wide hover:shadow-2xl hover:from-red-800/80 hover:to-red-900/90 transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 backdrop-blur-sm border border-red-700/50">
  {/* Button content with arrow animation */}
</button>
```

- **Gradients**: Dark red with transparency and texture
- **Effects**: Scale transform, shadow increase, arrow slide
- **Focus**: Ring styling for accessibility

### Secondary Buttons

```tsx
<button className="group px-10 sm:px-12 py-4 sm:py-5 border-2 border-rose-300 text-rose-100 rounded-lg text-lg sm:text-xl font-semibold tracking-wide hover:bg-rose-50/20 hover:border-rose-200 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 backdrop-blur-sm">
  {/* Secondary button content */}
</button>
```

- **Styling**: Outline style with rose colors
- **Hover**: Subtle background fill, border color change

---

## Animation & Micro-Interactions

### Keyframe Animations

```css
@keyframes gentle-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.02);
  }
}
```

- **Usage**: Hero title pulsing effect
- **Duration**: 4 seconds, infinite loop
- **Effect**: Subtle scale and opacity changes

### Transition Patterns

- **Hover Effects**: 300-500ms duration with ease-in-out
- **Scale Transforms**: 1.05 scale factor for buttons
- **Color Transitions**: Smooth color changes for links
- **Shadow Transitions**: Progressive shadow increases

### Interactive Elements

- **Buttons**: Scale + shadow + color transitions
- **Links**: Color transitions with smooth timing
- **Cards**: Border color + shadow transitions
- **Form Elements**: Ring focus states

---

## Responsive Design Patterns

### Breakpoint System

```css
/* Mobile First Approach */
--sm: 640px; /* Small tablets */
--md: 768px; /* Tablets */
--lg: 1024px; /* Laptops */
--xl: 1280px; /* Desktops */
```

### Responsive Typography

- **Mobile**: Base sizes with minimal scaling
- **Tablet**: Moderate size increases
- **Desktop**: Full size expressions
- **Large Desktop**: Maximum impact sizes

### Responsive Spacing

- **Padding**: Progressive increases across breakpoints
- **Margins**: Consistent with padding scale
- **Gaps**: Grid and flex gap adjustments

---

## Form & Input Styling

### Input Fields

```tsx
<input className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
```

- **Borders**: Gray default, rose focus ring
- **Padding**: Consistent 4px horizontal, 8px vertical
- **Focus**: Ring styling for accessibility

### Select Elements

```tsx
<select className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
```

- **Styling**: Consistent with input fields
- **Appearance**: Native select styling maintained

### Textarea Elements

```tsx
<textarea className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
```

- **Resize**: Disabled for consistent layout
- **Rows**: Explicit row count for form control

---

## Modal & Overlay Patterns

### Modal Container

```tsx
<div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40" />
<div className="fixed inset-0 overflow-y-auto z-50">
  <div className="flex items-start justify-center min-h-screen pt-6 px-4">
    <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full">
      {/* Modal content */}
    </div>
  </div>
</div>
```

- **Backdrop**: Semi-transparent dark overlay
- **Positioning**: Fixed positioning with high z-index
- **Content**: Centered with responsive padding

### Progress Indicators

```tsx
<div className="h-1 bg-gray-200 rounded-full">
  <div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-300" />
</div>
```

- **Background**: Light gray track
- **Fill**: Rose to pink gradient
- **Animation**: Smooth width transitions

---

## Shadow & Depth System

### Shadow Scale

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Usage Guidelines

- **Subtle**: Small elements, cards at rest
- **Medium**: Hover states, important cards
- **Large**: Modals, dropdowns
- **Extra Large**: Hero elements, CTAs

---

## Accessibility Considerations

### Focus States

- **Ring Colors**: Rose/pink focus rings on interactive elements
- **Ring Width**: 2px focus rings (focus:ring-2)
- **Offset**: 2px offset for better visibility (focus:ring-offset-2)

### Color Contrast

- **Text on Light**: Gray-900 on white backgrounds
- **Text on Dark**: White/light colors on dark backgrounds
- **Links**: Rose-600 for active states, rose-400 for hover

### Semantic HTML

- **Headings**: Proper h1-h6 hierarchy
- **Labels**: Associated form labels
- **ARIA**: Screen reader support where needed

---

## Implementation Guidelines

### CSS Architecture

- **Tailwind First**: Use utility classes for rapid development
- **Component Classes**: Custom component styles in @layer components
- **Custom Properties**: CSS variables for theme values
- **Responsive Design**: Mobile-first approach

### Performance Considerations

- **Font Loading**: Preconnect to Google Fonts
- **Image Optimization**: Proper alt text and loading strategies
- **Animation Performance**: Use transform and opacity for smooth animations
- **Bundle Size**: Minimize custom CSS, leverage Tailwind utilities

### Maintenance

- **Consistent Naming**: Follow established class naming patterns
- **Documentation**: Update this guide when adding new patterns
- **Testing**: Cross-browser and responsive testing for all components
- **Version Control**: Commit style changes with descriptive messages

---

## Future Enhancements

### Potential Additions

- **Dark Mode**: Rose-themed dark color scheme
- **Animation Library**: Framer Motion for complex animations
- **Design Tokens**: More systematic design token implementation
- **Component Library**: Shared component documentation

### Optimization Opportunities

- **CSS Custom Properties**: More extensive use of CSS variables
- **Utility Classes**: Additional custom utility classes
- **Animation Presets**: Standardized animation durations and easing
- **Responsive Images**: Better image optimization strategies

---

_This style guide should be updated whenever new design patterns are introduced or existing patterns are modified. All team members should reference this document to maintain design consistency across the Claire Hamilton website._
