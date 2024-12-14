import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

const AboutPage = () => {
    const navigate = useNavigate();
    
    return (
      <div className="min-h-screen bg-[#e0e5ec] p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[-10px_-10px_20px_rgba(255,255,255,0.8),10px_10px_20px_rgba(0,0,0,0.15)] p-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">About E-Learning</h1>
          
          <div className="prose">
            <p>
              Welcome to our E-Learning platform! This platform is designed to provide an interactive and engaging learning experience for students and professionals alike.
            </p>
            
            <h2>Features</h2>
            <ul>
              <li>Comprehensive learning materials</li>
              <li>Interactive exercises</li>
              <li>Progress tracking</li>
              <li>Search functionality</li>
              <li>Mobile-friendly design</li>
            </ul>
            
            <h2>Contact</h2>
            <p>
              For any questions or support, please contact us at:
              <br />
              Email: alfanirsyadi1@gmail.com
              <br />
              Phone: (62) 851-7531-1731
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutPage;