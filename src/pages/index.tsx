import { supabase } from '@/lib/db';
import { IMenu } from '@/types/menu';
import { useEffect, useState } from 'react';

const Home = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('menus').select('*');

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
        } else {
          setMenus(data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch menus');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []); // Remove supabase from dependency

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Home</h1>
      <div>{menus.length > 0 ? menus.map((menu) => <div key={menu.id}>{menu.name}</div>) : <p>No menus found</p>}</div>
    </div>
  );
};

export default Home;
