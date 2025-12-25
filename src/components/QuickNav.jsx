import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Battery, Utensils, Mic, BookOpen, Trello, Menu, X } from 'lucide-react';

const QuickNav = ({ darkMode }) => {
  const [activeSection, setActiveSection] = useState('must-dos');
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: 'must-dos', label: 'Must-Dos', icon: Sparkles, color: 'emerald' },
    { id: 'schedule', label: 'Schedule', icon: Clock, color: 'cyan' },
    { id: 'energy', label: 'Energy', icon: Battery, color: 'purple' },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils, color: 'orange' },
    { id: 'voice', label: 'Voice Diary', icon: Mic, color: 'pink' },
    { id: 'library', label: 'Library', icon: BookOpen, color: 'amber' },
    { id: 'tasks', label: 'Tasks', icon: Trello, color: 'blue' },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveSection(sectionId);
      setIsOpen(false); // Close mobile menu
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-4 bottom-24 z-40 lg:hidden p-3 rounded-full shadow-xl transition-all ${
          darkMode
            ? 'bg-gray-800 border-2 border-purple-500/50 text-purple-400'
            : 'bg-white border-2 border-purple-300 text-purple-600'
        }`}
        title="Quick Navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Navigation Sidebar */}
      <div
        className={`fixed left-4 bottom-36 lg:top-32 lg:bottom-auto z-30 transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto'
        }`}
      >
        <div
          className={`rounded-2xl border-2 p-3 shadow-2xl ${
            darkMode
              ? 'bg-gray-800/95 border-gray-700/50 backdrop-blur-xl'
              : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
          }`}
        >
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all group ${
                    isActive
                      ? darkMode
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-purple-100 text-purple-700'
                      : darkMode
                        ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={section.label}
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 ${
                      isActive
                        ? `text-${section.color}-500`
                        : ''
                    }`}
                  />
                  <span className="text-sm font-medium hidden lg:block">
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className={`mt-3 pt-3 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`text-xs text-center ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickNav;
