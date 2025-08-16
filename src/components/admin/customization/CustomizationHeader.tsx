
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, Code, Plus, Palette } from 'lucide-react';

export const CustomizationHeader = () => {
  const { toast } = useToast();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isNewCustomizationOpen, setIsNewCustomizationOpen] = useState(false);
  const [newCustomization, setNewCustomization] = useState({
    name: '',
    description: '',
    type: 'theme',
    category: 'ui'
  });

  const handleDeveloperMode = () => {
    setIsDeveloperMode(!isDeveloperMode);
    toast({
      title: isDeveloperMode ? "Developer Mode Disabled" : "Developer Mode Enabled",
      description: isDeveloperMode 
        ? "Switched back to visual editor mode" 
        : "Advanced development tools are now available",
    });
  };

  const handleCreateCustomization = () => {
    if (!newCustomization.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the customization.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Customization Created",
      description: `${newCustomization.name} has been created successfully.`,
    });

    setIsNewCustomizationOpen(false);
    setNewCustomization({
      name: '',
      description: '',
      type: 'theme',
      category: 'ui'
    });
  };

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Customization Studio</h1>
              {isDeveloperMode && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-normal mt-1">
                  Developer Mode
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={isDeveloperMode ? "default" : "outline"} 
              size="sm"
              onClick={handleDeveloperMode}
              className={isDeveloperMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"}
            >
              <Code className="w-4 h-4 mr-2" />
              Developer Mode
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              onClick={() => setIsNewCustomizationOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Customization
            </Button>
          </div>
        </div>
        <p className="text-sm text-slate-600 max-w-2xl">
          Design, configure, and deploy customizations across your platform with enterprise-grade tools and real-time preview capabilities.
        </p>
      </div>

      <Dialog open={isNewCustomizationOpen} onOpenChange={setIsNewCustomizationOpen}>
        <DialogContent className="bg-white max-w-lg border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Create New Customization</DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Set up a new customization project for your platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="customization-name" className="text-sm font-medium text-slate-700">Name</Label>
              <Input
                id="customization-name"
                value={newCustomization.name}
                onChange={(e) => setNewCustomization({...newCustomization, name: e.target.value})}
                placeholder="e.g., Dark Theme Update"
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customization-description" className="text-sm font-medium text-slate-700">Description</Label>
              <Textarea
                id="customization-description"
                value={newCustomization.description}
                onChange={(e) => setNewCustomization({...newCustomization, description: e.target.value})}
                placeholder="Brief description of the customization"
                className="h-20 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customization-type" className="text-sm font-medium text-slate-700">Type</Label>
                <Select value={newCustomization.type} onValueChange={(value) => setNewCustomization({...newCustomization, type: value})}>
                  <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="theme">Theme</SelectItem>
                    <SelectItem value="component">Component</SelectItem>
                    <SelectItem value="workflow">Workflow</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customization-category" className="text-sm font-medium text-slate-700">Category</Label>
                <Select value={newCustomization.category} onValueChange={(value) => setNewCustomization({...newCustomization, category: value})}>
                  <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="ui">UI/UX</SelectItem>
                    <SelectItem value="functionality">Functionality</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsNewCustomizationOpen(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCustomization}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Customization
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
