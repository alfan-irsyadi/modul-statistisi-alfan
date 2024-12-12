// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const topics = [
  { id: 1, name: 'Topic 1' },
  { id: 2, name: 'Topic 2' },
  { id: 3, name: 'Topic 3' },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;