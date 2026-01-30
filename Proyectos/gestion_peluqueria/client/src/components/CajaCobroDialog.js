import React, { useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';

const metodosPago = ['efectivo', 'tarjeta', 'bizum', 'transferencia'];

function CajaCobroDialog({ open, onClose, citas, formData, setFormData, onSubmit }) {
  const citaSeleccionada = useMemo(
    () => citas.find((cita) => cita.id === Number(formData.cita_id)),
    [citas, formData.cita_id]
  );

  useEffect(() => {
    if (citaSeleccionada && formData.monto === 0) {
      setFormData((prev) => ({ ...prev, monto: citaSeleccionada.servicio_precio || 0 }));
    }
  }, [citaSeleccionada, formData.monto, setFormData]);

  const calcularCambio = () => {
    if (formData.metodo_pago !== 'efectivo') return 0;
    const recibido = Number(formData.efectivo_recibido || 0);
    const total = Number(formData.monto || 0) + Number(formData.propina || 0);
    return Math.max(recibido - total, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar cobro</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Cita"
              value={formData.cita_id}
              onChange={(e) => setFormData({ ...formData, cita_id: Number(e.target.value) })}
              required
            >
              {citas.map((cita) => (
                <MenuItem key={cita.id} value={cita.id}>
                  {new Date(cita.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  {' · '}
                  {cita.cliente_nombre} {cita.cliente_apellidos || ''} - {cita.servicio_nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Monto (€)"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Propina (€)"
              value={formData.propina}
              onChange={(e) => setFormData({ ...formData, propina: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Método de pago"
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Efectivo recibido (€)"
              value={formData.efectivo_recibido}
              onChange={(e) => setFormData({ ...formData, efectivo_recibido: Number(e.target.value) })}
              disabled={formData.metodo_pago !== 'efectivo'}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Cambio: €{calcularCambio().toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSubmit(calcularCambio())} variant="contained">
          Registrar cobro
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CajaCobroDialog;
