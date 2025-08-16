
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { WidgetConfig, IntegrationType } from '../types';
import { 
  Palette, 
  Type, 
  Move, 
  Zap, 
  Eye,
  Code,
  Monitor,
  Smartphone
} from 'lucide-react';

interface AppearanceConfigTabProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const AppearanceConfigTab = ({ widgetConfig, integrationType, onConfigChange }: AppearanceConfigTabProps) => {
  const positions = [
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'center', label: 'Center' },
    { value: 'fullscreen', label: 'Fullscreen' }
  ];

  const fontFamilies = [
    { value: 'Inter', label: 'Inter (Default)' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' }
  ];

  const animationTypes = [
    { value: 'slide', label: 'Slide' },
    { value: 'fade', label: 'Fade' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'none', label: 'None' }
  ];

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    onConfigChange({ ...widgetConfig, ...updates });
  };

  const updateAppearance = (updates: Partial<WidgetConfig['appearance']>) => {
    onConfigChange({
      ...widgetConfig,
      appearance: { ...widgetConfig.appearance, ...updates }
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Colors & Theme */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Colors & Theme</h3>
            <p className="text-sm text-gray-600">Customize the color scheme and visual appearance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="primaryColor" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" />
              Primary Color
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primaryColor"
                type="color"
                value={widgetConfig.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="w-16 h-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <Input
                value={widgetConfig.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                placeholder="#3B82F6"
                className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <p className="text-xs text-gray-500">Main brand color for buttons and highlights</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="secondaryColor" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-500" />
              Secondary Color
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="secondaryColor"
                type="color"
                value={widgetConfig.appearance?.secondaryColor || '#6B7280'}
                onChange={(e) => updateAppearance({ secondaryColor: e.target.value })}
                className="w-16 h-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
              <Input
                value={widgetConfig.appearance?.secondaryColor || '#6B7280'}
                onChange={(e) => updateAppearance({ secondaryColor: e.target.value })}
                placeholder="#6B7280"
                className="flex-1 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <p className="text-xs text-gray-500">Secondary color for borders and accents</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="backgroundColor" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-purple-500" />
              Background Color
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="backgroundColor"
                type="color"
                value={widgetConfig.appearance?.backgroundColor || '#FFFFFF'}
                onChange={(e) => updateAppearance({ backgroundColor: e.target.value })}
                className="w-16 h-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <Input
                value={widgetConfig.appearance?.backgroundColor || '#FFFFFF'}
                onChange={(e) => updateAppearance({ backgroundColor: e.target.value })}
                placeholder="#FFFFFF"
                className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <p className="text-xs text-gray-500">Background color for the widget</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="textColor" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-pink-500" />
              Text Color
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="textColor"
                type="color"
                value={widgetConfig.appearance?.textColor || '#1F2937'}
                onChange={(e) => updateAppearance({ textColor: e.target.value })}
                className="w-16 h-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
              <Input
                value={widgetConfig.appearance?.textColor || '#1F2937'}
                onChange={(e) => updateAppearance({ textColor: e.target.value })}
                placeholder="#1F2937"
                className="flex-1 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <p className="text-xs text-gray-500">Primary text color for content</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-500" />
              Dark Mode Support
            </Label>
            <p className="text-xs text-gray-500">Automatically adapt to user's dark mode preference</p>
          </div>
          <Switch
            checked={widgetConfig.appearance?.darkModeSupport || false}
            onCheckedChange={(checked) => updateAppearance({ darkModeSupport: checked })}
          />
        </div>
      </div>

      {/* Layout & Position */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Move className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Layout & Position</h3>
            <p className="text-sm text-gray-600">Configure the widget's position and layout behavior</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="position" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Move className="w-4 h-4 text-blue-500" />
              Widget Position
            </Label>
            <Select value={widgetConfig.position} onValueChange={(value) => updateConfig({ position: value })}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Where the widget appears on the page</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="width" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                Widget Width (px)
              </Label>
              <Slider
                value={[widgetConfig.appearance?.width || 350]}
                onValueChange={(value) => updateAppearance({ width: value[0] })}
                max={800}
                min={200}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>200px</span>
                <span>{widgetConfig.appearance?.width || 350}px</span>
                <span>800px</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="height" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-indigo-500" />
                Widget Height (px)
              </Label>
              <Slider
                value={[widgetConfig.appearance?.height || 500]}
                onValueChange={(value) => updateAppearance({ height: value[0] })}
                max={800}
                min={300}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>300px</span>
                <span>{widgetConfig.appearance?.height || 500}px</span>
                <span>800px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typography & Styling */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Type className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Typography & Styling</h3>
            <p className="text-sm text-gray-600">Customize fonts, sizes, and visual effects</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="fontFamily" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-green-500" />
              Font Family
            </Label>
            <Select value={widgetConfig.appearance?.fontFamily || 'Inter'} onValueChange={(value) => updateAppearance({ fontFamily: value })}>
              <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Primary font for all text content</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="fontSize" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-500" />
              Font Size
            </Label>
            <Select value={widgetConfig.appearance?.fontSize || 'medium'} onValueChange={(value) => updateAppearance({ fontSize: value })}>
              <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Base font size for text content</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-green-500" />
                Bold Headings
              </Label>
              <p className="text-xs text-gray-500">Make headings bold for better hierarchy</p>
            </div>
            <Switch
              checked={widgetConfig.appearance?.boldHeadings || false}
              onCheckedChange={(checked) => updateAppearance({ boldHeadings: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                Rounded Corners
              </Label>
              <p className="text-xs text-gray-500">Add rounded corners to elements</p>
            </div>
            <Switch
              checked={widgetConfig.appearance?.roundedCorners || false}
              onCheckedChange={(checked) => updateAppearance({ roundedCorners: checked })}
            />
          </div>
        </div>
      </div>

      {/* Animations & Effects */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Animations & Effects</h3>
            <p className="text-sm text-gray-600">Configure animations and visual effects</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="animationType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Animation Type
            </Label>
            <Select value={widgetConfig.appearance?.animationType || 'slide'} onValueChange={(value) => updateAppearance({ animationType: value })}>
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Select animation" />
              </SelectTrigger>
              <SelectContent>
                {animationTypes.map((anim) => (
                  <SelectItem key={anim.value} value={anim.value}>
                    {anim.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Animation style for widget interactions</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="animationDuration" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              Animation Duration
            </Label>
            <Select value={widgetConfig.appearance?.animationDuration || 'normal'} onValueChange={(value) => updateAppearance({ animationDuration: value })}>
              <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast (0.2s)</SelectItem>
                <SelectItem value="normal">Normal (0.3s)</SelectItem>
                <SelectItem value="slow">Slow (0.5s)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Speed of animation transitions</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              Shadow Effects
            </Label>
            <p className="text-xs text-gray-500">Add shadow effects for depth</p>
          </div>
          <Switch
            checked={widgetConfig.appearance?.shadowEffects || false}
            onCheckedChange={(checked) => updateAppearance({ shadowEffects: checked })}
          />
        </div>
      </div>

      {/* Custom CSS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Custom CSS
          </CardTitle>
          <CardDescription>
            Add custom CSS for advanced styling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customCSS">Custom CSS</Label>
            <Textarea
              id="customCSS"
              value={widgetConfig.customCSS || ''}
              onChange={(e) => updateConfig({ customCSS: e.target.value })}
              placeholder="/* Add your custom CSS here */&#10;.trichat-widget {&#10;  /* Your styles */&#10;}"
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Use CSS selectors like .trichat-widget, .trichat-message, .trichat-button
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
