import React from 'react';

const EnvTest = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Environment Variables Test</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">VITE_GOOGLE_MAPS_API_KEY:</span>{' '}
          <span className={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'text-green-600' : 'text-red-600'}>
            {import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'Not set'}
          </span>
        </div>
        <div>
          <span className="font-semibold">VITE_SUPABASE_URL:</span>{' '}
          <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
            {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set'}
          </span>
        </div>
        <div>
          <span className="font-semibold">VITE_SUPABASE_ANON_KEY:</span>{' '}
          <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
            {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnvTest;
