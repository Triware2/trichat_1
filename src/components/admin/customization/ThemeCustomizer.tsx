import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  RotateCcw,
  Download,
  Sparkles
} from 'lucide-react';
import { useEffect } from 'react';
import { customizationService, ThemeConfig } from '@/services/customizationService';

export const ThemeCustomizer = () => {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#64748b');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [themeId, setThemeId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>(undefined);

  const predefinedThemes = [
    { id: 'default', name: 'Corporate Blue', primary: '#3b82f6', secondary: '#64748b' },
    { id: 'emerald', name: 'Emerald Green', primary: '#10b981', secondary: '#6b7280' },
    { id: 'purple', name: 'Royal Purple', primary: '#8b5cf6', secondary: '#6b7280' },
    { id: 'orange', name: 'Vibrant Orange', primary: '#f59e0b', secondary: '#6b7280' },
    { id: 'rose', name: 'Modern Rose', primary: '#f43f5e', secondary: '#6b7280' }
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 'Source Sans Pro'
  ];

  useEffect(() => {
    const load = async () => {
      const themes = await customizationService.listThemes({ from: 0, to: 0 });
      if (themes && themes.length > 0) {
        const t: ThemeConfig = themes[0];
        setThemeId(t.id);
        setSelectedTheme('custom');
        setPrimaryColor(t.primary_color || '#3b82f6');
        setSecondaryColor(t.secondary_color || '#64748b');
        setFontFamily(t.font_family || 'Inter');
        setLogoUrl((t as any).logo_url);
        setFaviconUrl((t as any).favicon_url);
      }
    };
    load();
  }, []);

  const handleThemeSelect = (themeId: string) => {
    const theme = predefinedThemes.find(t => t.id === themeId);
    if (theme) {
      setSelectedTheme(themeId);
      setPrimaryColor(theme.primary);
      setSecondaryColor(theme.secondary);
    }
  };

  const handleSaveTheme = async () => {
    setLoading(true);
    const saved = await customizationService.saveTheme({
      id: themeId,
      name: selectedTheme,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      font_family: fontFamily,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
      ...(faviconUrl ? { favicon_url: faviconUrl } : {})
    });
    setLoading(false);
    if (saved?.id) setThemeId(saved.id);
    toast({
      title: 'Theme Saved',
      description: 'Your theme customizations have been applied successfully.',
    });
  };

  const handleResetTheme = () => {
    setPrimaryColor('#3b82f6');
    setSecondaryColor('#64748b');
    setFontFamily('Inter');
    setSelectedTheme('default');
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default settings.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Theme & Branding</h2>
          <p className="text-gray-600">Customize the visual appearance of your platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleResetTheme}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleSaveTheme} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Predefined Themes
            </CardTitle>
            <CardDescription>
              Choose from our curated collection of professional themes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {predefinedThemes.map((theme) => (
              <div
                key={theme.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{theme.name}</p>
                    <div className="flex gap-2 mt-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.secondary }}
                      ></div>
                    </div>
                  </div>
                  {selectedTheme === theme.id && (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Color Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Fine-tune your brand colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {fontOptions.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Brand Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Assets</CardTitle>
            <CardDescription>
              Upload your company logos and assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Main Logo</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag & drop your logo here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 2MB
                </p>
                <input type="file" accept="image/*" className="hidden" id="brand-logo-input" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await customizationService.uploadBrandAsset(file, 'logos');
                  if (url) setLogoUrl(url);
                  toast({ title: url ? 'Logo uploaded' : 'Upload failed', description: url || 'Please try again.', variant: url ? 'default' : 'destructive' });
                }} />
                <Button variant="outline" size="sm" className="mt-3" onClick={() => document.getElementById('brand-logo-input')?.click()}>Upload Logo</Button>
                {logoUrl && (
                  <div className="mt-3 flex items-center justify-center">
                    <img src={logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Favicon</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-600">
                  Upload favicon (ICO, PNG 32x32)
                </p>
                <input type="file" accept="image/*,.ico" className="hidden" id="brand-favicon-input" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await customizationService.uploadBrandAsset(file, 'favicons');
                  if (url) setFaviconUrl(url);
                  toast({ title: url ? 'Favicon uploaded' : 'Upload failed', description: url || 'Please try again.', variant: url ? 'default' : 'destructive' });
                }} />
                <Button variant="outline" size="sm" className="mt-2" onClick={() => document.getElementById('brand-favicon-input')?.click()}>Upload Favicon</Button>
                {faviconUrl && (
                  <div className="mt-2 flex items-center justify-center">
                    <img src={faviconUrl} alt="Favicon Preview" className="h-6 w-6" />
                  </div>
                )}
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Theme
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your theme looks across different components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button Preview */}
            <div className="space-y-3">
              <h4 className="font-medium">Buttons</h4>
              <div className="flex gap-2">
                <Button style={{ backgroundColor: primaryColor }} className="text-white">
                  Primary Button
                </Button>
                <Button variant="outline" style={{ borderColor: primaryColor, color: primaryColor }}>
                  Secondary Button
                </Button>
              </div>
            </div>

            {/* Card Preview */}
            <div className="space-y-3">
              <h4 className="font-medium">Cards</h4>
              <Card className="p-4" style={{ fontFamily }}>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <span className="font-medium">Sample Card</span>
                </div>
                <p className="text-sm text-gray-600">
                  This is how your content will look with the selected theme.
                </p>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
