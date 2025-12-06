# Project Zed: AI-Assisted Web Application

**Course:** WRIT 40363 - Digital Communication and Design  
**Due Date:** December 10, 2025  
**Developer:** Mia Thompson

## 🎯 Project Overview

This is my final project for WRIT 40363, where I'm building an ambitious web application using AI as a development partner. The goal is to demonstrate **upskilling** — taking what I learned in Projects 1-3 and pushing beyond with AI assistance.

This project focuses on:
- Developing deeper understanding through ambitious experimentation
- Documenting the learning journey (successes, struggles, breakthroughs, and dead ends)
- Building features I wasn't confident to tackle before
- Gaining insight from both successes and failures

> **Note:** A partially-working app with deep reflection is more valuable than a perfect app without understanding. This project prioritizes growth over perfection.

## 💡 Project Description

The **Barcelona Study Abroad Planner** is a comprehensive web application designed to help me organize and plan my upcoming study abroad trip to Barcelona in January 2026. This interactive tool allows me to visualize my schedule on a calendar, plan weekend trips to other Spanish cities, and collect itinerary ideas all in one place.

I created this app because I wanted a personalized way to organize my travel plans that goes beyond simple note-taking. With this planner, I can see my entire semester at a glance, track which weekends I have trips planned, and build a curated list of activities I want to experience in Barcelona.

### Key Features
- **Interactive Calendar** - Navigate through months, view today's date, and see which dates have trips planned
- **Weekend Trip Planner** - Add detailed trip information including destination, dates, notes, and budget tracking
- **Itinerary Ideas Organizer** - Categorized lists for Must-See attractions, Food & Dining experiences, and Activities
- **Data Persistence** - All trips and ideas are saved to localStorage so nothing is lost between sessions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

### Core Technologies
- HTML5 - Semantic markup with ARIA labels for accessibility
- CSS3 - Custom properties, Grid, Flexbox, animations, and transitions
- JavaScript (ES6+) - ES6 modules, arrow functions, template literals, destructuring

### APIs & Libraries
- localStorage API - Client-side data persistence
- Date API - Calendar calculations and date formatting
- No external dependencies - Pure vanilla JavaScript!

### AI Tools
- Claude AI - Used for initial project structure, JavaScript calendar logic, and debugging

## 📚 Upskilled Techniques

This project demonstrates upskilled techniques from throughout the course:

### From Project 1 (HTML/CSS Foundations)
- [x] **Advanced CSS animations and transitions** - Smooth fade-ins, slide animations, scale effects on cards
- [x] **CSS Grid or Flexbox layouts beyond basic grids** - Multi-column responsive layouts for trips and ideas
- [x] **Custom CSS properties (variables) for theming** - Complete color system and spacing scale using CSS variables
- [x] **Responsive design with 3+ breakpoints** - Desktop, tablet, and mobile optimizations
- [x] **Advanced typography and design systems** - Consistent font sizing, weights, and spacing hierarchy

### From Project 2 (JavaScript Fundamentals)
- [x] **Complex DOM manipulation patterns** - Dynamic calendar generation with 42 cells per month
- [x] **Event delegation and advanced event handling** - Modal management, form submissions, button clicks
- [x] **Data structures beyond simple arrays/objects** - Nested objects for categorized ideas, arrays of trip objects
- [x] **Form validation and error handling** - Date validation, required fields, user feedback
- [x] **Modular JavaScript (separation of concerns)** - Organized into logical function groups (calendar, trips, ideas, storage)

### From Project 3 (APIs & Advanced JS)
- [x] **Complex state management across components** - Central state object managing trips, ideas, and current date
- [x] **Data visualization or processing** - Calendar rendering with date calculations and visual markers
- [x] **Progressive enhancement** - Core functionality works, localStorage adds persistence
- [x] **localStorage API** - Saving and loading user data for persistence across sessions

### New Techniques (Learned via AI)
- [x] **Advanced CSS Grid techniques** - Auto-fill/auto-fit for responsive card layouts
- [x] **CSS animation keyframes** - Custom animations (fadeInUp, scaleIn, slideDown, slideInLeft)
- [x] **Accessibility features** - ARIA labels, keyboard navigation (Escape key), focus management, reduced motion support
- [x] **Date manipulation** - Complex calendar math (first day of month, days in month, date range checking)
- [x] **Modal accessibility patterns** - Proper ARIA attributes, focus trapping, keyboard controls
- [x] **High contrast mode support** - Media queries for prefers-contrast and prefers-reduced-motion

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- [List any other requirements]

### Installation
1. Clone this repository:
   ```bash
   git clone [repository-url]
   ```

2. Navigate to the project directory:
   ```bash
   cd [project-folder]
   ```

3. Open `index.html` in your browser, or use a local development server:
   ```bash
   # If you have Python installed:
   python -m http.server 8000
   
   # Or if you have Node.js:
   npx serve
   ```

4. Navigate to `http://localhost:8000` in your browser

### Deployment
This project is deployed on GitHub Pages: [Add your deployed URL here]

## 📖 Documentation

This repository includes comprehensive documentation:

- **[AI_COLLABORATION_LOG.md](./AI_COLLABORATION_LOG.md)** - Documents my partnership with AI tools, including learning moments, challenges, and sample conversations
- **[REFLECTION.md](./REFLECTION.md)** - Developer reflection on the learning process (500-750 words)
- **[CLAUDE.md](./CLAUDE.md)** - [Add description if this contains additional AI collaboration details]

