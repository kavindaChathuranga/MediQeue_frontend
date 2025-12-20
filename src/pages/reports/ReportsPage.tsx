import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/common/MetricCard';
import { mockInvoices } from '@/data/mockData';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  Download,
  Calendar,
  BarChart3,
  FileText,
  RefreshCw,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('today');

  // Mock stats
  const totalSales = 1245.50;
  const cashSales = 875.25;
  const cardSales = 370.25;
  const transactionCount = 24;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Financial summaries and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          subtitle="Today"
          icon={DollarSign}
          variant="success"
          trend={{ value: 12, positive: true }}
        />
        <MetricCard
          title="Cash Sales"
          value={`$${cashSales.toFixed(2)}`}
          subtitle={`${((cashSales / totalSales) * 100).toFixed(0)}% of total`}
          icon={Banknote}
          variant="primary"
        />
        <MetricCard
          title="Card Sales"
          value={`$${cardSales.toFixed(2)}`}
          subtitle={`${((cardSales / totalSales) * 100).toFixed(0)}% of total`}
          icon={CreditCard}
          variant="accent"
        />
        <MetricCard
          title="Transactions"
          value={transactionCount}
          subtitle="Invoices generated"
          icon={FileText}
          variant="default"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Overview
            </CardTitle>
            <CardDescription>Revenue trend for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg border-2 border-dashed flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Sales chart visualization</p>
                <p className="text-sm">Connect to backend for live data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Selling Items
            </CardTitle>
            <CardDescription>Most dispensed medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Paracetamol 500mg', qty: 150, revenue: 15 },
                { name: 'Amoxicillin 500mg', qty: 85, revenue: 25.5 },
                { name: 'Omeprazole 20mg', qty: 60, revenue: 24 },
                { name: 'Metformin 500mg', qty: 45, revenue: 6.75 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.qty} units</p>
                    </div>
                  </div>
                  <span className="font-medium">${item.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest invoices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInvoices.concat(mockInvoices).slice(0, 5).map((invoice, index) => (
                <div
                  key={`${invoice.id}-${index}`}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.id} • {invoice.items.length} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${invoice.total.toFixed(2)}</p>
                    <Badge
                      variant="outline"
                      className={
                        invoice.paymentMethod === 'cash'
                          ? 'text-medical-green border-medical-green/30'
                          : 'text-medical-blue border-medical-blue/30'
                      }
                    >
                      {invoice.paymentMethod}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Export detailed reports for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Daily Summary', icon: Calendar, desc: 'Sales & transactions' },
              { name: 'Inventory Report', icon: RefreshCw, desc: 'Stock levels & expiry' },
              { name: 'Patient Flow', icon: TrendingUp, desc: 'Queue & consultation' },
              { name: 'Financial Report', icon: DollarSign, desc: 'Revenue & expenses' },
            ].map((report) => (
              <Button
                key={report.name}
                variant="outline"
                className="h-auto flex-col items-start p-4"
              >
                <report.icon className="h-5 w-5 mb-2" />
                <span className="font-medium">{report.name}</span>
                <span className="text-xs text-muted-foreground">{report.desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
