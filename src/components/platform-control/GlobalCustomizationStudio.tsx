
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Layout, 
  Code, 
  Wand2, 
  Eye, 
  Download,
  Upload,
  Brush,
  Type,
  Image,
  Monitor
} from 'lucide-react';

export const GlobalCustomizationStudio = () => {
  const [theme, setTheme] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: 8,
    fontFamily: 'Inter',
    fontSize: 14
  });

  const [branding, setBranding] = useState({
    logoUrl: '',
    companyName: 'Trichat',
    tagline: 'Enterprise Customer Experience Platform',
    favicon: '',
    customCSS: '',
    customJS: ''
  });

  const [layout, setLayout] = useState({
    headerHeight: 64,
    sidebarWidth: 280,
    chatWindowWidth: 400,
    showBranding: true,
    showFooter: true,
    compactMode: false
  });

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Global Customization Studio</h1>
          </div>
          <p className="text-gray-600 ml-12">Design and customize the entire platform experience</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Theme
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Theme
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Colors & Themes</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brush className="w-5 h-5 text-pink-600" />
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                        className="w-12 h-10 rounded border"
                      />
                      <Input 
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryColor}
                        onChange={(e) => setTheme({...theme, secondaryColor: e.target.value})}
                        className="w-12 h-10 rounded border"
                      />
                      <Input 
                        value={theme.secondaryColor}
                        onChange={(e) => setTheme({...theme, secondaryColor: e.target.value})}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                        className="w-12 h-10 rounded border"
                      />
                      <Input 
                        value={theme.accentColor}
                        onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.backgroundColor}
                        onChange={(e) => setTheme({...theme, backgroundColor: e.target.value})}
                        className="w-12 h-10 rounded border"
                      />
                      <Input 
                        value={theme.backgroundColor}
                        onChange={(e) => setTheme({...theme, backgroundColor: e.target.value})}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Preset Themes</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Ocean Blue', colors: ['#3b82f6', '#1e40af', '#06b6d4'] },
                      { name: 'Forest Green', colors: ['#10b981', '#059669', '#34d399'] },
                      { name: 'Sunset Orange', colors: ['#f97316', '#ea580c', '#fb923c'] },
                      { name: 'Purple Dream', colors: ['#8b5cf6', '#7c3aed', '#a78bfa'] },
                      { name: 'Rose Gold', colors: ['#f43f5e', '#e11d48', '#fb7185'] },
                      { name: 'Midnight Dark', colors: ['#1f2937', '#374151', '#6b7280'] }
                    ].map((preset) => (
                      <div key={preset.name} className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex gap-1 mb-2">
                          {preset.colors.map((color, i) => (
                            <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                        <span className="text-xs font-medium">{preset.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-4" style={{ backgroundColor: theme.backgroundColor }}>
                  <div className="flex items-center justify-between p-4 rounded" style={{ backgroundColor: theme.primaryColor }}>
                    <span className="text-white font-semibold">Header</span>
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded border" style={{ borderColor: theme.secondaryColor }}>
                      <div className="text-sm font-medium" style={{ color: theme.textColor }}>Card Title</div>
                      <div className="text-xs mt-1" style={{ color: theme.secondaryColor }}>Description text</div>
                    </div>
                    <div className="p-3 rounded" style={{ backgroundColor: theme.accentColor + '20' }}>
                      <div className="text-sm font-medium" style={{ color: theme.accentColor }}>Highlighted Card</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="px-3 py-1 rounded text-white text-sm" style={{ backgroundColor: theme.primaryColor }}>
                      Primary Button
                    </div>
                    <div className="px-3 py-1 rounded text-sm border" style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}>
                      Secondary
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-blue-600" />
                  Brand Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <Input 
                    value={branding.companyName}
                    onChange={(e) => setBranding({...branding, companyName: e.target.value})}
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <Input 
                    value={branding.tagline}
                    onChange={(e) => setBranding({...branding, tagline: e.target.value})}
                    placeholder="Your company tagline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <div className="flex gap-2">
                    <Input 
                      value={branding.logoUrl}
                      onChange={(e) => setBranding({...branding, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                    />
                    <Button variant="outline">Upload</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                  <div className="flex gap-2">
                    <Input 
                      value={branding.favicon}
                      onChange={(e) => setBranding({...branding, favicon: e.target.value})}
                      placeholder="https://example.com/favicon.ico"
                    />
                    <Button variant="outline">Upload</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" className="w-10 h-10 rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <Image className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{branding.companyName || 'Company Name'}</h3>
                      <p className="text-sm text-gray-600">{branding.tagline || 'Company tagline'}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 pt-4 border-t">
                    This is how your branding will appear across the platform
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-green-600" />
                Layout Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Dimensions</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Height: {layout.headerHeight}px
                    </label>
                    <input
                      type="range"
                      min="48"
                      max="120"
                      value={layout.headerHeight}
                      onChange={(e) => setLayout({...layout, headerHeight: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sidebar Width: {layout.sidebarWidth}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="400"
                      value={layout.sidebarWidth}
                      onChange={(e) => setLayout({...layout, sidebarWidth: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chat Window Width: {layout.chatWindowWidth}px
                    </label>
                    <input
                      type="range"
                      min="300"
                      max="600"
                      value={layout.chatWindowWidth}
                      onChange={(e) => setLayout({...layout, chatWindowWidth: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Display Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Show Branding</label>
                    <Switch
                      checked={layout.showBranding}
                      onCheckedChange={(checked) => setLayout({...layout, showBranding: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Show Footer</label>
                    <Switch
                      checked={layout.showFooter}
                      onCheckedChange={(checked) => setLayout({...layout, showFooter: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Compact Mode</label>
                    <Switch
                      checked={layout.compactMode}
                      onCheckedChange={(checked) => setLayout({...layout, compactMode: checked})}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Layout Preview</h3>
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <div 
                      className="bg-blue-200 rounded mb-1"
                      style={{ height: `${Math.max(layout.headerHeight / 8, 6)}px` }}
                    />
                    <div className="flex gap-1">
                      <div 
                        className="bg-gray-200 rounded"
                        style={{ 
                          width: `${layout.sidebarWidth / 8}px`,
                          height: '60px'
                        }}
                      />
                      <div className="flex-1 bg-white rounded" />
                      <div 
                        className="bg-green-200 rounded"
                        style={{ 
                          width: `${layout.chatWindowWidth / 8}px`,
                          height: '60px'
                        }}
                      />
                    </div>
                    {layout.showFooter && (
                      <div className="bg-gray-200 rounded mt-1 h-2" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-600" />
                Typography Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <select 
                      value={theme.fontFamily}
                      onChange={(e) => setTheme({...theme, fontFamily: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Source Sans Pro">Source Sans Pro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Font Size: {theme.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="18"
                      value={theme.fontSize}
                      onChange={(e) => setTheme({...theme, fontSize: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Radius: {theme.borderRadius}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={theme.borderRadius}
                      onChange={(e) => setTheme({...theme, borderRadius: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Typography Preview</h3>
                  <div 
                    className="space-y-3 p-4 border rounded"
                    style={{ 
                      fontFamily: theme.fontFamily,
                      fontSize: `${theme.fontSize}px`,
                      color: theme.textColor
                    }}
                  >
                    <h1 className="text-2xl font-bold">Heading 1</h1>
                    <h2 className="text-xl font-semibold">Heading 2</h2>
                    <h3 className="text-lg font-medium">Heading 3</h3>
                    <p>Regular paragraph text with normal weight and spacing.</p>
                    <p className="text-sm" style={{ color: theme.secondaryColor }}>
                      Secondary text with smaller size and muted color.
                    </p>
                    <div 
                      className="px-3 py-1 bg-blue-500 text-white inline-block"
                      style={{ borderRadius: `${theme.borderRadius}px` }}
                    >
                      Button Example
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-gray-600" />
                  Custom CSS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={branding.customCSS}
                  onChange={(e) => setBranding({...branding, customCSS: e.target.value})}
                  placeholder="/* Add your custom CSS here */
.custom-button {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 8px;
}"
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button className="mt-4">Apply CSS</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-yellow-600" />
                  Custom JavaScript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={branding.customJS}
                  onChange={(e) => setBranding({...branding, customJS: e.target.value})}
                  placeholder="// Add your custom JavaScript here
document.addEventListener('DOMContentLoaded', function() {
  // Custom functionality
  console.log('Custom JS loaded');
});"
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button className="mt-4">Apply JavaScript</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
