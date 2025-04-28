import React from 'react';
import './styles/FeaturesSection.scss';

const FeaturesSection = () => {
  const features = [
    { title: 'Add Notes', description: 'Quickly add notes with just a click.', icon: '📝' },
    { title: 'Edit Notes', description: 'Modify your notes anytime.', icon: '✏️' },
    { title: 'Delete Notes', description: 'Easily remove notes you no longer need.', icon: '🗑️' },
    { title: 'Secure Login', description: 'Keep your notes private and secure.', icon: '🔒' },
  ];

  return (
    <section id="features" className="features">
      <h2>Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
