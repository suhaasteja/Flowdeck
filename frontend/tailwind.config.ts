import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // HMI design system
        surface: '#ffffff',
        background: '#f5f5f7',
        border: '#e5e5ea',
        'border-subtle': '#f0f0f3',
        muted: '#888888',
        'muted-fg': '#666666',
        // Status
        'status-green': '#34c759',
        'status-amber': '#ff9f0a',
        'status-red': '#ff3b30',
        // Accent (Flowstate blue)
        accent: '#6b8fea',
        'accent-bg': '#e0e9ff',
        'accent-border': '#c8d1e8',
        // Viewer
        'viewer-bg-from': '#fafbfe',
        'viewer-bg-to': '#eef0f5',
        // BT block
        'bt-block-bg': '#f7f7fa',
        'bt-block-border': '#e8e8ed',
        'bt-block-hover-bg': '#eef0f7',
        'bt-active-bg': '#e0e9ff',
        'bt-active-border': '#6b8fea',
        // UI chrome
        'topbar-active': '#ececf0',
      },
    },
  },
  plugins: [],
} satisfies Config
