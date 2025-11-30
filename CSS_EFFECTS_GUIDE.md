# 🎨 Premium CSS Effects & Animations Guide

## ✨ Efek-Efek Keren yang Tersedia

Dokumentasi lengkap untuk semua CSS effects dan animations yang sudah di-upgrade di Career Explorer Pods.

---

## 🌟 Glassmorphism Effects

### `.glass`
Efek kaca buram dengan backdrop blur medium.
```tsx
<div className="glass">Content with glassmorphic effect</div>
```

### `.glass-sm`
Efek kaca yang lebih subtle.
```tsx
<div className="glass-sm">Subtle glass effect</div>
```

### `.glass-lg`
Efek kaca yang lebih kuat.
```tsx
<div className="glass-lg">Strong glass effect</div>
```

---

## 🌈 Gradient Backgrounds

### `.gradient-brand`
Gradient blue-purple brand color.
```tsx
<div className="gradient-brand text-white">Brand gradient</div>
```

### `.gradient-warm`
Gradient orange-red-pink hangat.
```tsx
<div className="gradient-warm text-white">Warm gradient</div>
```

### `.gradient-cool`
Gradient cyan-blue-indigo dingin.
```tsx
<div className="gradient-cool text-white">Cool gradient</div>
```

### `.gradient-mesh-animated`
Animated mesh gradient pattern.
```tsx
<div className="gradient-mesh-animated">Animated mesh</div>
```

---

## 💫 Neon & Glow Effects

### `.neon-glow`
Neon glow effect dengan hover animation.
```tsx
<button className="neon-glow">Neon Button</button>
```

### `.neon-border`
Border dengan neon glow effect.
```tsx
<div className="neon-border p-4">Neon border</div>
```

### `.neon-text`
Text dengan gradient brand effect.
```tsx
<h1 className="neon-text">Neon Text</h1>
```

### Shadow Utilities
```tsx
<div className="shadow-glow">Medium glow</div>
<div className="shadow-glow-md">Strong glow</div>
<div className="shadow-glow-lg">Very strong glow</div>
<div className="shadow-neon">Neon shadow</div>
```

---

## 🎪 Floating & Hover Effects

### `.float-up`
Float up effect on hover (small).
```tsx
<div className="float-up">Hover me</div>
```

### `.float-intense`
Float up effect on hover (intense).
```tsx
<div className="float-intense">Hover me intensely</div>
```

### `.scale-on-hover`
Scale up 105% on hover.
```tsx
<button className="scale-on-hover">Scale button</button>
```

### `.scale-sm-on-hover`
Scale up 102% on hover (subtle).
```tsx
<div className="scale-sm-on-hover">Subtle scale</div>
```

---

## 🎬 Animations

### `.animate-glow-pulse`
Glow pulse animation (2s infinite).
```tsx
<div className="animate-glow-pulse">Pulsing glow</div>
```

### `.animate-slide-in`
Slide in from left (0.5s).
```tsx
<div className="animate-slide-in">Slide in</div>
```

### `.animate-slide-out`
Slide out to right (0.5s).
```tsx
<div className="animate-slide-out">Slide out</div>
```

### `.animate-bounce-in`
Bounce scale animation (0.6s).
```tsx
<div className="animate-bounce-in">Bounce in</div>
```

### `.animate-fade-in`
Fade in animation (0.5s).
```tsx
<div className="animate-fade-in">Fade in</div>
```

### `.animate-float`
Float up and down animation (3s).
```tsx
<div className="animate-float">Floating</div>
```

### `.animate-shimmer`
Shimmer loading effect (2s).
```tsx
<div className="animate-shimmer bg-gray-200">Loading</div>
```

### `.animate-pulse-subtle`
Subtle pulse effect (2s).
```tsx
<div className="animate-pulse-subtle">Subtle pulse</div>
```

### `.animate-spin-slow`
Slow rotation (3s).
```tsx
<div className="animate-spin-slow">Spinning slowly</div>
```

---

## 📍 Card Effects

### `.card-hover`
Card hover with shadow and lift effect.
```tsx
<div className="card-hover">Card content</div>
```

### `.card-glow`
Card hover with glow effect.
```tsx
<div className="card-glow">Glowing card</div>
```

---

## 🌊 Wave & Loading Effects

### `.wave`
Wave animation effect.
```tsx
<div className="wave">Waving</div>
```

### `.shimmer-skeleton`
Shimmer loading skeleton effect.
```tsx
<div className="shimmer-skeleton h-12 w-32"></div>
```

---

## 🔄 Rotation & Transform Effects

### `.rotate-on-hover`
Rotate 6 degrees on hover.
```tsx
<div className="rotate-on-hover">Hover me</div>
```

