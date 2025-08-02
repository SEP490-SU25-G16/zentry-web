import React from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  Divider,
  FormHelperText
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon
} from "@mui/icons-material";

const SelectionOptionsSection = ({
  formData,
  formErrors,
  optionInput,
  draggedIndex,
  onOptionInputChange,
  onAddOption,
  onRemoveOption,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" component="h3" gutterBottom>
          Selection Options
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          label="Option Value"
          value={optionInput.value}
          onChange={onOptionInputChange("value")}
          placeholder="e.g., Bluetooth"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px"
            }
          }}
        />
      </Grid>

      <Grid item xs={12} md={5}>
        <TextField
          label="Display Label"
          value={optionInput.displayLabel}
          onChange={onOptionInputChange("displayLabel")}
          placeholder="e.g., Điểm danh qua Bluetooth"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px"
            }
          }}
        />
      </Grid>

      <Grid item xs={12} md={1}>
        <Button
          variant="contained"
          onClick={onAddOption}
          disabled={!optionInput.value.trim() || !optionInput.displayLabel.trim()}
          sx={{
            minWidth: "48px",
            height: "56px",
            borderRadius: "8px"
          }}
        >
          <AddIcon />
        </Button>
      </Grid>

      {formData.options.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Current Options:
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              maxHeight: "200px",
              overflow: "auto",
              borderRadius: "8px"
            }}
          >
            <List dense>
              {formData.options.map((option, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragOver={onDragOver}
                    onDragEnter={onDragEnter}
                    onDrop={(e) => onDrop(e, index)}
                    onDragEnd={onDragEnd}
                    sx={{
                      cursor: "grab",
                      backgroundColor:
                        draggedIndex === index ? "rgba(0, 0, 0, 0.04)" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)"
                      },
                      "&:active": {
                        cursor: "grabbing"
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "36px" }}>
                      <DragIcon color="action" sx={{ cursor: "grab" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={option.displayLabel}
                      secondary={`Value: ${option.value} | Sort Order: ${option.sortOrder}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => onRemoveOption(index)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < formData.options.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          {formErrors.options && (
            <FormHelperText error sx={{ mt: 1 }}>
              {formErrors.options}
            </FormHelperText>
          )}
        </Grid>
      )}
    </>
  );
};

export default SelectionOptionsSection;
