import React from "react";

import EditMessage from "../../Components/SideBar/EditMessage";

export default ({ isSelected, textRef, nodeName, setNodeName, onNodeHandleClick, setIsSelected, onDeleteNode, data}) => {
  const onDragStart = (event, nodeType, content) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("content", content);
    event.dataTransfer.effectAllowed = "move";
  };


  return (
    <aside>
      {isSelected ? (
        <EditMessage
          textRef={textRef}
          nodeName={nodeName}
          setNodeName={setNodeName}
          setIsSelected={setIsSelected}
          onDeleteNode={onDeleteNode}
          data={data}
        />
      ) : (
        <div
          className="dndnode input"
          onClick={(event) => onNodeHandleClick(event, "node")}
          onDragStart={(event) => onDragStart(event, "node", "message")}
          draggable
        >
          New Node
        </div>
      )}
    </aside>
  );
};
