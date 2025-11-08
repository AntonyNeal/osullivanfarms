/**
 * Theme Generator Module
 * Generates complete theme configurations from natural language prompts
 */

export interface ThemePrompt {
  industry: string;        // "MTG tournaments", "fitness", "consulting"
  vibe: string;           // "epic warrior", "modern clean", "professional"
  primaryColor: string;   // "orange", "blue", "green", "purple"
  visualStyle: string;    // "maximalist", "minimalist", "modern", "corporate"
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      from: string;
      via: string;
      to: string;
    };
    text: {
      primary: string;
      secondary: string;
      heading: string;
    };
    border: string;
    gradients: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingStyle: 'uppercase' | 'capitalize' | 'normal';
    headingWeight: 'bold' | 'extrabold' | 'black';
    letterSpacing: 'tight' | 'normal' | 'wide' | 'wider';
    decorativeElements: string[];
  };
  animations: {
    transitions: string[];
    effects: string[];
    particleSystem?: {
      type: string;
      count: number;
      animations: string[];
    };
  };
  components: {
    buttons: {
      primary: string;
      secondary: string;
      effects: string[];
    };
    cards: {
      background: string;
      border: string;
      hover: string;
    };
    modals: {
      background: string;
      overlay: string;
      border: string;
    };
  };
  terminology: {
    book: string;
    service: string;
    client: string;
    booking: string;
    schedule: string;
  };
}

// Color scheme presets
const COLOR_SCHEMES = {
  orange: {
    primary: '#ea580c',      // orange-600
    secondary: '#f97316',    // orange-500
    accent: '#fb923c',       // orange-400
    dark: '#9a3412',         // orange-800
    darker: '#7c2d12',       // orange-900
  },
  blue: {
    primary: '#2563eb',      // blue-600
    secondary: '#3b82f6',    // blue-500
    accent: '#60a5fa',       // blue-400
    dark: '#1e40af',         // blue-800
    darker: '#1e3a8a',       // blue-900
  },
  purple: {
    primary: '#9333ea',      // purple-600
    secondary: '#a855f7',    // purple-500
    accent: '#c084fc',       // purple-400
    dark: '#6b21a8',         // purple-800
    darker: '#581c87',       // purple-900
  },
  green: {
    primary: '#16a34a',      // green-600
    secondary: '#22c55e',    // green-500
    accent: '#4ade80',       // green-400
    dark: '#166534',         // green-800
    darker: '#14532d',       // green-900
  },
  red: {
    primary: '#dc2626',      // red-600
    secondary: '#ef4444',    // red-500
    accent: '#f87171',       // red-400
    dark: '#991b1b',         // red-800
    darker: '#7f1d1d',       // red-900
  },
  teal: {
    primary: '#0d9488',      // teal-600
    secondary: '#14b8a6',    // teal-500
    accent: '#2dd4bf',       // teal-400
    dark: '#115e59',         // teal-800
    darker: '#134e4a',       // teal-900
  },
};

// Industry-specific presets
const INDUSTRY_PRESETS = {
  'mtg-tournaments': {
    terminology: {
      book: 'register',
      service: 'format',
      client: 'warrior',
      booking: 'registration',
      schedule: 'battle schedule',
    },
    suggestedColors: ['orange', 'red'],
    suggestedStyle: 'maximalist',
    decorativeElements: ['crossed swords', 'shields', 'mana symbols', 'ornamental dividers'],
  },
  'fitness': {
    terminology: {
      book: 'schedule',
      service: 'class',
      client: 'member',
      booking: 'reservation',
      schedule: 'class schedule',
    },
    suggestedColors: ['blue', 'green', 'teal'],
    suggestedStyle: 'modern',
    decorativeElements: ['energy waves', 'pulse lines', 'strength icons'],
  },
  'consulting': {
    terminology: {
      book: 'schedule',
      service: 'consultation',
      client: 'client',
      booking: 'appointment',
      schedule: 'calendar',
    },
    suggestedColors: ['blue', 'purple'],
    suggestedStyle: 'corporate',
    decorativeElements: ['clean lines', 'subtle gradients', 'professional icons'],
  },
  'wellness': {
    terminology: {
      book: 'book',
      service: 'session',
      client: 'client',
      booking: 'appointment',
      schedule: 'schedule',
    },
    suggestedColors: ['green', 'teal', 'purple'],
    suggestedStyle: 'minimalist',
    decorativeElements: ['nature elements', 'soft curves', 'calming patterns'],
  },
  'education': {
    terminology: {
      book: 'enroll',
      service: 'course',
      client: 'student',
      booking: 'enrollment',
      schedule: 'course schedule',
    },
    suggestedColors: ['blue', 'purple', 'teal'],
    suggestedStyle: 'modern',
    decorativeElements: ['books', 'graduation caps', 'learning icons'],
  },
};

