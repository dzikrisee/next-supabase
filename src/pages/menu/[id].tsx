import { IMenu } from '@/types/menu';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

const DetailMenu = () => {
  const router = useRouter();
  const [menu, setMenu] = useState<IMenu | null>(null);

  useEffect(() => {
    if (router.query.id) {
      const fetchMenu = async () => {
        const { data, error } = await supabase.from('menus').select('*').eq('id', router.query.id);

        console.log(data);
      };

      fetchMenu();
    }
  }, [router.query.id]);
  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-16"></div>
    </div>
  );
};

export default DetailMenu;
