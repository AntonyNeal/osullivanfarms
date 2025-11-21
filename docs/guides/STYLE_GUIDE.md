# Service Booking Platform - Style Guide & Design System

## Overview

This document serves as the authoritative reference for all styling choices, design patterns, and visual elements used throughout the service booking platform. The design system prioritizes professionalism, user experience, and accessibility.

## Core Design Philosophy

- **Professionalism**: Clean, sophisticated design that conveys trust and quality
- **User Experience**: Intuitive navigation and clear visual hierarchy
- **Accessibility**: WCAG 2.1 AA compliant design for all users
- **Responsiveness**: Mobile-first approach with seamless cross-device experience

---

## Color Palette

### Primary Colors

```css
/* Brand Primary */
--color-primary: #2563eb;        /* Blue 600 */
--color-primary-dark: #1d4ed8;   /* Blue 700 */
--color-primary-light: #3b82f6;  /* Blue 500 */

/* Secondary */
--color-secondary: #6366f1;      /* Indigo 500 */
--color-secondary-dark: #4f46e5; /* Indigo 600 */
--color-secondary-light: #8b5cf6; /* Violet 500 */
```

### Neutral Colors

```css
/* Grays */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
```

### Status Colors

```css
/* Success */
--color-success: #10b981;
--color-success-light: #34d399;
--color-success-dark: #059669;

/* Warning */
--color-warning: #f59e0b;
--color-warning-light: #fbbf24;
--color-warning-dark: #d97706;

/* Error */
--color-error: #ef4444;
--color-error-light: #f87171;
--color-error-dark: #dc2626;

/* Info */
--color-info: #06b6d4;
--color-info-light: #22d3ee;
--color-info-dark: #0891b2;
```

---

## Typography

### Font Families

```css
/* Primary Font - UI Text */
--font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Secondary Font - Headings */
--font-secondary: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Monospace - Code */
--font-mono: "Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace;
```

### Font Sizes & Line Heights

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

---

## Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## Border Radius

```css
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Full rounded */
```

---

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## Component Guidelines

### Buttons

```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
```

### Form Elements

```css
/* Input Fields */
.form-input {
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### Cards

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  border: 1px solid var(--color-gray-200);
}
```

---

## Animation Guidelines

### Transitions

- Use `transition: all 0.2s ease` for hover effects
- Use `transition: transform 0.3s ease` for scale transforms
- Use `transition: opacity 0.25s ease` for fade effects

### Keyframes

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide In */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

---

## Implementation Notes

1. **Consistency**: Always use design tokens (CSS custom properties) instead of hardcoded values
2. **Accessibility**: Ensure sufficient color contrast (minimum 4.5:1 for normal text)
3. **Performance**: Optimize images and use appropriate formats (WebP, AVIF)
4. **Testing**: Test on multiple devices and screen sizes
5. **Documentation**: Update this guide when making design system changes

---

## Usage Examples

### React Component Styling

```tsx
// Use design tokens in React components
const Button = ({ variant = "primary", children, ...props }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      style={{
        backgroundColor: "var(--color-primary)",
        padding: "var(--space-3) var(--space-6)",
        borderRadius: "var(--radius-md)"
      }}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Tailwind CSS Integration

When using Tailwind CSS, extend the theme with design tokens:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
      fontFamily: {
        primary: "var(--font-primary)",
        secondary: "var(--font-secondary)",
      },
    },
  },
};
```