## 🎨 Design Decisions

### Color Palette
I chose a warm, sophisticated color palette that evokes the feeling of Barcelona:
- **#3A232A (Deep Burgundy)** - Primary color for headers and important actions
- **#242B11 (Dark Olive)** - Secondary color for contrast and trip markers
- **#CCBEC0 (Soft Mauve)** - Light backgrounds and subtle highlights
- **#D7D1C3 (Warm Cream)** - Page background and card elements

These colors create a cohesive, calming aesthetic that's easy on the eyes during trip planning sessions.

### User Experience
- **Visual Hierarchy** - Large, clear headers with emoji icons for quick scanning
- **Progressive Disclosure** - Modals keep forms hidden until needed, reducing overwhelm
- **Immediate Feedback** - Calendar updates instantly when trips are added, visual states for hover/active
- **Default Content** - Pre-populated with Barcelona activity ideas so new users aren't faced with empty lists
- **Intuitive Interactions** - Click calendar dates to add trips, clear delete buttons, keyboard shortcuts

### Accessibility
- **ARIA Labels** - All interactive elements have proper labels for screen readers
- **Keyboard Navigation** - Full keyboard support including Escape to close modals
- **Focus Management** - Clear focus indicators on all interactive elements
- **Reduced Motion** - Respects prefers-reduced-motion for users sensitive to animations
- **High Contrast Support** - Additional borders in high contrast mode
- **Semantic HTML** - Proper heading hierarchy, sections, and landmark elements

### Responsive Design
- **Desktop (1200px+)** - Multi-column layouts, spacious calendar grid
- **Tablet (768px-1199px)** - Flexible grids that adapt, comfortable touch targets
- **Mobile (480px-767px)** - Single column layouts, optimized font sizes
- **Small Mobile (<480px)** - Reduced spacing, compact calendar, priority content first

## 🧪 Testing

This application has been tested on:
- [x] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [x] Mobile devices (iOS and Android)
- [x] Different screen sizes (320px to 1920px+)
- [x] Keyboard navigation (Tab, Enter, Escape)
- [x] localStorage functionality (data persistence)
- [x] Form validation (required fields, date logic)
- [x] Calendar date calculations across months

## 🤔 Challenges & Solutions

[*Brief overview of major challenges - more detail in AI_COLLABORATION_LOG.md*]

1. **Challenge:** Calendar Math Complexity
   - **Solution:** Worked with AI to understand Date object methods and properly calculate first day of month, days in month, and rendering empty cells for previous/next months

2. **Challenge:** Data Persistence Without a Database
   - **Solution:** Implemented localStorage with proper error handling and JSON serialization to save trips and ideas client-side

3. **Challenge:** Responsive Calendar Grid
   - **Solution:** Used CSS Grid with 7 equal columns and aspect-ratio to maintain perfect squares that scale across all devices

4. **Challenge:** Modal Accessibility
   - **Solution:** Added ARIA attributes, focus management, Escape key handler, and click-outside-to-close functionality

## 🌟 What I Learned

Key takeaways from this project:
- **JavaScript Date Manipulation** - Working with the Date API taught me how to calculate calendars, handle time zones, and format dates properly
- **State Management Patterns** - Creating a centralized state object helped me understand how modern frameworks manage application data
- **CSS Custom Properties Power** - Using CSS variables made theming incredibly flexible and maintainable
- **Accessibility Isn't Optional** - Implementing ARIA labels and keyboard navigation showed me how critical these features are for inclusive design
- **localStorage Workflow** - Understanding client-side persistence opened up new possibilities for creating useful apps without backend infrastructure
- **AI as a Learning Partner** - Working with Claude helped me understand complex concepts faster by asking "why" questions and getting detailed explanations

[*More detailed reflection available in REFLECTION.md*]

## 🔮 Future Enhancements

If I continue developing this project, I would:
- **Weather API Integration** - Connect to a weather API to show forecasts for planned trip dates
- **Budget Tracker** - Add a dashboard showing total spending across all trips with visual charts
- **Photo Gallery** - Allow users to upload and attach photos to trips after they return
- **Export to PDF** - Generate printable itineraries for offline use during travel
- **Google Calendar Sync** - Two-way sync with Google Calendar for seamless scheduling
- **Collaboration Features** - Share trip plans with friends and collaborate on itineraries
- **Map Integration** - Display trip locations and activities on an interactive map
- **Packing List Generator** - Create customized packing lists based on trip duration and destination

## 📝 Credits

### AI Collaboration
This project was developed with assistance from:
- **Claude AI (Anthropic)** - Used for initial project structure, calendar algorithm development, CSS Grid layouts, accessibility implementation, and debugging JavaScript logic
- Detailed conversations and learning moments documented in [AI_COLLABORATION_LOG.md](./AI_COLLABORATION_LOG.md)

### Resources
- MDN Web Docs - Date object methods and localStorage API documentation
- CSS-Tricks - CSS Grid and Flexbox layout patterns
- W3C WAI - ARIA accessibility guidelines and best practices
- Color palette inspired by Barcelona's warm architectural tones

### Course Context
Built as the final project for WRIT 40363: Digital Communication and Design at TCU, Fall 2025.

## 📄 License

This project is part of academic coursework and is available for educational purposes.

## 🔗 Portfolio Integration

This project is integrated into my main portfolio:
- Main Portfolio: [Add link to your Project 1 portfolio]
- Other Projects: [Add links to Projects 1-3]

---

**Last Updated:** November 18, 2025
