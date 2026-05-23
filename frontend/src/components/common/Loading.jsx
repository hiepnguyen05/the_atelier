import React from 'react';

const Loading = ({ 
  size = 120, 
  text = 'Crafting...', 
  className = '', 
  fullPage = false 
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-on-background"
      >
        <style>{`
          .needle {
            transform-origin: 50px 10px;
            animation: weave 2s ease-in-out infinite;
          }
          .thread {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: thread-flow 2s ease-in-out infinite;
          }
          @keyframes weave {
            0%, 100% { transform: rotate(-15deg); }
            50% { transform: rotate(15deg); }
          }
          @keyframes thread-flow {
            0% { stroke-dashoffset: 100; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -100; }
          }
        `}</style>
        {/* Needle */}
        <g className="needle">
          <path d="M50 10L50 60" stroke="currentColor" strokeWidth="0.75" />
          <ellipse cx="50" cy="15" rx="1.5" ry="3" fill="none" stroke="currentColor" strokeWidth="0.75" />
        </g>
        {/* Flowing Thread */}
        <path class="thread" d="M30 50C40 40 60 60 70 50" stroke="currentColor" strokeWidth="0.75" fill="none" />
        {text && (
          <text 
            x="50" 
            y="85" 
            fill="currentColor" 
            fontFamily="Newsreader" 
            fontStyle="italic" 
            fontSize="7" 
            textAnchor="middle" 
            style={{ letterSpacing: '0.15em' }}
          >
            {text}
          </text>
        )}
      </svg>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background animate-fade-in">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
