import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDrugs } from '@/data/mockData';
import {
  Plus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function ReceptionBilling() {
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: 'Consultation Fee', quantity: 1, unitPrice: 50, total: 50 },
  ]);
  const [selectedDrug, setSelectedDrug] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [discount, setDiscount] = useState(0);
  const [amountReceived, setAmountReceived] = useState('');

  const addDrug = () => {
    if (!selectedDrug) return;
    const drug = mockDrugs.find((d) => d.id === selectedDrug);
    if (!drug) return;

    const batch = drug.batches[0];
    const newItem: BillItem = {
      id: `${Date.now()}`,
      name: drug.name,
      quantity: 1,
      unitPrice: batch?.sellingPrice || 0,
      total: batch?.sellingPrice || 0,
    };
    setItems([...items, newItem]);
    setSelectedDrug('');
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity, total: quantity * item.unitPrice }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = (subtotal - discountAmount) * 0.1;
  const total = subtotal - discountAmount + taxAmount;
  const change = parseFloat(amountReceived) - total;

  const handlePayment = () => {
    toast({
      title: 'Payment Successful',
      description: `Invoice #INV${Date.now().toString().slice(-6)} created`,
    });
    // Trigger cash drawer (simulated)
    console.log('Opening cash drawer...');
  };

  const handlePrint = () => {
    toast({
      title: 'Printing Invoice',
      description: 'Sending to thermal printer...',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">POS / Billing</h1>
        <p className="text-muted-foreground">Process payments and generate invoices</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bill Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Drug */}
              <div className="flex gap-2">
                <Select value={selectedDrug} onValueChange={setSelectedDrug}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Add drug or item..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="consultation">
                      Consultation Fee - $50.00
                    </SelectItem>
                    {mockDrugs.map((drug) => (
                      <SelectItem key={drug.id} value={drug.id}>
                        {drug.name} - ${drug.batches[0]?.sellingPrice.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addDrug}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.unitPrice.toFixed(2)} / unit
                      </p>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      className="w-20"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                    />
                    <p className="w-24 text-right font-medium">
                      ${item.total.toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount (%)</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    className="w-20 h-8 text-right"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  />
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-medical-green">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all',
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-blue-400/50 dark:hover:border-blue-600/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                    )}
                  >
                    <Banknote className="h-5 w-5" />
                    <span className="font-medium">Cash</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all',
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-blue-400/50 dark:hover:border-blue-600/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                    )}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Received</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      className="pl-9"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  {change >= 0 && amountReceived && (
                    <div className="rounded-lg bg-medical-green/20 p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Change</span>
                        <span className="font-bold">${change.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Button className="w-full" size="lg" onClick={handlePayment}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Payment
                </Button>
                <Button variant="outline" className="w-full" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
