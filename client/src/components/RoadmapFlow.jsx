import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import RoadmapNode from './RoadmapNode';

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

const RoadmapFlow = ({ nodes, edges }) => {
  const [flowNodes, setNodes, onNodesChange] = useNodesState(
    nodes.map(node => ({
      ...node,
      type: 'roadmapNode',
      data: { ...node }
    }))
  );

  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(
    edges.map(edge => ({
      ...edge,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    }))
  );

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls className="bg-white rounded-lg shadow-lg" />
        <MiniMap
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
};

export default RoadmapFlow;