// Visual style configurations
const VISUAL_STYLES = {
  maximalist: {
    animations: ['particles', 'glow-effects', 'float', 'shimmer', 'pulse-glow'],
    effects: ['multi-layer-backgrounds', 'text-stroke', 'drop-shadow-xl', 'backdrop-blur'],
    particleCount: 12,
    headingSize: 'text-8xl lg:text-9xl',
    spacing: 'loose',
  },
  minimalist: {
    animations: ['fade', 'slide'],
    effects: ['subtle-shadow', 'clean-borders'],
    particleCount: 0,
    headingSize: 'text-4xl lg:text-5xl',
    spacing: 'tight',
  },
  modern: {
    animations: ['fade', 'slide', 'scale'],
    effects: ['gradient-backgrounds', 'shadow-lg', 'backdrop-blur-sm'],
    particleCount: 4,
    headingSize: 'text-5xl lg:text-6xl',
    spacing: 'normal',
  },
  corporate: {
    animations: ['fade'],
    effects: ['subtle-shadow', 'professional-borders'],
    particleCount: 0,
    headingSize: 'text-4xl lg:text-5xl',
    spacing: 'normal',
  },
};

/**
 * Generate a complete theme configuration from a prompt
 */
export function generateTheme(prompt: ThemePrompt): ThemeConfig {
  // Normalize inputs
  const industry = prompt.industry.toLowerCase();
  const colorName = prompt.primaryColor.toLowerCase();
  const style = prompt.visualStyle.toLowerCase();

  // Get color scheme
  const colors = COLOR_SCHEMES[colorName as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.blue;
  
  // Get industry preset
  const industryKey = Object.keys(INDUSTRY_PRESETS).find(key => 
    industry.includes(key.replace(/-/g, ' '))
  );
  const industryPreset = industryKey 
    ? INDUSTRY_PRESETS[industryKey as keyof typeof INDUSTRY_PRESETS]
    : INDUSTRY_PRESETS.consulting;

  // Get visual style
  const visualStyle = VISUAL_STYLES[style as keyof typeof VISUAL_STYLES] || VISUAL_STYLES.modern;

  // Build theme config
  const theme: ThemeConfig = {
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: {
        from: '#111827',  // gray-900
        via: colors.darker,
        to: '#111827',
      },
      text: {
        primary: '#ffffff',
        secondary: '#d1d5db',  // gray-300
        heading: '#ffffff',
      },
      border: colors.dark,
      gradients: [
        `from-${colorName}-600 to-${colorName}-800`,
        `from-gray-900 via-${colorName}-950 to-gray-900`,
        `from-${colorName}-500 via-${colorName}-600 to-${colorName}-700`,
      ],
    },
    typography: {
      headingFont: style === 'maximalist' ? 'Cinzel' : 'Inter',
      bodyFont: 'Inter',
      headingStyle: style === 'maximalist' ? 'uppercase' : 'capitalize',
      headingWeight: style === 'maximalist' ? 'black' : 'bold',
      letterSpacing: style === 'maximalist' ? 'wider' : 'normal',
      decorativeElements: industryPreset.decorativeElements,
    },
    animations: {
      transitions: ['transition-all', 'duration-300', 'ease-in-out'],
      effects: visualStyle.animations,
      particleSystem: visualStyle.particleCount > 0 ? {
        type: 'floating-particles',
        count: visualStyle.particleCount,
        animations: ['float', 'drift', 'glow'],
      } : undefined,
    },
    components: {
      buttons: {
        primary: `bg-gradient-to-r ${`from-${colorName}-600 to-${colorName}-700`} hover:${`from-${colorName}-500 to-${colorName}-600`} text-white font-semibold`,
        secondary: `bg-gray-800 hover:bg-gray-700 text-${colorName}-400 border border-${colorName}-600`,
        effects: style === 'maximalist' ? ['shimmer', 'glow-on-hover'] : ['subtle-shadow'],
      },
      cards: {
        background: `bg-gradient-to-br from-gray-900 to-${colorName}-950/30`,
        border: `border border-${colorName}-800/50`,
        hover: `hover:border-${colorName}-600 hover:shadow-lg hover:shadow-${colorName}-900/50`,
      },
      modals: {
        background: `bg-gradient-to-br from-gray-900 via-${colorName}-950 to-gray-900`,
        overlay: 'bg-black/80 backdrop-blur-sm',
        border: `border-2 border-${colorName}-600`,
      },
    },
    terminology: industryPreset.terminology,
  };

  return theme;
}

