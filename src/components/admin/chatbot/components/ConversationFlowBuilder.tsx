import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  MarkerType,
  NodeTypes,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom styles for better handle visibility
const handleStyle = {
  width: '12px',
  height: '12px',
  border: '2px solid white',
  borderRadius: '50%',
  cursor: 'crosshair',
  transition: 'all 0.2s ease',
};

const handleHoverStyle = {
  ...handleStyle,
  transform: 'scale(1.2)',
  boxShadow: '0 0 8px rgba(0,0,0,0.3)',
};
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Workflow, Save, RefreshCw, Settings, Trash2, Copy, 
  Play, Pause, RotateCcw, Download, Upload, Star, Clock,
  MessageSquare, Users, CheckCircle, AlertCircle, ArrowRight,
  Zap, Brain, Target, Shield, TestTube, BarChart3, GripVertical, ChevronDown, Lightbulb
} from 'lucide-react';
import { 
  ConversationFlow, FlowNode, FlowEdge, ValidationRule, Condition, 
  Action, PersonalizationRule, ComplianceCheck, ErrorHandling,
  chatbotService 
} from '@/services/chatbotService';

// Custom Node Components
const MessageNode = ({ data }: { data: any }) => (
  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle 
      type="target" 
      position={Position.Top} 
      style={{ ...handleStyle, backgroundColor: '#3b82f6' }}
      className="hover:scale-110 transition-transform"
    />
    <div className="flex items-center gap-2 mb-2">
      <MessageSquare className="w-4 h-4 text-blue-600" />
      <span className="font-semibold text-blue-900">Message</span>
    </div>
    <div className="text-sm text-blue-800">{data.label}</div>
    {data.content && (
      <div className="text-xs text-blue-600 mt-1 truncate">{data.content}</div>
    )}
    <Handle 
      type="source" 
      position={Position.Bottom} 
      style={{ ...handleStyle, backgroundColor: '#3b82f6' }}
      className="hover:scale-110 transition-transform"
    />
  </div>
);

const ConditionNode = ({ data }: { data: any }) => (
  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <Target className="w-4 h-4 text-orange-600" />
      <span className="font-semibold text-orange-900">Condition</span>
    </div>
    <div className="text-sm text-orange-800">{data.label}</div>
    {data.conditions && data.conditions.length > 0 && (
      <div className="text-xs text-orange-600 mt-1">
        {data.conditions.length} condition{data.conditions.length > 1 ? 's' : ''}
      </div>
    )}
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-400 border-2 border-white" />
  </div>
);

const ActionNode = ({ data }: { data: any }) => (
  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-green-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <Zap className="w-4 h-4 text-green-600" />
      <span className="font-semibold text-green-900">Action</span>
    </div>
    <div className="text-sm text-green-800">{data.label}</div>
    {data.actions && data.actions.length > 0 && (
      <div className="text-xs text-green-600 mt-1">
        {data.actions.length} action{data.actions.length > 1 ? 's' : ''}
      </div>
    )}
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-400 border-2 border-white" />
  </div>
);

const HumanHandoffNode = ({ data }: { data: any }) => (
  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <Users className="w-4 h-4 text-purple-600" />
      <span className="font-semibold text-purple-900">Human Handoff</span>
    </div>
    <div className="text-sm text-purple-800">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-400 border-2 border-white" />
  </div>
);

const InputValidationNode = ({ data }: { data: any }) => (
  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-yellow-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <Shield className="w-4 h-4 text-yellow-600" />
      <span className="font-semibold text-yellow-900">Validation</span>
    </div>
    <div className="text-sm text-yellow-800">{data.label}</div>
    {data.validation_rules && data.validation_rules.length > 0 && (
      <div className="text-xs text-yellow-600 mt-1">
        {data.validation_rules.length} rule{data.validation_rules.length > 1 ? 's' : ''}
      </div>
    )}
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-yellow-400 border-2 border-white" />
  </div>
);

const IntentDetectionNode = ({ data }: { data: any }) => (
  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <Brain className="w-4 h-4 text-indigo-600" />
      <span className="font-semibold text-indigo-900">Intent Detection</span>
    </div>
    <div className="text-sm text-indigo-800">{data.label}</div>
    {data.intent_patterns && data.intent_patterns.length > 0 && (
      <div className="text-xs text-indigo-600 mt-1">
        {data.intent_patterns.length} pattern{data.intent_patterns.length > 1 ? 's' : ''}
      </div>
    )}
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-400 border-2 border-white" />
  </div>
);

const PersonalizationNode = ({ data }: { data: any }) => (
  <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-pink-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <Star className="w-4 h-4 text-pink-600" />
      <span className="font-semibold text-pink-900">Personalization</span>
    </div>
    <div className="text-sm text-pink-800">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-pink-400 border-2 border-white" />
  </div>
);

const ComplianceNode = ({ data }: { data: any }) => (
  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <AlertCircle className="w-4 h-4 text-red-600" />
      <span className="font-semibold text-red-900">Compliance</span>
    </div>
    <div className="text-sm text-red-800">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-red-400 border-2 border-white" />
  </div>
);

