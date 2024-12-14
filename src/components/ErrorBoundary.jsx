// components/ErrorBoundary.jsx
import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
            <div className="text-xl text-red-600">Something went wrong. Please try again.</div>
          </div>
        );
      }
  
      return this.props.children;
    }
  }