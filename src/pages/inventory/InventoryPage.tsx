import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/common/DataTable';
import { mockDrugs } from '@/data/mockData';
import { Drug } from '@/types';
import {
  Package,
  Plus,
  AlertTriangle,
  Clock,
  Search,
  TrendingDown,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function InventoryPage() {
  const [drugs] = useState<Drug[]>(mockDrugs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Calculate stats
  const totalItems = drugs.length;
  const lowStockItems = drugs.filter((d) => {
    const totalQty = d.batches.reduce((sum, b) => sum + b.quantity, 0);
    return totalQty <= d.reorderLevel;
  });
  const expiringSoon = drugs.filter((d) =>
    d.batches.some((b) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(b.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    })
  );

  const drugTableData = drugs.map((drug) => {
    const totalQty = drug.batches.reduce((sum, b) => sum + b.quantity, 0);
    const nearestExpiry = drug.batches.reduce((nearest, b) => {
      return new Date(b.expiryDate) < new Date(nearest) ? b.expiryDate : nearest;
    }, drug.batches[0]?.expiryDate || new Date());

    return {
      id: drug.id,
      name: drug.name,
      genericName: drug.genericName,
      category: drug.category,
      quantity: totalQty,
      reorderLevel: drug.reorderLevel,
      expiryDate: nearestExpiry,
      status: totalQty <= drug.reorderLevel ? 'low' : 'ok',
    };
  });

  const columns = [
    {
      key: 'name',
      header: 'Drug Name',
      sortable: true,
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.genericName}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item: any) => <Badge variant="outline">{item.category}</Badge>,
    },
    {
      key: 'quantity',
      header: 'Stock',
      sortable: true,
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <span className={item.status === 'low' ? 'text-destructive font-medium' : ''}>
            {item.quantity}
          </span>
          {item.status === 'low' && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </div>
      ),
    },
    {
      key: 'reorderLevel',
      header: 'Reorder Level',
    },
    {
      key: 'expiryDate',
      header: 'Nearest Expiry',
      sortable: true,
      render: (item: any) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const isExpiringSoon = daysUntilExpiry <= 90;
        return (
          <div className={isExpiringSoon ? 'text-medical-orange' : ''}>
            {new Date(item.expiryDate).toLocaleDateString()}
            {isExpiringSoon && (
              <p className="text-xs">{daysUntilExpiry} days left</p>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage drug stock, batches, and expiry
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Receive Stock</DialogTitle>
                <DialogDescription>Add new batch or update existing stock</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Drug Name</label>
                  <Input placeholder="Search drug..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Batch Number</label>
                    <Input placeholder="e.g., PCM-2024-002" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supplier</label>
                    <Input placeholder="Supplier name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Purchase Price</label>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selling Price</label>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    toast({ title: 'Stock Added', description: 'New batch received' });
                    setIsAddDialogOpen(false);
                  }}
                >
                  Add Stock
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalItems}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-orange/20">
              <Clock className="h-6 w-6 text-medical-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiringSoon.length}</p>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-medical-green/20">
              <TrendingUp className="h-6 w-6 text-medical-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">$12.5k</p>
              <p className="text-sm text-muted-foreground">Stock Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Items ({totalItems})</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock ({lowStockItems.length})
          </TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring Soon ({expiringSoon.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={drugTableData}
                columns={columns}
                searchKey="name"
                searchPlaceholder="Search drugs..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={drugTableData.filter((d) => d.status === 'low')}
                columns={columns}
                searchKey="name"
                searchPlaceholder="Search drugs..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={drugTableData.filter((d) => {
                  const daysUntilExpiry = Math.ceil(
                    (new Date(d.expiryDate).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                })}
                columns={columns}
                searchKey="name"
                searchPlaceholder="Search drugs..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
