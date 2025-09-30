import React from 'react';

const AdminTest = () => {
  console.log('AdminTest component loaded successfully');
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin Test Page</h1>
        <p className="text-lg">If you can see this, routing to admin is working.</p>
        <p className="text-sm text-muted-foreground mt-2">Check console for debug info.</p>
      </div>
    </div>
  );
};

export default AdminTest;