import React from 'react';
import { BaseEdge, EdgeLabelRenderer } from 'reactflow';
import { style } from './CustomEdgeStyles';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  onEdgeDelete,
  label,
}) => {
  const smoothStepControlPointX = (sourceX + targetX) / 2;
  const smoothStepControlPointY = sourceY - 50;
  const edgePath = `M ${sourceX},${sourceY} C ${smoothStepControlPointX},${smoothStepControlPointY} ${smoothStepControlPointX},${smoothStepControlPointY} ${targetX},${targetY}`;
  const markerId = `arrow-${id}`;

  return (
    <>
      <svg style={{ overflow: 'visible' }}>
        <defs>
          <marker
            id={markerId}
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              points="-5,-4 0,0 -5,4 -5,-4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ stroke: '#b1b1b7', fill: '#b1b1b7', strokeWidth: '1' }}
            />
          </marker>
        </defs>
        <BaseEdge
          path={edgePath}
          markerEnd={`url(#${markerId})`}
          style={style}
        />
      </svg>

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px,${sourceY - 60}px)`, // Adjust label position if needed
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/* <div>{label}</div> */}
          {/* <button style={style.edgebutton} onClick={(event) => onEdgeDelete(event, id)}>
            ×
          </button> */}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
