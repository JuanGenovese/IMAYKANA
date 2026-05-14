'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function TestSupabase() {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      const supabase = createSupabaseClient();
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(5);

      if (error) {
        setError(error.message);
      } else {
        setData(data);
      }
      setLoading(false);
    }

    testConnection();
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Prueba de Conexión Supabase</h1>
      
      {loading && <p className="text-gray-500">Cargando datos...</p>}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold mb-2">¡Conexión exitosa!</p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
