import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormEvent, use, useEffect, useState } from 'react';
import { IMenu } from '@/types/menu';
import { supabase } from '@/lib/db';
import Image from 'next/image';
import { DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AdminPage = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [createDialog, setCreateDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<{
    menu: IMenu;
    action: 'edit' | 'delete';
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from('menus').select('*');

      if (error) console.log('error:', error);
      else setMenus(data);
    };

    fetchMenus();
  }, []);

  const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data, error } = await supabase.from('menus').insert(Object.fromEntries(formData)).select();

      if (error) console.log('error:', error);
      else {
        if (data) {
          setMenus((prev) => [...prev, ...data]);
        }
        toast('Menu added successfully!');
        setCreateDialog(false);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const handleUpdateMenu = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data, error } = await supabase.from('menus').update(Object.fromEntries(formData)).eq('id', selectedMenu?.menu.id).select();

      if (error) console.log('error:', error);
      else {
        if (data) {
          setMenus((prev) => prev.map((menu) => (menu.id === selectedMenu?.menu.id ? data[0] : menu)));
        }
        toast('Menu updated successfully!');
        setSelectedMenu(null);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const handleDeleteMenu = async () => {
    try {
      const { data, error } = await supabase.from('menus').delete().eq('id', selectedMenu?.menu.id);

      if (error) console.log('error:', error);
      else {
        setMenus((prev) => prev.filter((menu) => menu.id !== selectedMenu?.menu.id));
        toast('Menu deleted successfully!');
        setSelectedMenu(null);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      image: '',
    });
  };

  const openEditDialog = (menu: IMenu) => {
    setSelectedMenu({ menu, action: 'edit' });
    setFormData({
      name: menu.name,
      description: menu.description,
      category: menu.category,
      price: menu.price.toString(),
      image: menu.image,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-4 w-full flex justify-between">
        <div className="text-3xl font-bold">Menu</div>
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <Button className="font-bold">Add Menu</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleAddMenu} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Add Menu</DialogTitle>
                <DialogDescription>Create a new menu by insert data in this form.</DialogDescription>
              </DialogHeader>
              <div className="grid w-full gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Insert Name" required />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" placeholder="Insert Price" required />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" name="image" placeholder="Insert Image" required />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="category">category</Label>
                  <Select name="category" required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Coffee">Coffe</SelectItem>
                        <SelectItem value="Non Coffee">Non Coffe</SelectItem>
                        <SelectItem value="Pastries">Pastries</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Insert Description" className="resize-none h-32"></Textarea>
                </div>
              </div>

              <DialogFooter>
                <DialogClose>
                  <Button variant="secondary" className="cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cursor-pointer">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow className="text-neutral-500">
              <TableHead className="text-neutral-700 font-bold">Product</TableHead>
              <TableHead className="text-neutral-700 font-bold">Description</TableHead>
              <TableHead className="text-neutral-700 font-bold">Category</TableHead>
              <TableHead className="text-neutral-700 font-bold">Price</TableHead>
              <TableHead className="text-neutral-700 font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu: IMenu) => (
              <TableRow key={menu.id}>
                <TableCell className="flex gap-3 items-center w-full">
                  <Image width={50} height={50} src={menu.image} alt={menu.name} className="aspect-square object-cover rounded-lg" />
                  {menu.name}
                </TableCell>
                <TableCell>{menu.description.split(' ').slice(0, 5).join(' ') + '...'}</TableCell>
                <TableCell>{menu.category}</TableCell>
                <TableCell>${menu.price},00</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="font-bold">Action</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => openEditDialog(menu)}>Update</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedMenu({ menu, action: 'delete' })} className="text-red-400">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Update Dialog */}
      <Dialog
        open={selectedMenu !== null && selectedMenu.action === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMenu(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleUpdateMenu} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Update Menu</DialogTitle>
              <DialogDescription>Update the menu information below.</DialogDescription>
            </DialogHeader>
            <div className="grid w-full gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Insert Name" required />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="edit-price">Price</Label>
                <Input id="edit-price" name="price" value={formData.price} onChange={handleInputChange} placeholder="Insert Price" required />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="edit-image">Image</Label>
                <Input id="edit-image" name="image" value={formData.image} onChange={handleInputChange} placeholder="Insert Image" required />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="edit-category">Category</Label>
                <Select name="category" value={formData.category} onValueChange={handleSelectChange} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="Coffee">Coffe</SelectItem>
                      <SelectItem value="Non Coffee">Non Coffe</SelectItem>
                      <SelectItem value="Pastries">Pastries</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Insert Description" className="resize-none h-32" required />
              </div>
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="secondary" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={selectedMenu !== null && selectedMenu.action === 'delete'}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMenu(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Menu</DialogTitle>
            <DialogDescription>Are you sure want to delete {selectedMenu?.menu.name}</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose>
              <Button variant="secondary" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleDeleteMenu} variant="destructive" className="cursor-pointer">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