### Transform Classes
```tsx
<div className="hover:-translate-y-1">Move up on hover</div>
<div className="hover:-translate-y-2">Move up more on hover</div>
<div className="hover:scale-105">Scale on hover</div>
<div className="hover:scale-[1.02]">Subtle scale on hover</div>
```

---

## 🎨 Gradient Text Effects

### `.gradient-text-animated`
Animated gradient text.
```tsx
<h1 className="gradient-text-animated">Animated gradient</h1>
```

### `.gradient-text-shimmer`
Shimmer gradient text animation.
```tsx
<h1 className="gradient-text-shimmer">Shimmer text</h1>
```

---

## ⚡ Interactive Elements

### `.interactive-pulse`
Pulse on idle, stop on hover.
```tsx
<button className="interactive-pulse">Pulsing button</button>
```

### `.interactive-bounce`
Bounce effect on active (click).
```tsx
<button className="interactive-bounce">Click me</button>
```

---

## 🎯 Focus & Input Effects

### `.focus-glow:focus-visible`
Glow effect on focus.
```tsx
<input className="focus-glow" type="text" />
```

---

## 🌟 Transition Effects

### `.transition-smooth`
Smooth transition (300ms).
```tsx
<div className="transition-smooth hover:bg-blue-500">Smooth transition</div>
```

### `.transition-bounce`
Bounce transition (300ms ease-out).
```tsx
<div className="transition-bounce hover:scale-110">Bounce transition</div>
```

---

## 🌐 Backdrop & Overlay Effects

### `.backdrop-blur-glass`
Extra strong blur effect.
```tsx
<div className="backdrop-blur-glass">Blurred background</div>
```

### `.overlay-gradient`
Black overlay gradient from bottom.
```tsx
<div className="relative">
  <img src="image.jpg" />
  <div className="overlay-gradient"></div>
</div>
```

---

## 💾 Advanced Tailwind Utilities

### Custom Box Shadows
```tsx
<div className="shadow-glow">Glow shadow</div>
<div className="shadow-glow-md">Medium glow</div>
<div className="shadow-glow-lg">Large glow</div>
<div className="shadow-neon">Neon shadow</div>
```

### Custom Blur
```tsx
<div className="blur-xs">Extra small blur</div>
```

### Gradient Backgrounds
```tsx
<div className="bg-gradient-radial">Radial gradient</div>
<div className="bg-gradient-conic">Conic gradient</div>
<div className="bg-gradient-mesh">Mesh pattern</div>
```

---

## 🎪 Animation Delays

Untuk menambah animation delay (custom):
```tsx
<div className="animate-fade-in animation-delay-200">Delay 0.2s</div>
<div className="animate-fade-in animation-delay-300">Delay 0.3s</div>
<div className="animate-bounce-in animation-delay-2000">Delay 2s</div>
```

---

## 📱 Responsive Animations

Animations otomatis disable untuk users yang prefer reduced motion:
```tsx
/* Automatically respected via @media (prefers-reduced-motion: reduce) */
```

---

## 🚀 Usage Examples

### Premium Button
```tsx
<Button 
  className="bg-gradient-brand text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 scale-on-hover"
>
  Premium Button
</Button>
```

### Floating Card
```tsx
<Card className="glass card-hover animate-bounce-in">
  <CardHeader>
    <h3 className="neon-text">Card Title</h3>
  </CardHeader>
</Card>
```

### Animated Hero
```tsx
<div className="animate-fade-in">
  <h1 className="gradient-text-shimmer animate-bounce-in">Hero Title</h1>
  <p className="animate-fade-in animation-delay-200">Description</p>
</div>
```

### Loading State
```tsx
<div className="shimmer-skeleton h-12 w-32 rounded-lg"></div>
```

### Neon Input
```tsx
<input 
  className="glass focus-glow neon-border" 
  type="text" 
  placeholder="Enter text"
/>
```

---

## 🎨 Color Customization

Semua effects automatic support dark mode:
```tsx
<div className="bg-blue-50 dark:bg-slate-900 glass">
  Auto dark mode support
</div>
```

---

## ⚡ Performance Tips

1. **Limit animations** - Jangan overuse, max 3-4 animasi per element
2. **Use `transform`** - Lebih performa dari positioning
3. **Batch animations** - Group related animations bersama
4. **Test on mobile** - Check performance di device nyata
5. **Respect prefers-reduced-motion** - Sudah built-in support

---

## 📖 Reference

### Animation Durations
- Quick: 200ms
- Standard: 300ms
- Slow: 500ms-2s
- Very Slow: 3s+

### Common Timing Functions
- `ease-out` - Start fast, end slow
- `ease-in` - Start slow, end fast
- `ease-in-out` - Slow start & end
- `cubic-bezier` - Custom timing

---

**Last Updated:** November 30, 2025  
**Status:** ✅ All effects tested and ready to use
