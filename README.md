# Mira Colors Learning App v2.0

An interactive web application designed for children to learn about color mixing, discover fun facts, and play educational games. Supports English and Arabic languages with Text-to-Speech functionality.

## 🌟 Features

### Core Learning
- **Color Mixing Game**: Interactive challenges to mix colors and achieve target colors
- **Progressive Learning**: Unlock palettes sequentially as you master challenges
- **Star-based Reward System**: Earn stars for completing challenges

### Mini-Games
- **Color Match**: Match colors to objects (e.g., red apple)
- **Rainbow Sequence**: Tap colors in the correct order

### Accessibility & UX
- **Multi-language Support**: English and Arabic with RTL layout
- **Text-to-Speech**: Spoken feedback for all content
- **Colorblind Mode**: Pattern-based color differentiation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Haptic Feedback**: Tactile feedback on supported devices

### Visual Features
- **Customizable Avatars**: Select from various avatar options
- **Themed Backgrounds**: Dynamic backgrounds based on color palettes
- **Enhanced Animations**: Particle effects and visual feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed

### Installation
```bash
git clone https://github.com/socialawy/mira-colors-v2.git
cd mira-colors-v2
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🌐 Deployment

### Netlify Deployment (Recommended)

#### Option 1: Drag & Drop (Quick)
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag and drop the `dist` folder

#### Option 2: Git Integration (Automatic Updates)
1. Go to https://app.netlify.com/start
2. Connect to GitHub
3. Select `socialawy/mira-colors-v2` repository
4. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

### Other Platforms
The app works with any static hosting service. Just upload the `dist` folder contents.

## 📁 Project Structure

```
├── components/          # React components
│   ├── ColorButton.tsx
│   ├── ColorMixingGameView.tsx
│   ├── FunFactsExplorerView.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   └── useSpeech.ts
├── App.tsx             # Main application component
├── constants.ts        # App data and configuration
├── types.ts            # TypeScript type definitions
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
└── netlify.toml        # Netlify deployment config
```

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.6.0
- **Styling**: Tailwind CSS
- **Deployment**: Netlify optimized

## 🎮 How to Play

### Color Mixing Game
1. Select a palette (Warm, Cool, or Neutral)
2. Mix colors from the available selection
3. Match the target color before running out of attempts
4. Earn stars to unlock new palettes

### Mini-Games
- **Color Match**: Choose the correct color for displayed objects
- **Rainbow Sequence**: Tap colors in the correct order

### Accessibility Features
- Toggle Text-to-Speech for audio feedback
- Enable Colorblind Mode for pattern-based differentiation
- Use keyboard navigation for better accessibility

## 🔧 Configuration

### Environment Variables
No environment variables required - the app is fully self-contained.

### Build Configuration
- Production builds are optimized with Vite
- Assets are minified and compressed
- SPA routing is configured for proper deployment

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Live Demo

**Deployed on Netlify:** https://mira-colors-v2.netlify.app

---

**Built with ❤️ for children's education**
