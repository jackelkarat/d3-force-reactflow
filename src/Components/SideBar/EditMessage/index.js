import React, { useState } from 'react';
import {Button, TableCell, TableRow, TextField, Grid} from "@mui/material";

export default function EditMessage({ nodeName, setNodeName, setIsSelected, onDeleteNode, data }) {
  const [editedText, setEditedText] = useState(nodeName);

  const handleInputChange = (event) => {
    setEditedText(event.target.value);
  };

  const onSubmit = () => {
    setNodeName(editedText);
   setTimeout(()=>{
    setIsSelected(false)
    setEditedText("")
   },200)
  };

  const handleDeleteNode = (event) => {
    event.stopPropagation(); 
    onDeleteNode(data.id);
  };

  return (
     <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Text"
          value={editedText || nodeName}
          required
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          onClick={onSubmit}
          fullWidth
          variant="contained"
          color="primary"
        >
          Edit
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          onClick={handleDeleteNode}
          fullWidth
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
}
