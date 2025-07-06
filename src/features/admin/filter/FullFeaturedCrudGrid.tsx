import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {
  type GridRowsProp,
  type GridRowModesModel,
  GridRowModes,
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
  type GridEventListener,
  type GridRowId,
  type GridRowModel,
  GridRowEditStopReasons,
  type GridSlotProps,
  Toolbar,
  ToolbarButton,
  type GridValidRowModel
} from '@mui/x-data-grid';
import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    title: string;
  }
}

// Make the component generic
type Props<T extends GridValidRowModel> = {
  title: string;
  rows: T[];
  setRows: React.Dispatch<React.SetStateAction<T[]>>;
};

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel, title } = props;

  const handleClick = () => {
    const id = Math.floor(new Date().valueOf() * Math.random());
    setRows((oldRows) => [...oldRows, { id, name: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
    }));
  };

  return (
    <Toolbar>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Grid>
          <Typography variant="h6">{title}</Typography>
        </Grid>
        <Grid>
          <Tooltip title="Add record">
            <ToolbarButton onClick={handleClick}>
              <Add fontSize="small" />
              <Typography variant="button" sx={{ ml: 1 }}>
                Add new
              </Typography>
            </ToolbarButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Toolbar>
  );
}

function adaptSetRows<T extends GridValidRowModel>(
  setState: React.Dispatch<React.SetStateAction<T[]>>
): (
  updater: (prev: readonly GridValidRowModel[]) => readonly GridValidRowModel[]
) => void {
  return (updater) => {
    setState((prev) => [...(updater(prev) as T[])]);
  };
}

// Update the component signature
export default function FullFeaturedCrudGrid<T extends GridValidRowModel>({
  title,
  rows,
  setRows
}: Props<T>) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false } as unknown as T;
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 140,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              material={{
                sx: {
                  color: 'primary.main'
                }
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              material={{
                sx: {
                  color: 'error.main'
                }
              }}
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={handleEditClick(id)}
            material={{
              sx: {
                color: 'primary.main'
              }
            }}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            material={{
              sx: {
                color: 'error.main'
              }
            }}
          />
        ];
      }
    }
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: {
            setRows: adaptSetRows(setRows),
            setRowModesModel,
            title
          }
        }}
        showToolbar
      />
    </Box>
  );
}