const StartNode = ({ data }: { data: any }) => (
  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3 min-w-[150px] relative">
    <div className="flex items-center gap-2 mb-2">
      <Play className="w-4 h-4 text-emerald-600" />
      <span className="font-semibold text-emerald-900">Start</span>
    </div>
    <div className="text-sm text-emerald-800">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-emerald-400 border-2 border-white" />
  </div>
);

const EndNode = ({ data }: { data: any }) => (
  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 min-w-[150px] relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400 border-2 border-white" />
    <div className="flex items-center gap-2 mb-2">
      <CheckCircle className="w-4 h-4 text-gray-600" />
      <span className="font-semibold text-gray-900">End</span>
    </div>
    <div className="text-sm text-gray-800">{data.label}</div>
  </div>
);

const nodeTypes: NodeTypes = {
  start: StartNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  human_handoff: HumanHandoffNode,
  input_validation: InputValidationNode,
  intent_detection: IntentDetectionNode,
  personalization: PersonalizationNode,
  compliance_check: ComplianceNode,
  end: EndNode,
};

const nodeTypeOptions = [
  { value: 'start', label: 'Start', icon: Play },
  { value: 'message', label: 'Message', icon: MessageSquare },
  { value: 'condition', label: 'Condition', icon: Target },
  { value: 'action', label: 'Action', icon: Zap },
  { value: 'human_handoff', label: 'Human Handoff', icon: Users },
  { value: 'input_validation', label: 'Input Validation', icon: Shield },
  { value: 'intent_detection', label: 'Intent Detection', icon: Brain },
  { value: 'personalization', label: 'Personalization', icon: Star },
  { value: 'compliance_check', label: 'Compliance Check', icon: AlertCircle },
  { value: 'end', label: 'End', icon: CheckCircle }
];

interface ConversationFlowBuilderProps {
  chatbotId?: string;
  selectedFlowId?: string;
  onFlowSaved?: (flow: ConversationFlow) => void;
  onBotSelected?: (botId: string) => void;
}