/**
 * Generate Tailwind config extensions from theme
 */
export function generateTailwindConfig(theme: ThemeConfig): string {
  return `
// Auto-generated theme configuration
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${theme.colors.primary}',
        secondary: '${theme.colors.secondary}',
        accent: '${theme.colors.accent}',
      },
      fontFamily: {
        heading: ['${theme.typography.headingFont}', 'sans-serif'],
        body: ['${theme.typography.bodyFont}', 'sans-serif'],
      },
      animation: {
        ${theme.animations.particleSystem ? `
        'float': 'float 20s ease-in-out infinite',
        'drift': 'drift 15s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        ` : ''}
      },
      keyframes: {
        ${theme.animations.particleSystem ? `
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(30px)' },
        },
        glow: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        ` : ''}
      },
    },
  },
};
  `.trim();
}

/**
 * Generate example component with theme applied
 */
export function generateThemedButton(theme: ThemeConfig): string {
  return `
<button
  className="\${theme.components.buttons.primary} px-8 py-4 rounded-lg transform hover:scale-105 transition-all duration-300"
>
  ${theme.terminology.book} Now
</button>
  `.trim();
}

/**
 * Get industry suggestions based on keywords
 */
export function suggestIndustry(keywords: string[]): string[] {
  const suggestions: string[] = [];
  const searchText = keywords.join(' ').toLowerCase();

  for (const [industry, preset] of Object.entries(INDUSTRY_PRESETS)) {
    if (searchText.includes(industry.replace(/-/g, ' '))) {
      suggestions.push(industry);
    }
  }

  return suggestions.length > 0 ? suggestions : ['consulting'];
}

/**
 * Parse natural language prompt into structured ThemePrompt
 */
export function parseThemePrompt(prompt: string): ThemePrompt {
  const lower = prompt.toLowerCase();
  
  // Detect industry
  let industry = 'consulting';
  for (const industryKey of Object.keys(INDUSTRY_PRESETS)) {
    if (lower.includes(industryKey.replace(/-/g, ' '))) {
      industry = industryKey;
      break;
    }
  }

  // Detect color
  let primaryColor = 'blue';
  for (const color of Object.keys(COLOR_SCHEMES)) {
    if (lower.includes(color)) {
      primaryColor = color;
      break;
    }
  }

  // Detect style
  let visualStyle = 'modern';
  if (lower.includes('maximalist') || lower.includes('epic') || lower.includes('dramatic')) {
    visualStyle = 'maximalist';
  } else if (lower.includes('minimalist') || lower.includes('clean') || lower.includes('simple')) {
    visualStyle = 'minimalist';
  } else if (lower.includes('corporate') || lower.includes('professional')) {
    visualStyle = 'corporate';
  }

  // Detect vibe
  let vibe = 'professional';
  if (lower.includes('warrior') || lower.includes('epic') || lower.includes('battle')) {
    vibe = 'epic warrior';
  } else if (lower.includes('modern') || lower.includes('sleek')) {
    vibe = 'modern sleek';
  } else if (lower.includes('calm') || lower.includes('peaceful')) {
    vibe = 'calm peaceful';
  }

  return {
    industry,
    vibe,
    primaryColor,
    visualStyle,
  };
}
