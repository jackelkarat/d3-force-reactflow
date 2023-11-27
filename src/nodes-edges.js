import { MarkerType } from "reactflow";

export const initialNodes = [
  {
    id: '1',
    type: 'node',
    data: { label: 'brain', heading: "2 תוכנית", content: "This is text 1" },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'node',
    data: { label: 'conclusion', heading: "היסק 3", content: "This is text 2" },
    position: { x: 0, y: 100 },
  },
  {
    id: '2a',
    type: 'node',
    data: { label: 'question', heading: "שאלה חדשה 3", content: "This is text 2a" },
    position: { x: 0, y: 200 },
  },
  {
    id: '2b',
    type: 'node',
    data: { label: 'brain', heading: "תוכנית 3", content: "This is text 2b" },
    position: { x: 0, y: 300 },
  },
  {
    id: '2c',
    type: 'node',
    data: { label: 'question', heading: "שאלה חדשה 2", content: "This is text 2c" },
    position: { x: 0, y: 400 },
  },
  {
    id: '2d',
    type: 'node',
    data: { label: 'conclusion', heading: "היסק 2", content: "This is text 2d" },
    position: { x: 0, y: 500 },
  },
  {
    id: '3',
    type: 'node',
    data: { label: 'conclusion', heading: "היסק 1", content: "This is text 3" },
    position: { x: 200, y: 100 },
  },
  {
    id: '4',
    type: 'node',
    data: { label: 'question', heading: "שאלה חדשה 1", content: "This is text 4" },
    position: { x: 300, y: 100 },
  },
  {
    id: '10',
    type: 'node',
    data: { label: 'template',heading: "תבנית", content: "This is text 7" },
    position: { x: 600, y: 300 },
  },
];

export const initialEdges = [
  { id: 'e12', source: '1', target: '2', animated: false, type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e13', source: '1', target: '3', animated: false, type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e22a', source: '2', target: '2a', animated: false,  type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e22b', source: '2', target: '2b', animated: false , type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e22c', source: '2', target: '2c', animated: false , type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e2c2d', source: '2c', target: '2d', animated: false , type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e60', source: '1', target: '4', animated: false , type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e12', source: '10', target: '2', animated: false , type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e13', source: '10', target: '3', animated: false , type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },
  { id: 'e14', source: '10', target: '1', animated: false , type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed} },

];
