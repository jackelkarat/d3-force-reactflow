import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import React, { useEffect, useLayoutEffect, useMemo, useState,useCallback  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStore,
  getIncomers,
  getOutgoers,
  getConnectedEdges
} from 'reactflow';
import useUndoable from "use-undoable";
import ELK from 'elkjs/lib/elk.bundled.js';
import { Button } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';

import { initialNodes, initialEdges } from './nodes-edges.js';
import { collide } from './collide.js';

import 'reactflow/dist/style.css';
import CustomNode from "./Components/CustomeNode/MessageNode.js";
import 'react-toastify/dist/ReactToastify.css';

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-1000))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .force('collide', collide())
  .alphaTarget(0.05)
  .stop();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const initialised = useStore((store) =>
    [...store.nodeInternals.values()].every((node) => node.width && node.height)
  );

  return useMemo(() => {
    let nodes = getNodes().map((node) => ({ ...node, x: node.position.x, y: node.position.y }));
    let edges = getEdges().map((edge) => edge);
    let running = false;

    if (!initialised || nodes.length === 0) return [false, {}];

    simulation.nodes(nodes).force(
      'link',
      forceLink(edges)
        .id((d) => d.id)
        .strength(0.05)
        .distance(100)
    );

    const tick = () => {
      getNodes().forEach((node, i) => {
        const dragging = Boolean(document.querySelector(`[data-id="${node.id}"].dragging`));

        nodes[i].fx = dragging ? node.position.x : null;
        nodes[i].fy = dragging ? node.position.y : null;
      });

      simulation.tick();
      setNodes(nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })));

      window.requestAnimationFrame(() => {
        fitView();
        if (running) tick();
      });
    };

    const toggle = () => {
      running = !running;
      running && window.requestAnimationFrame(tick);
    };

    const isRunning = () => running;

    return [true, { toggle, isRunning }];
  }, [initialised]);
};
const nodeTypes = { 
  node: CustomNode
};


const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};


const LayoutFlow = () => {
  const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [initialised, { toggle, isRunning }] = useLayoutedElements();
  const { fitView, ...otherFlowMethods } = useReactFlow(); 
  const [hidden, setHidden] = useState(true);
  const [lastSortOrder, setLastSortOrder] = useState('asc');

  useLayoutEffect(() => {
    onLayout({ direction: 'DOWN', useInitialNodes: true });
  }, []);

  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;
  
      getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
  
        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges]
  );
  
  const hide = (hidden, childEdgeID, childNodeID) => (nodeOrEdge) => {
    if (
      childEdgeID.includes(nodeOrEdge.id) ||
      childNodeID.includes(nodeOrEdge.id)
    )
      nodeOrEdge.hidden = hidden;
    return nodeOrEdge;
  };
  const checkTarget = (edge, id) => {
    let edges = edge.filter((ed) => {
      return ed.target !== id;
    });
    return edges;
  };

  let outgoers = [];
  let connectedEdges = [];
  let stack = [];
  const nodeClick = (some, node) => {
    console.log(node)
    let currentNodeID = node.id;
    stack.push(node);
    while (stack.length > 0) {
      let lastNOde = stack.pop();
      let childnode = getOutgoers(lastNOde, nodes, edges);
      let childedge = checkTarget(
        getConnectedEdges([lastNOde], edges),
        currentNodeID
      );
      childnode.map((goer, key) => {
        stack.push(goer);
        outgoers.push(goer);
      });
      childedge.map((edge, key) => {
        connectedEdges.push(edge);
      });
    }

    let childNodeID = outgoers.map((node) => {
      return node.id;
    });
    let childEdgeID = connectedEdges.map((edge) => {
      return edge.id;
    });

    setNodes((node) => node.map(hide(hidden, childEdgeID, childNodeID)));
    setEdges((edge) => edge.map(hide(hidden, childEdgeID, childNodeID)));
    setHidden(!hidden);
  };

  const saveHandler = () => {
    const flowState = { nodes, edges };
    localStorage.setItem('flowState', JSON.stringify(flowState));
    toast.success('Flow state saved successfully!');
  };

  const restoreHandler = () => {
    const savedFlowState = localStorage.getItem('flowState');
    if (savedFlowState) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedFlowState);
      setNodes(savedNodes);
      setEdges(savedEdges);
      toast.success('Flow state restored successfully!');
    } else {
      toast.error('No saved flow state found!');
    }
  };

  const onLayoutByDate = useCallback(() => {
    const sortedNodes = [...nodes].sort((a, b) => {
      if (lastSortOrder === 'asc') {
        const dateA = new Date(a.data.date);
        const dateB = new Date(b.data.date);
        return dateA - dateB;
      } else {
        const dateA = new Date(a.data.date);
        const dateB = new Date(b.data.date);
        return dateB - dateA;
      }
    });
  
    const updatedNodes = sortedNodes.map((node, index) => ({
      ...node,
      position: { x: index * 100, y: index * 50 },
    }));
  
    setNodes(updatedNodes);
    setLastSortOrder(lastSortOrder === 'asc' ? 'desc' : 'asc');
  }, [nodes, lastSortOrder]);
  
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    <ReactFlow
      nodes={nodes}
      edges={edges.map((edge, index) => ({
        ...edge,
        id: `edge-${index}`, 
        key: `edge-${index}` 
      }))}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={nodeClick}
      deleteKeyCode={null}
    >
           
           <Panel position="bottom-left">
        <Button onClick={saveHandler} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={restoreHandler} variant="contained" color="secondary">
          Restore
        </Button>
        </Panel>
            <Panel position="top-right">
        <Button onClick={() => onLayout({ direction: 'DOWN' })}
          variant="contained"
          color="primary">vertical layout</Button>
        <Button onClick={() => onLayout({ direction: 'RIGHT' })}
          variant="contained"
          color="primary">horizontal layout</Button>
        
        <Button onClick={onLayoutByDate} variant="contained" color="primary">
          {lastSortOrder === 'asc' ? 'Sort by Date Asc' : 'Sort by Date Desc'}
       </Button>
      </Panel>
      <Panel>
        {initialised && (
          <Button   variant="contained"
          color="primary"
          onClick={toggle}>{isRunning() ? 'Stop' : 'Start'} force simulation</Button>
        )}
      </Panel>
    </ReactFlow>
    </>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