export const ConversationFlowBuilder: React.FC<ConversationFlowBuilderProps> = ({
  chatbotId,
  selectedFlowId,
  onFlowSaved,
  onBotSelected
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [flows, setFlows] = useState<ConversationFlow[]>([]);
  const [currentFlow, setCurrentFlow] = useState<ConversationFlow | null>(null);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [availableBots, setAvailableBots] = useState<any[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>(chatbotId || '');
  const [flowHeight, setFlowHeight] = useState(600);
  const [isDragging, setIsDragging] = useState(false);
  const [initialDragY, setInitialDragY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(800);
  const [showTips, setShowTips] = useState(false);
  const nodeId = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load available bots
  useEffect(() => {
    loadAvailableBots();
  }, []);

  // Load flows for the chatbot
  useEffect(() => {
    if (selectedBotId) {
      loadFlows();
    }
  }, [selectedBotId]);

  // Load specific flow
  useEffect(() => {
    if (selectedFlowId) {
      loadFlow(selectedFlowId);
    }
  }, [selectedFlowId]);

  const loadAvailableBots = async () => {
    try {
      const bots = await chatbotService.getChatbots();
      setAvailableBots(bots);
      if (bots.length > 0 && !selectedBotId) {
        setSelectedBotId(bots[0].id);
        onBotSelected?.(bots[0].id);
      }
    } catch (error) {
      console.error('Error loading bots:', error);
    }
  };

  const loadFlows = async () => {
    if (!selectedBotId) return;
    
    setIsLoading(true);
    try {
      const flowsData = await chatbotService.getConversationFlows(selectedBotId);
      
      // Normalize flows data to ensure proper metadata structure
      const normalizedFlows = flowsData.map((flow: any) => ({
        ...flow,
        metadata: flow.metadata || {
          created_by: (flow as any).created_by || 'unknown',
          created_at: (flow as any).created_at || new Date().toISOString(),
          updated_at: (flow as any).updated_at || new Date().toISOString(),
          is_active: (flow as any).is_active !== undefined ? (flow as any).is_active : true,
          is_published: (flow as any).is_published !== undefined ? (flow as any).is_published : false
        }
      }));
      
      setFlows(normalizedFlows);
    } catch (error) {
      console.error('Error loading flows:', error);
      setFlows([]); // Set empty array on error to prevent crashes
    } finally {
      setIsLoading(false);
    }
  };

  const loadFlow = async (flowId: string) => {
    setIsLoading(true);
    try {
      const flow = await chatbotService.getConversationFlow(flowId);
      if (flow) {
        // Ensure flow has proper metadata structure
        const normalizedFlow: ConversationFlow = {
          ...flow,
          metadata: flow.metadata || {
            created_by: (flow as any).created_by || 'unknown',
            created_at: (flow as any).created_at || new Date().toISOString(),
            updated_at: (flow as any).updated_at || new Date().toISOString(),
            is_active: (flow as any).is_active !== undefined ? (flow as any).is_active : true,
            is_published: (flow as any).is_published !== undefined ? (flow as any).is_published : false
          }
        };
        
        setCurrentFlow(normalizedFlow);
        setFlowName(flow.name);
        setFlowDescription(flow.description || '');
        setNodes(flow.nodes as Node[]);
        setEdges(flow.edges as Edge[]);
        setValidationErrors([]);
      }
    } catch (error) {
      console.error('Error loading flow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = useCallback((params: Edge | Connection) => {
    const newEdge = {
      ...params,
      id: `edge_${Date.now()}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      type: 'default',
      style: { stroke: '#2563eb', strokeWidth: 2 }
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const handleBotSelection = (botId: string) => {
    setSelectedBotId(botId);
    onBotSelected?.(botId);
    // Clear current flow when switching bots
    setCurrentFlow(null);
    setNodes([]);
    setEdges([]);
    setFlowName('');
    setFlowDescription('');
  };

  const addNode = (type: FlowNode['type']) => {
    const id = `node_${nodeId.current++}`;
    const newNode: FlowNode = {
      id,
      type,
      position: { x: 250, y: 150 + 60 * (nodes.length) },
      data: {
        label: type === 'start' ? 'Start' : type === 'end' ? 'End' : `New ${type.replace('_', ' ')}`,
        content: '',
        validation_rules: [],
        conditions: [],
        actions: [],
        intent_patterns: [],
        context_variables: [],
        personalization_rules: [],
        feedback_questions: [],
        compliance_checks: [],
        error_handling: {
          retry_count: 3,
          retry_delay: 1000,
          fallback_action: {
            id: `fallback_${id}`,
            type: 'send_message',
            data: { message: 'An error occurred. Please try again.' }
          },
          user_message: 'Something went wrong. Please try again.',
          log_level: 'error'
        }
      }
    };

    setNodes((nds) => [...nds, newNode as Node]);
    setSelectedNode(newNode);
    setShowNodeEditor(true);
  };

  const deleteNode = () => {
    if (selectedNode && selectedNode.type !== 'start') {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
      setShowNodeEditor(false);
    }
  };

  const updateNode = (updates: Partial<FlowNode>) => {
    if (selectedNode) {
      const updatedNode = { ...selectedNode, ...updates };
      setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? updatedNode as Node : n));
      setSelectedNode(updatedNode);
    }
  };

  const saveFlow = async () => {
    if (!selectedBotId) {
      setValidationErrors(['Please select a chatbot first']);
      return;
    }

    if (!flowName.trim()) {
      setValidationErrors(['Flow name is required']);
      return;
    }

    // Run validation before saving
    if (!validateFlow()) {
      return;
    }

    setIsLoading(true);
    try {
      const flowData: Omit<ConversationFlow, 'id' | 'version' | 'metadata'> = {
        chatbot_id: selectedBotId,
        name: flowName,
        description: flowDescription,
        nodes: nodes as FlowNode[],
        edges: edges as FlowEdge[],
        validation_rules: {
          logical_sequence: true,
          input_validation: true,
          intent_validation: true,
          context_validation: true,
          error_handling: true,
          human_handoff: true,
          personalization: true,
          feedback_collection: true,
          compliance: true,
          consistency: true
        }
      };

      let savedFlow: ConversationFlow | null;
      
      if (currentFlow) {
        // Update existing flow
        savedFlow = await chatbotService.updateConversationFlow(
          currentFlow.id, 
          flowData, 
          'Updated flow configuration'
        );
      } else {
        // Create new flow
        savedFlow = await chatbotService.createConversationFlow(flowData);
      }

      if (savedFlow) {
        // Ensure saved flow has proper metadata structure
        const normalizedSavedFlow: ConversationFlow = {
          ...savedFlow,
          metadata: savedFlow.metadata || {
            created_by: (savedFlow as any).created_by || 'unknown',
            created_at: (savedFlow as any).created_at || new Date().toISOString(),
            updated_at: (savedFlow as any).updated_at || new Date().toISOString(),
            is_active: (savedFlow as any).is_active !== undefined ? (savedFlow as any).is_active : true,
            is_published: (savedFlow as any).is_published !== undefined ? (savedFlow as any).is_published : false
          }
        };
        
        setCurrentFlow(normalizedSavedFlow);
        setValidationErrors([]);
        onFlowSaved?.(normalizedSavedFlow);
        await loadFlows(); // Refresh flow list
      }
          } catch (error: any) {
        console.error('Error saving flow:', error);
        setValidationErrors([error.message || 'Failed to save flow']);
      } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setShowNodeEditor(false);
    setCurrentFlow(null);
    setFlowName('');
    setFlowDescription('');
    setValidationErrors([]);
  };

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node as FlowNode);
    setShowNodeEditor(true);
  };

  const validateFlow = () => {
    const errors: string[] = [];
    
    if (nodes.length === 0) {
      errors.push('Flow must have at least one node');
    }

    const startNodes = nodes.filter(n => n.type === 'start');
    const endNodes = nodes.filter(n => n.type === 'end');
    
    if (startNodes.length !== 1) {
      errors.push('Flow must have exactly one start node');
    }
    
    if (endNodes.length === 0) {
      errors.push('Flow must have at least one end node');
    }

    // Check for orphaned nodes
    const connectedNodeIds = new Set(edges.flatMap(e => [e.source, e.target]));
    const allNodeIds = new Set(nodes.map(n => n.id));
    
    for (const nodeId of allNodeIds) {
      if (nodeId !== startNodes[0]?.id && !connectedNodeIds.has(nodeId)) {
        errors.push(`Node "${nodeId}" is not connected`);
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Drag handlers for resizing flow height
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag started at:', e.clientY);
    setIsDragging(true);
    setInitialDragY(e.clientY);
    setInitialHeight(flowHeight);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Get the container's position
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerTop = containerRect.top;
    
    // Calculate height directly from mouse position relative to container
    const mouseY = e.clientY;
    const newHeight = mouseY - containerTop;
    
    // Apply constraints - allow extending to almost full page height
    const minHeight = 400;
    const maxHeight = window.innerHeight - 50; // Only 50px margin from bottom
    
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    
    console.log('Dragging - Mouse Y:', mouseY, 'Container Top:', containerTop, 'New Height:', constrainedHeight);
    setFlowHeight(constrainedHeight);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    console.log('Drag ended');
    setIsDragging(false);
  }, []);

  // Test function to set maximum height
  const setMaxHeight = () => {
    const maxHeight = window.innerHeight - 50;
    setFlowHeight(maxHeight);
    console.log('Set to max height:', maxHeight);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);



  return (
    <ReactFlowProvider>
      <div className="space-y-10 flow-container" ref={containerRef}>
        {/* Header Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Workflow className="w-5 h-5 text-blue-600" />
              </div>
              Conversation Flow Builder
            </CardTitle>
            <p className="text-slate-600">Design complex conversation flows with advanced validation and versioning</p>
          </CardHeader>
          <CardContent>
      <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100/80 text-green-700 border-green-200/50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
                <span className="text-sm text-slate-600">
                  {nodes.length} nodes • {edges.length} connections
                </span>
        </div>
              <div className="flex gap-2">
                <Button onClick={saveFlow} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <Save className="w-4 h-4 mr-1" />
                  {isLoading ? 'Saving...' : 'Save Flow'}
                </Button>
                <Button onClick={resetFlow} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button onClick={setMaxHeight} variant="outline" className="bg-green-100 text-green-700 border-green-300 hover:bg-green-200">
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Max Height
        </Button>
      </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow Management Section */}
        {selectedBotId && (
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-indigo-600" />
            </div>
                Flow Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="flowName" className="text-sm font-medium text-slate-700">
                    Flow Name *
                  </Label>
                  <Input
                    id="flowName"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    placeholder="Enter flow name"
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flowDescription" className="text-sm font-medium text-slate-700">
                    Description
                  </Label>
                  <Input
                    id="flowDescription"
                    value={flowDescription}
                    onChange={(e) => setFlowDescription(e.target.value)}
                    placeholder="Enter flow description"
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              
              {flows && flows.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-700">Existing Flows</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flows.map((flow) => (
                      <div
                        key={flow.id}
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                          currentFlow?.id === flow.id
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white/60 backdrop-blur-sm'
                        }`}
                        onClick={() => loadFlow(flow.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm text-slate-900 truncate">{flow.name}</div>
                          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            v{flow.version || 1}
                          </div>
                        </div>
                        {flow.description && (
                          <div className="text-xs text-slate-600 mb-2 line-clamp-2">{flow.description}</div>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={flow.metadata?.is_published ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {flow.metadata?.is_published ? 'Published' : 'Draft'}
            </Badge>
                          <div className="text-xs text-slate-400">
                            {flow.metadata?.updated_at ? 
                              new Date(flow.metadata.updated_at).toLocaleDateString() : 
                              'Recently updated'
                            }
          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
        </CardContent>
      </Card>
        )}

        {/* Flow Builder Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-green-600" />
    </div>
              Flow Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Nodes Section - Horizontal Row */}
            <div className="mb-6">
              <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-slate-900">Add Nodes</CardTitle>
                  <p className="text-sm text-slate-600">Start with a Start node, add your flow logic, and end with an End node</p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 pb-2 min-w-max">
                      {nodeTypeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <Button
                            key={option.value}
                            variant="outline"
                            size="sm"
                            onClick={() => addNode(option.value as FlowNode['type'])}
                            className={`flex flex-col items-center gap-2 h-20 w-24 p-2 ${
                              option.value === 'start' ? 'border-green-500 bg-green-50 hover:bg-green-100' :
                              option.value === 'end' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                              'border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{option.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Flow Building Tips - Collapsible */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <button
                      onClick={() => setShowTips(!showTips)}
                      className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors w-full"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span className="font-medium">Flow Building Tips</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${showTips ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    {showTips && (
                      <div className="mt-3 space-y-2 text-sm text-blue-700">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Always start with a Start node</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Connect nodes by dragging from handles</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>End your flow with an End node</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Use conditions to create branching logic</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Flow Canvas and Node Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Flow Canvas */}
              <div className="lg:col-span-2">
                <Card className="bg-white/60 backdrop-blur-sm border border-slate-200 relative" style={{ height: `${flowHeight}px` }}>
                  <CardContent className="p-0 h-full">
                    {/* Height indicator for debugging */}
                    {isDragging && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-2 rounded text-sm z-30 font-mono">
                        <div>Height: {flowHeight}px</div>
                        <div>Max: {window.innerHeight - 50}px</div>
                      </div>
                    )}
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      onNodeClick={(_, node) => {
                        setSelectedNode(node as FlowNode);
                        setShowNodeEditor(true);
                      }}
                      nodeTypes={nodeTypes}
                      fitView
                      className="bg-slate-50"
                    >
                      <Background />
                      <Controls />
                      <MiniMap />
                    </ReactFlow>
                  </CardContent>
                  
                  {/* Draggable Handle */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-400 via-slate-300 to-transparent cursor-ns-resize flex items-center justify-center group hover:from-slate-500 hover:via-slate-400 transition-all duration-200 z-20 border-t border-slate-300"
                    onMouseDown={handleMouseDown}
                    title="Drag to resize flow height"
                  >
                    <div className="w-16 h-2 bg-slate-600 rounded-full group-hover:bg-slate-700 transition-colors flex items-center justify-center shadow-lg">
                      <GripVertical className="w-5 h-5 text-slate-200 group-hover:text-white" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-slate-600 font-medium bg-white/90 px-2 py-1 rounded shadow-sm">
                        Drag to resize
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Node Editor */}
              <div className="lg:col-span-1">
                {showNodeEditor && selectedNode ? (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">Edit Node</h3>
                          <p className="text-sm text-slate-500 capitalize">{selectedNode.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={deleteNode} 
                        disabled={selectedNode.type === 'start'}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-50 p-2 rounded-xl gap-2 mb-6">
                          <TabsTrigger 
                            value="basic" 
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            <span className="text-sm">Basic</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="advanced" 
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            <span className="text-sm">Advanced</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="settings" 
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            <span className="text-sm">Settings</span>
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="basic" className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700">Node Label</Label>
                              <Input
                                value={selectedNode.data.label || ''}
                                onChange={(e) => updateNode({
                                  data: { ...selectedNode.data, label: e.target.value }
                                })}
                                placeholder="Enter node label"
                                className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700">Description</Label>
                              <Textarea
                                value={selectedNode.data.content || ''}
                                onChange={(e) => updateNode({
                                  data: { ...selectedNode.data, content: e.target.value }
                                })}
                                placeholder="Describe what this node does"
                                className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                rows={3}
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="advanced" className="space-y-6">
                          <div className="space-y-4">
                            {/* Node Type Specific Advanced Settings */}
                            {selectedNode.type === 'message' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Message Type</Label>
                                  <Select value={selectedNode.data.message_type || 'text'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, message_type: value }
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Text Message</SelectItem>
                                      <SelectItem value="rich_text">Rich Text</SelectItem>
                                      <SelectItem value="image">Image</SelectItem>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="file">File</SelectItem>
                                      <SelectItem value="quick_replies">Quick Replies</SelectItem>
                                      <SelectItem value="buttons">Buttons</SelectItem>
                                      <SelectItem value="carousel">Carousel</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {selectedNode.data.message_type === 'quick_replies' && (
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Quick Reply Options</Label>
                                    <div className="space-y-2">
                                      {(selectedNode.data.quick_replies || []).map((reply: string, index: number) => (
                                        <div key={index} className="flex gap-2">
                                          <Input
                                            value={reply}
                                            onChange={(e) => {
                                              const newReplies = [...(selectedNode.data.quick_replies || [])];
                                              newReplies[index] = e.target.value;
                                              updateNode({
                                                data: { ...selectedNode.data, quick_replies: newReplies }
                                              });
                                            }}
                                            placeholder="Reply option"
                                            className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                          />
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                              const newReplies = (selectedNode.data.quick_replies || []).filter((_: string, i: number) => i !== index);
                                              updateNode({
                                                data: { ...selectedNode.data, quick_replies: newReplies }
                                              });
                                            }}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const newReplies = [...(selectedNode.data.quick_replies || []), ''];
                                          updateNode({
                                            data: { ...selectedNode.data, quick_replies: newReplies }
                                          });
                                        }}
                                        className="border-slate-200 text-slate-600 hover:bg-slate-50"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add Reply
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                                                 <div className="space-y-2">
                                   <Label className="text-sm font-medium text-slate-700">Message Delay (ms)</Label>
                                   <Input
                                     type="number"
                                     value={(selectedNode.data as any).message_delay || 0}
                                     onChange={(e) => updateNode({
                                       data: { ...selectedNode.data, message_delay: parseInt(e.target.value) } as any
                                     })}
                                     placeholder="Delay before sending message"
                                     className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                   />
                                 </div>
                              </>
                            )}

                            {selectedNode.type === 'condition' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Condition Type</Label>
                                  <Select value={selectedNode.data.condition_type || 'text_match'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, condition_type: value }
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text_match">Text Match</SelectItem>
                                      <SelectItem value="regex">Regular Expression</SelectItem>
                                      <SelectItem value="intent">Intent Detection</SelectItem>
                                      <SelectItem value="entity">Entity Recognition</SelectItem>
                                      <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                                      <SelectItem value="context">Context Variable</SelectItem>
                                      <SelectItem value="custom">Custom Logic</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Condition Value</Label>
                                  <Input
                                    value={selectedNode.data.condition_value || ''}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, condition_value: e.target.value }
                                    })}
                                    placeholder="Enter condition value"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Operator</Label>
                                  <Select value={selectedNode.data.condition_operator || 'equals'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, condition_operator: value }
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="equals">Equals</SelectItem>
                                      <SelectItem value="contains">Contains</SelectItem>
                                      <SelectItem value="starts_with">Starts With</SelectItem>
                                      <SelectItem value="ends_with">Ends With</SelectItem>
                                      <SelectItem value="greater_than">Greater Than</SelectItem>
                                      <SelectItem value="less_than">Less Than</SelectItem>
                                      <SelectItem value="regex_match">Regex Match</SelectItem>
                                      <SelectItem value="not_equals">Not Equals</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Confidence Threshold</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={selectedNode.data.confidence_threshold || 0.7}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, confidence_threshold: parseFloat(e.target.value) }
                                    })}
                                    placeholder="0.0 - 1.0"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>
                              </>
                            )}

                            {selectedNode.type === 'action' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Action Type</Label>
                                  <Select value={selectedNode.data.action_type || 'send_message'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, action_type: value }
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="send_message">Send Message</SelectItem>
                                      <SelectItem value="set_variable">Set Variable</SelectItem>
                                      <SelectItem value="call_api">Call API</SelectItem>
                                      <SelectItem value="send_email">Send Email</SelectItem>
                                      <SelectItem value="create_ticket">Create Ticket</SelectItem>
                                      <SelectItem value="schedule_reminder">Schedule Reminder</SelectItem>
                                      <SelectItem value="redirect">Redirect</SelectItem>
                                      <SelectItem value="custom_script">Custom Script</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Action Data</Label>
                                  <Textarea
                                    value={selectedNode.data.action_data || ''}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, action_data: e.target.value }
                                    })}
                                    placeholder="Enter action configuration (JSON)"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    rows={4}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Retry Count</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={(selectedNode.data as any).action_retry_count || 3}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, action_retry_count: parseInt(e.target.value) } as any
                                    })}
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>
                              </>
                            )}

                            {selectedNode.type === 'human_handoff' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Handoff Type</Label>
                                  <Select value={selectedNode.data.handoff_type || 'automatic'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, handoff_type: value }
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="automatic">Automatic</SelectItem>
                                      <SelectItem value="manual">Manual</SelectItem>
                                      <SelectItem value="scheduled">Scheduled</SelectItem>
                                      <SelectItem value="priority_based">Priority Based</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Handoff Message</Label>
                                  <Textarea
                                    value={selectedNode.data.handoff_message || ''}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, handoff_message: e.target.value }
                                    })}
                                    placeholder="Message shown to user during handoff"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    rows={3}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Department</Label>
                                  <Select value={selectedNode.data.department || 'general'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, department: value }
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="general">General Support</SelectItem>
                                      <SelectItem value="technical">Technical Support</SelectItem>
                                      <SelectItem value="sales">Sales</SelectItem>
                                      <SelectItem value="billing">Billing</SelectItem>
                                      <SelectItem value="escalation">Escalation</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Priority Level</Label>
                                  <Select value={(selectedNode.data as any).handoff_priority || 'normal'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, handoff_priority: value } as any
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}

                            {selectedNode.type === 'input_validation' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Validation Type</Label>
                                  <Select value={selectedNode.data.validation_type || 'required'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, validation_type: value }
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="required">Required Field</SelectItem>
                                      <SelectItem value="email">Email Format</SelectItem>
                                      <SelectItem value="phone">Phone Number</SelectItem>
                                      <SelectItem value="number">Numeric</SelectItem>
                                      <SelectItem value="date">Date</SelectItem>
                                      <SelectItem value="regex">Custom Regex</SelectItem>
                                      <SelectItem value="length">Length Check</SelectItem>
                                      <SelectItem value="custom">Custom Logic</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Validation Rule</Label>
                                  <Input
                                    value={selectedNode.data.validation_rule || ''}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, validation_rule: e.target.value }
                                    })}
                                    placeholder="Enter validation rule"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Error Message</Label>
                                  <Input
                                    value={selectedNode.data.error_message || ''}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, error_message: e.target.value }
                                    })}
                                    placeholder="Error message for invalid input"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Max Retries</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={(selectedNode.data as any).max_retries || 3}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, max_retries: parseInt(e.target.value) } as any
                                    })}
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>
                              </>
                            )}

                            {selectedNode.type === 'intent_detection' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Intent Patterns</Label>
                                  <div className="space-y-2">
                                    {(selectedNode.data.intent_patterns || []).map((pattern: string, index: number) => (
                                      <div key={index} className="flex gap-2">
                                        <Input
                                          value={pattern}
                                          onChange={(e) => {
                                            const newPatterns = [...(selectedNode.data.intent_patterns || [])];
                                            newPatterns[index] = e.target.value;
                                            updateNode({
                                              data: { ...selectedNode.data, intent_patterns: newPatterns }
                                            });
                                          }}
                                          placeholder="Intent pattern"
                                          className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            const newPatterns = (selectedNode.data.intent_patterns || []).filter((_: string, i: number) => i !== index);
                                            updateNode({
                                              data: { ...selectedNode.data, intent_patterns: newPatterns }
                                            });
                                          }}
                                          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const newPatterns = [...(selectedNode.data.intent_patterns || []), ''];
                                        updateNode({
                                          data: { ...selectedNode.data, intent_patterns: newPatterns }
                                        });
                                      }}
                                      className="border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Pattern
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Confidence Threshold</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={selectedNode.data.confidence_threshold || 0.7}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, confidence_threshold: parseFloat(e.target.value) }
                                    })}
                                    placeholder="0.0 - 1.0"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Fallback Intent</Label>
                                  <Input
                                    value={(selectedNode.data as any).fallback_intent || ''}
                                    onChange={(e) => updateNode({
                                      data: { ...selectedNode.data, fallback_intent: e.target.value } as any
                                    })}
                                    placeholder="Default intent when confidence is low"
                                    className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>
                              </>
                            )}

                            {/* General Advanced Settings for all nodes */}
                            <div className="pt-4 border-t border-slate-200">
                              <h4 className="text-sm font-medium text-slate-700 mb-3">General Advanced Settings</h4>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Error Handling</Label>
                                <Select value={selectedNode.data.error_handling?.retry_count ? 'retry' : 'fallback'} onValueChange={(value) => updateNode({
                                  data: { 
                                    ...selectedNode.data, 
                                    error_handling: { 
                                      ...selectedNode.data.error_handling, 
                                      retry_count: value === 'retry' ? 3 : 0 
                                    } 
                                  }
                                })}>
                                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="retry">Retry</SelectItem>
                                    <SelectItem value="fallback">Fallback</SelectItem>
                                    <SelectItem value="escalate">Escalate</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Context Variables</Label>
                                <Textarea
                                  value={selectedNode.data.context_variables?.map(v => v.name || v).join('\n') || ''}
                                  onChange={(e) => updateNode({
                                    data: { 
                                      ...selectedNode.data, 
                                      context_variables: e.target.value.split('\n').filter(v => v.trim()).map(name => ({ name, value: '' }))
                                    }
                                  })}
                                  placeholder="Enter context variables (one per line)"
                                  className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  rows={3}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Tags</Label>
                                <Input
                                  value={selectedNode.data.tags?.join(', ') || ''}
                                  onChange={(e) => updateNode({
                                    data: { 
                                      ...selectedNode.data, 
                                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                                    }
                                  })}
                                  placeholder="Enter tags separated by commas"
                                  className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Notes</Label>
                                <Textarea
                                  value={selectedNode.data.notes || ''}
                                  onChange={(e) => updateNode({
                                    data: { ...selectedNode.data, notes: e.target.value }
                                  })}
                                  placeholder="Add notes about this node"
                                  className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="settings" className="space-y-6">
                          <div className="space-y-4">
                            {/* Node Priority and Performance */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-slate-700">Priority & Performance</h4>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Priority Level</Label>
                                <Select value={selectedNode.data.priority || 'normal'} onValueChange={(value) => updateNode({
                                  data: { ...selectedNode.data, priority: value }
                                })}>
                                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Timeout (seconds)</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="300"
                                  value={selectedNode.data.timeout || 30}
                                  onChange={(e) => updateNode({
                                    data: { ...selectedNode.data, timeout: parseInt(e.target.value) }
                                  })}
                                  placeholder="30"
                                  className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                />
                                <p className="text-xs text-slate-500">Maximum time to wait for node execution</p>
                              </div>
                            </div>

                            {/* Node State Management */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-slate-700">Node State</h4>
                              
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="enabled"
                                  checked={selectedNode.data.enabled !== false}
                                  onChange={(e) => updateNode({
                                    data: { ...selectedNode.data, enabled: e.target.checked }
                                  })}
                                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <Label htmlFor="enabled" className="text-sm font-medium text-slate-700">Node Enabled</Label>
                              </div>
                              <p className="text-xs text-slate-500">Disable to skip this node during flow execution</p>
                              
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="debug_mode"
                                  checked={(selectedNode.data as any).debug_mode || false}
                                  onChange={(e) => updateNode({
                                    data: { ...selectedNode.data, debug_mode: e.target.checked } as any
                                  })}
                                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <Label htmlFor="debug_mode" className="text-sm font-medium text-slate-700">Debug Mode</Label>
                              </div>
                              <p className="text-xs text-slate-500">Enable detailed logging for this node</p>
                            </div>

                            {/* Node Metadata */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-slate-700">Metadata & Organization</h4>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Tags</Label>
                                <Input
                                  value={selectedNode.data.tags?.join(', ') || ''}
                                  onChange={(e) => updateNode({
                                    data: { 
                                      ...selectedNode.data, 
                                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                                    }
                                  })}
                                  placeholder="Enter tags separated by commas (e.g., important, user-input, validation)"
                                  className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                />
                                <p className="text-xs text-slate-500">Use tags to categorize and filter nodes</p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Notes</Label>
                                <Textarea
                                  value={selectedNode.data.notes || ''}
                                  onChange={(e) => updateNode({
                                    data: { ...selectedNode.data, notes: e.target.value }
                                  })}
                                  placeholder="Add notes about this node's purpose, behavior, or any special considerations..."
                                  className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  rows={3}
                                />
                                <p className="text-xs text-slate-500">Documentation for this node</p>
                              </div>
                            </div>

                            {/* Node-Specific Settings */}
                            {selectedNode.type === 'message' && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-slate-700">Message Settings</h4>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Message Template</Label>
                                  <Select value={(selectedNode.data as any).message_template || 'none'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, message_template: value } as any
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">No Template</SelectItem>
                                      <SelectItem value="welcome">Welcome Message</SelectItem>
                                      <SelectItem value="goodbye">Goodbye Message</SelectItem>
                                      <SelectItem value="error">Error Message</SelectItem>
                                      <SelectItem value="custom">Custom Template</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Message Priority</Label>
                                  <Select value={(selectedNode.data as any).message_priority || 'normal'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, message_priority: value } as any
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            {selectedNode.type === 'condition' && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-slate-700">Condition Settings</h4>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Evaluation Strategy</Label>
                                  <Select value={(selectedNode.data as any).evaluation_strategy || 'first_match'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, evaluation_strategy: value } as any
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="first_match">First Match</SelectItem>
                                      <SelectItem value="best_match">Best Match</SelectItem>
                                      <SelectItem value="all_matches">All Matches</SelectItem>
                                      <SelectItem value="weighted">Weighted Evaluation</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Fallback Action</Label>
                                  <Select value={(selectedNode.data as any).fallback_action || 'continue'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, fallback_action: value } as any
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="continue">Continue Flow</SelectItem>
                                      <SelectItem value="repeat">Repeat Input</SelectItem>
                                      <SelectItem value="handoff">Human Handoff</SelectItem>
                                      <SelectItem value="error">Error Handler</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            {selectedNode.type === 'action' && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-slate-700">Action Settings</h4>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Execution Mode</Label>
                                  <Select value={(selectedNode.data as any).execution_mode || 'synchronous'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, execution_mode: value } as any
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="synchronous">Synchronous</SelectItem>
                                      <SelectItem value="asynchronous">Asynchronous</SelectItem>
                                      <SelectItem value="background">Background</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">Success Criteria</Label>
                                  <Select value={(selectedNode.data as any).success_criteria || 'completion'} onValueChange={(value) => updateNode({
                                    data: { ...selectedNode.data, success_criteria: value } as any
                                  })}>
                                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="completion">Task Completion</SelectItem>
                                      <SelectItem value="response">Valid Response</SelectItem>
                                      <SelectItem value="status_code">HTTP Status Code</SelectItem>
                                      <SelectItem value="custom">Custom Logic</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            {/* Advanced Configuration */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-slate-700">Advanced Configuration</h4>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Custom Properties</Label>
                                <Textarea
                                  value={JSON.stringify((selectedNode.data as any).custom_properties || {}, null, 2)}
                                  onChange={(e) => {
                                    try {
                                      const customProps = JSON.parse(e.target.value);
                                      updateNode({
                                        data: { ...selectedNode.data, custom_properties: customProps } as any
                                      });
                                    } catch (error) {
                                      // Invalid JSON, ignore
                                    }
                                  }}
                                  placeholder='{"key": "value", "setting": "option"}'
                                  className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-mono text-xs"
                                  rows={4}
                                />
                                <p className="text-xs text-slate-500">JSON format for custom node properties</p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Execution Hooks</Label>
                                <Select value={(selectedNode.data as any).execution_hooks || 'none'} onValueChange={(value) => updateNode({
                                  data: { ...selectedNode.data, execution_hooks: value } as any
                                })}>
                                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">No Hooks</SelectItem>
                                    <SelectItem value="pre_execution">Pre-Execution</SelectItem>
                                    <SelectItem value="post_execution">Post-Execution</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Node Statistics (Read-only) */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-slate-700">Node Statistics</h4>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <span className="text-slate-500">Execution Count:</span>
                                  <div className="font-medium">{(selectedNode.data as any).execution_count || 0}</div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-500">Success Rate:</span>
                                  <div className="font-medium">{(selectedNode.data as any).success_rate || '0%'}</div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-500">Avg. Response Time:</span>
                                  <div className="font-medium">{(selectedNode.data as any).avg_response_time || '0ms'}</div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-500">Last Executed:</span>
                                  <div className="font-medium">{(selectedNode.data as any).last_executed || 'Never'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-white/60 backdrop-blur-sm border border-slate-200 h-full">
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-500">
                        <Settings className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-sm font-medium">No Node Selected</p>
                        <p className="text-xs">Click on a node to edit its properties</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Section */}
        {validationErrors.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-red-900">
                <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                Flow Validation Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-red-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {error}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </ReactFlowProvider>
  );
};
