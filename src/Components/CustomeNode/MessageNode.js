import React, { memo, useCallback, useState } from "react";

import { Handle, Position } from "reactflow";
import { style } from "./MessageNodeStyles";
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import ArticleIcon from '@mui/icons-material/Article';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
const CustomNode = ({ data, selected  }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  let customTitle = { ...style.title };

  const scenario = {
    CONCLUSION: "conclusion",
    QUESTION: "question",
    BRAIN: "brain",
    TEMPLATE: "template"
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  

  const getIconByLabel = useCallback((label) => {
    switch (label) {
      case scenario.CONCLUSION:
        return <EmojiObjectsIcon style={{ ...style.iconSvg }} />;
      case scenario.BRAIN:
        return <PsychologyIcon style={{...style.iconSvg}} />;
      case scenario.QUESTION:
        return <ArticleIcon style={{...style.iconSvg}} />;
      case scenario.TEMPLATE:
        return <EnergySavingsLeafIcon  style={{...style.iconSvg}} />;
      default:
        return;
    }
  }, [scenario]);

  const getColorByLabel = useCallback((label) => {
    switch (label) {
      case scenario.CONCLUSION:
        return 'orange';
      case scenario.BRAIN:
        return 'brown';
      case scenario.QUESTION:
        return 'blue';
      case scenario.TEMPLATE:
        return 'cornflowerblue';
      default:
        return;
    }
  }, [scenario]);

  return (
    <div className="text-updater-node" onClick={toggleCollapse}>
      <div style={{ ...(selected ? style.selected : []) }}>
      <div style={{ ...style.customTitle, borderColor:getColorByLabel(data.label) }}>
          <div style={style.circleIcon}>
        <div style={{color:getColorByLabel(data.label)}}>
          {getIconByLabel(data.label)}
          <label style={style.arrowIcon}>{isCollapsed ? <ArrowDownwardIcon style={{fontSize: '1.2rem'}} /> : <ArrowUpwardIcon  style={{fontSize: '1.2rem'}}  />}</label>

          </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Top} id="a" />
    </div>
  );
};

export default memo(CustomNode);
