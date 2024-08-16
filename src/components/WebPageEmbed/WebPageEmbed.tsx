import React from 'react';

const WebPageEmbed = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        src="https://www.notion.so/"
        style={{ border: 'none', width: '100%', height: '100%' }}
        title="Workspace"
      />
    </div>
  );
};

export default WebPageEmbed;
