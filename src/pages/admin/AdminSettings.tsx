import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Clock,
  Printer,
  Bell,
  Upload,
  Save,
  Palette,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [queueAutoReset, setQueueAutoReset] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and defaults
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dispensary Name</label>
                  <Input defaultValue="MediQueue Dispensary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Number</label>
                  <Input defaultValue="+1 234 567 8900" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input defaultValue="123 Medical Center Drive, City, State 12345" />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Operating Hours</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Opening Time</label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Closing Time</label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Printer Settings
              </CardTitle>
              <CardDescription>Configure thermal printer for receipts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Printer Name</label>
                  <Input placeholder="Select printer..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Paper Width</label>
                  <Input defaultValue="80mm" />
                </div>
              </div>
              <Button variant="outline">Test Print</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Queue Settings
              </CardTitle>
              <CardDescription>Configure queue behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-reset Queue Daily</p>
                  <p className="text-sm text-muted-foreground">
                    Clear queue at end of each day
                  </p>
                </div>
                <Switch checked={queueAutoReset} onCheckedChange={setQueueAutoReset} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reset Time</label>
                  <Input type="time" defaultValue="00:00" disabled={!queueAutoReset} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Avg. Consultation Time (min)</label>
                  <Input type="number" defaultValue="15" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Token Prefix (OPD)</label>
                <Input defaultValue="A" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Token Prefix (Specialist)</label>
                <Input defaultValue="B" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Play sound when calling patients
                  </p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Send SMS when patient is next in queue
                  </p>
                </div>
                <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Low Stock Alerts</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Notify when inventory falls below reorder level
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding
              </CardTitle>
              <CardDescription>Customize appearance and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-10 p-1" defaultValue="#3b82f6" />
                    <Input defaultValue="#3b82f6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accent Color</label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-10 p-1" defaultValue="#14b8a6" />
                    <Input defaultValue="#14b8a6" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Invoice Footer Text</label>
                <Input defaultValue="Thank you for visiting MediQueue Dispensary!" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
