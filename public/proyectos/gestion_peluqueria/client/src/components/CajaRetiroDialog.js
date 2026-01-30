import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

const metodosPago = ['efectivo', 'tarjeta', 'bizum', 'transferencia'];

function CajaRetiroDialog({ open, onClose, formData, setFormData, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Retiro de caja</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Monto (€)"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Método"
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
            >
              {metodosPago.map((metodo) => (
                <MenuItem key={metodo} value={metodo}>
                  {metodo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained" color="error">
          Registrar retiro
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CajaRetiroDialog;
