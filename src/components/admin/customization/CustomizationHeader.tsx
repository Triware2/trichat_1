
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Code, Plus } from 'lucide-react';

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Customization Studio
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Phase 3</Badge>
            {isDeveloperMode && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Developer Mode
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Enterprise-grade customization platform with code editor, sandbox environments, and API management
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isDeveloperMode ? "default" : "outline"} 
            size="sm"
            onClick={handleDeveloperMode}
            className={isDeveloperMode ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Code className="w-4 h-4 mr-2" />
            Developer Mode
          </Button>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setIsNewCustomizationOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Customization
          </Button>
        </div>
      </div>

      <Dialog open={isNewCustomizationOpen} onOpenChange={setIsNewCustomizationOpen}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Customization</DialogTitle>
            <DialogDescription>
              Set up a new customization project for your platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customization-name">Name</Label>
              <Input
                id="customization-name"
                value={newCustomization.name}
                onChange={(e) => setNewCustomization({...newCustomization, name: e.target.value})}
                placeholder="e.g., Dark Theme Update"
              />
            </div>
            
            <div>
              <Label htmlFor="customization-description">Description</Label>
              <Textarea
                id="customization-description"
                value={newCustomization.description}
                onChange={(e) => setNewCustomization({...newCustomization, description: e.target.value})}
                placeholder="Brief description of the customization"
                className="h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customization-type">Type</Label>
                <Select value={newCustomization.type} onValueChange={(value) => setNewCustomization({...newCustomization, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theme">Theme</SelectItem>
                    <SelectItem value="component">Component</SelectItem>
                    <SelectItem value="workflow">Workflow</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customization-category">Category</Label>
                <Select value={newCustomization.category} onValueChange={(value) => setNewCustomization({...newCustomization, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ui">UI/UX</SelectItem>
                    <SelectItem value="functionality">Functionality</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateCustomization} className="flex-1">
                Create Customization
              </Button>
              <Button variant="outline" onClick={() => setIsNewCustomizationOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
