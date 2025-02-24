import React, { useCallback, useEffect } from 'react';

const COLORS = {
  BRILLIANT_AZURE: '#00B3FF',
  POLISHED_SILVER: '#CCCCCC',
  CRIMSON_RED: '#FF0000',
  BRILLIANT_GOLD: '#FFD700',
  EMERALD_GREEN: '#00CC00'
};

const DEFAULT_MAPPINGS = {
  RadiantShores: 'BRILLIANT_AZURE',
  Ironforge: 'POLISHED_SILVER',
  Skullcrag: 'CRIMSON_RED',
  NovaWarhound: 'BRILLIANT_GOLD',
  SavageCoast: 'EMERALD_GREEN'
};

const Section = ({ title, content }) => {
  if (title === 'Base Insignias') {
    return (
      <div className="mb-6">
        <h3 className="text-white text-xl mb-3">{title}</h3>
        <p className="text-gray-300 mb-3">
          Your troops will be marked with insignias based on your home base:
        </p>
        <ul className="space-y-2">
          {Object.entries(DEFAULT_MAPPINGS).map(([base, colorKey]) => (
            <li key={base} className="pl-4 relative flex items-center gap-2">
              <span 
                className="absolute left-0"
                style={{ color: COLORS[colorKey] }}
              >
                •
              </span>
              <span style={{ color: COLORS[colorKey] }}>{base}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const formatContent = (content) => {
    if (!content) return null;

    if (content.includes('\n\n•')) {
      const [intro, listContent] = content.split('\n\n');
      const listItems = listContent.split('\n• ').filter(Boolean);
      
      return (
        <>
          <p className="text-gray-300 mb-3">{intro}</p>
          <ul className="space-y-2">
            {listItems.map((item, index) => (
              <li key={index} className="text-gray-300 pl-4 relative">
                <span className="absolute left-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </>
      );
    }

    return content.split('\n').map((line, index) => (
      line ? <p key={index} className="text-gray-300 mb-2">{line}</p> : null
    ));
  };

  return (
    <div className="mb-6">
      {title && <h3 className="text-white text-xl mb-3">{title}</h3>}
      {formatContent(content)}
    </div>
  );
};

const ImageSection = ({ url }) => (
  <div className="flex justify-center mb-6">
    <img 
      src={url} 
      className="rounded-lg max-w-full h-auto"
      alt="Guide content" 
    />
  </div>
);

const IntroTutorial = ({ content, onClose }) => {
  // Add custom scrollbar styles when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .scrollbar-custom::-webkit-scrollbar {
        width: 8px;
      }
      .scrollbar-custom::-webkit-scrollbar-track {
        background: #333333;
        border-radius: 4px;
      }
      .scrollbar-custom::-webkit-scrollbar-thumb {
        background: #666666;
        border-radius: 4px;
      }
      .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: #777777;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const renderContent = useCallback((item) => {
    switch (item.gType) {
      case 'section':
        return (
          <Section 
            key={item.data.title} 
            title={item.data.title} 
            content={item.data.content} 
          />
        );
      case 'image':
        return <ImageSection key={item.data.url} url={item.data.url} />;
      default:
        return null;
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[800px] h-[600px] bg-[#333333] bg-opacity-95 rounded-lg flex flex-col">
        {/* Title Bar */}
        <div className="h-12 bg-[#444444] rounded-t-lg flex items-center justify-between px-5">
          <h2 className="text-white text-xl">Guide</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-[#666666] text-white rounded-lg hover:bg-[#777777] transition-colors"
          >
            X
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          <div className="space-y-6">
            {content.map(renderContent)}
          </div>
        </div>
      </div>

      {/* No custom style tag needed here */}
    </div>
  );
};

export default IntroTutorial;