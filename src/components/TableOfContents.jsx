import React, {useState, useEffect, useMemo} from "react";
import { Button } from "./Button";

// components/TableOfContents.jsx
export const TableOfContents = ({ content }) => {
    const [activeSection, setActiveSection] = useState('');
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.5 }
      );
  
      document.querySelectorAll('h2, h3, h4').forEach((heading) => {
        observer.observe(heading);
      });
  
      return () => observer.disconnect();
    }, [content]);
  
    const getHeadings = useMemo(() => {
      const headings = [];
      const lines = content.split('\n');
      lines.forEach(line => {
        if (line.startsWith('#### ')) {
            headings.push({ level: 4, text: line.replace('####', '').trim() });
        }else if (line.startsWith('### ')) {
          headings.push({ level: 3, text: line.replace('###', '').trim() });
        } else if (line.startsWith('## ')) {
          headings.push({ level: 2, text: line.replace('##', '').trim() });
        }
      });
      return headings;
    }, [content]);
  
    const scrollToHeading = (headingText) => {
      const headingId = headingText.toLowerCase().replace(/\s+/g, '-');
      const element = document.getElementById(headingId);
      if (element) {
        const offset = element.offsetTop - 80;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    };
  
    return (
      <div className="fixed right-4 top-4 z-50">
        <Button
          variant="icon"
          className="mb-2 ml-auto"
          onClick={() => setIsVisible(!isVisible)}
          icon={
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
              {isVisible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          }
        />
        {isVisible && (
          <nav className="hidden xl:block w-64 p-4 bg-white rounded-lg shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="font-bold mb-2">Table of Contents</h3>
            <ul className="space-y-2">
              {getHeadings.map((heading, index) => (
                <li
                  key={index}
                  className={`
                    ${heading.level === 4 ? 'ml-8' : (heading.level === 3 ? 'ml-4' : '')}
                    ${activeSection === heading.text.toLowerCase().replace(/\s+/g, '-') ? 'text-blue-500' : 'text-gray-600'}
                    hover:text-blue-500 cursor-pointer transition-colors
                  `}
                  onClick={() => scrollToHeading(heading.text)}                  
                >
                    <a href={'#'+heading.text.replace(/\s+/g, ' ').trim().replaceAll('.','').replaceAll(' ','-')
                        .replaceAll('(','').replaceAll(')','').replaceAll('/','').replaceAll(',','').replaceAll('\'','')
                        .toLowerCase()}>{heading.text}</a>
                  
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    );
  };