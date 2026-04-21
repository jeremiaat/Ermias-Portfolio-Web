# Jeremiah's Portfolio Website

A modern, responsive portfolio website showcasing web development projects with a focus on clean design, accessibility, and user experience.

## 🚀 Features

- **Responsive Design**: Optimized for all screen sizes and devices
- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Dynamic Content**: Projects loaded asynchronously from JSON data
- **Semantic HTML**: Accessible and SEO-friendly markup
- **Modern CSS**: Clean styling with CSS custom properties and flexbox/grid layouts
- **Interactive Elements**: Smooth scroll animations and micro-interactions
- **Contact Form**: Client-side validated contact form with instant feedback

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with custom properties, flexbox, and grid
- **JavaScript**: DOM manipulation, event handling, and dynamic content loading
- **Fetch API**: Asynchronous data loading with graceful fallbacks

### Design & UX
- **Typography**: Google Fonts (DM Sans, Fraunces) for optimal readability
- **Color System**: Thoughtful color palette with proper contrast ratios
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: ARIA labels, semantic markup, and keyboard navigation

## 📁 Project Structure

```
Portfolio Website/
├── index.html          # Main HTML structure
├── style.css           # Complete styling with theme support
├── script.js           # Interactive behaviors and functionality
├── projects.json       # Project data for dynamic loading
└── README.md           # This file
```

## 🎯 Key Features Demonstrated

### 1. Semantic HTML Structure
- Proper heading hierarchy
- Accessible navigation and form elements
- Semantic sectioning elements
- ARIA labels for screen readers

### 2. Modern CSS Techniques
- CSS custom properties for theming
- Flexbox and grid layouts
- Responsive design with media queries
- Smooth transitions and animations
- Component-based styling approach

### 3. JavaScript Functionality
- Dynamic project rendering from JSON
- Theme switching with localStorage persistence
- Smooth scroll navigation
- Form validation and feedback
- Back-to-top functionality
- Intersection Observer for scroll animations

### 4. Data Management
- JSON-based project data structure
- Asynchronous content loading
- Error handling and fallbacks
- Client-side data processing

## 🌙 Dark Mode Implementation

The dark mode feature includes:
- System preference detection using `prefers-color-scheme`
- Theme persistence with `localStorage`
- Smooth theme transitions
- Proper color contrast for accessibility
- Icon and label updates based on current theme

## 📱 Responsive Design

The website is built with a mobile-first approach:
- **Mobile**: Optimized for small screens with compact navigation
- **Tablet**: Balanced layout with adjusted spacing and typography
- **Desktop**: Full-featured layout with enhanced visual hierarchy

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeremiaat/Ermias-Portfolio-Web.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd Ermias-Portfolio-Web
   ```

3. **Open in browser**
   - Simply open `index.html` in your preferred web browser
   - No build process or dependencies required

## 📊 Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions  
- **Safari**: Latest 2 versions
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## 🔧 Customization

### Adding New Projects
1. Open `projects.json`
2. Add new project objects following the existing structure:
   ```json
   {
     "title": "Your Project Name",
     "description": "Brief description of the project",
     "stack": ["Technology1", "Technology2", "Technology3"]
   }
   ```

### Modifying Colors
Edit CSS custom properties in `style.css`:
```css
:root {
  --primary-color: #your-color;
  --text-color: #your-text-color;
  /* ... other variables */
}
```

### Theme Customization
Dark mode colors are defined in `[data-theme="dark"]` selector in `style.css`.

## 📈 Performance

- **Optimized Assets**: Minimal external dependencies
- **Efficient Loading**: Lazy loading for projects section
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Lightweight**: No heavy frameworks or build tools

## 🤝 Contributing

This is a personal portfolio project. For suggestions or feedback:
1. Open an issue with your suggestion
2. Fork the repository and create a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌐 Live Demo

View the live portfolio at: https://jeremiaat.github.io/Ermias-Portfolio-Web/

---

**Built with ❤️ and attention to detail**
