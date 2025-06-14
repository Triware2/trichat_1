
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WidgetConfig, IntegrationType } from './types';

interface CodeGenerationPanelProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
}

export const CodeGenerationPanel = ({ widgetConfig, integrationType }: CodeGenerationPanelProps) => {
  const { toast } = useToast();

  const generateWidgetCode = () => {
    return `<!-- TriChat Widget Integration -->
<script>
  (function() {
    window.TriChatConfig = {
      title: "${widgetConfig.title}",
      subtitle: "${widgetConfig.subtitle}",
      primaryColor: "${widgetConfig.primaryColor}",
      position: "${widgetConfig.position}",
      welcomeMessage: "${widgetConfig.welcomeMessage}",
      placeholder: "${widgetConfig.placeholder}",
      showAvatar: ${widgetConfig.showAvatar},
      autoOpen: ${widgetConfig.autoOpen},
      department: "${widgetConfig.department}",
      apiKey: "YOUR_API_KEY_HERE"
    };
    
    var script = document.createElement('script');
    script.src = 'https://widget.trichat.com/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>

<!-- Optional: Custom CSS -->
<style>
  .trichat-widget {
    --primary-color: ${widgetConfig.primaryColor};
    --widget-position: ${widgetConfig.position};
  }
</style>`;
  };

  const generateButtonCode = () => {
    return `<!-- TriChat Button Integration -->
<script>
  (function() {
    window.TriChatConfig = {
      title: "${widgetConfig.title}",
      subtitle: "${widgetConfig.subtitle}",
      primaryColor: "${widgetConfig.primaryColor}",
      welcomeMessage: "${widgetConfig.welcomeMessage}",
      placeholder: "${widgetConfig.placeholder}",
      showAvatar: ${widgetConfig.showAvatar},
      department: "${widgetConfig.department}",
      apiKey: "YOUR_API_KEY_HERE",
      mode: "button"
    };
    
    // Load TriChat script
    var script = document.createElement('script');
    script.src = 'https://widget.trichat.com/widget.js';
    script.async = true;
    script.onload = function() {
      // Initialize button integration
      TriChat.initButtonMode('${widgetConfig.buttonSelector}');
    };
    document.head.appendChild(script);
  })();
</script>

<!-- Add this to your existing help button or create a new one -->
<button id="help-button" class="trichat-trigger">
  ${widgetConfig.buttonText}
</button>

<!-- Optional: Custom CSS -->
<style>
  .trichat-modal {
    --primary-color: ${widgetConfig.primaryColor};
  }
  
  .trichat-trigger {
    /* Style your button as needed */
    background-color: ${widgetConfig.primaryColor};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .trichat-trigger:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
</style>`;
  };

  const copyToClipboard = () => {
    const code = integrationType === 'widget' ? generateWidgetCode() : generateButtonCode();
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `The ${integrationType} integration code has been copied to your clipboard.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Generated Code
        </CardTitle>
        <CardDescription>
          Copy this code and paste it into your website's HTML
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">Ready to use</Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {integrationType === 'widget' ? 'Widget' : 'Button'} Integration
              </Badge>
            </div>
            <Button onClick={copyToClipboard} className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy Code
            </Button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>{integrationType === 'widget' ? generateWidgetCode() : generateButtonCode()}</code>
            </pre>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Installation Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Copy the code above</li>
              <li>Paste it before the closing &lt;/body&gt; tag in your HTML</li>
              <li>Replace "YOUR_API_KEY_HERE" with your actual API key</li>
              {integrationType === 'button' && (
                <li>Make sure your button element matches the CSS selector specified</li>
              )}
              <li>The {integrationType} will automatically work on your website</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
