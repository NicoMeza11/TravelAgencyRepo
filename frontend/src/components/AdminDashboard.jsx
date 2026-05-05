import React, { useState } from 'react';
import { 
  Container, Typography, Grid, Paper, TextField, Button, Box, 
  Tabs, Tab, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import api from '../ApiConf'; 

function AdminDashboard() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [salesData, setSalesData] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleGenerateReports = async () => {
    if (!startDate || !endDate) {
      setError('Por favor, selecciona ambas fechas.');
      return;
    }
    if (startDate > endDate) {
      setError('La fecha de inicio no puede ser mayor a la de término.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // We do both petitions
      const [salesResponse, rankingResponse] = await Promise.all([
        api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`),
        api.get(`/reports/ranking?startDate=${startDate}&endDate=${endDate}`)
      ]);

      setSalesData(salesResponse.data);
      setRankingData(rankingResponse.data);
    } catch (err) {
      console.error("Error al generar reportes:", err);
      setError('Hubo un problema al cargar los reportes. Verifica tu conexión o permisos.');
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatCurrency = (amount) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <Container sx={{ mt: 5, mb: 10, maxWidth: 'lg' }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
        Dashboard Administrativo
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Parámetros del Reporte
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fecha de Inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fecha de Término"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<AssessmentIcon />}
              onClick={handleGenerateReports}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generar Reportes'}
            </Button>
          </Grid>
        </Grid>
        
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Tabs AND Tables (Shown only after a successful search) */}
      {(salesData.length > 0 || rankingData.length > 0) && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} centered>
              <Tab label={`Listado de Ventas (${salesData.length})`} />
              <Tab label={`Ranking de Paquetes (${rankingData.length})`} />
            </Tabs>
          </Box>

          {/* TAB 0: Sales */}
          {currentTab === 0 && (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente (ID)</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Paquete</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Pasajeros</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Monto Total</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{formatDate(row.operationDate)}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{row.clientName}</TableCell>
                      <TableCell>{row.packageName}</TableCell>
                      <TableCell align="center">{row.passengerCount}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(row.totalAmount)}
                      </TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                    </TableRow>
                  ))}
                  {salesData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No hay ventas en este período.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* TAB 1: RANKING */}
          {currentTab === 1 && (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ backgroundColor: 'secondary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Posición</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Paquete Turístico</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>N° Reservas</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Total Pasajeros</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Ingresos Generados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankingData.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>#{index + 1}</TableCell>
                      <TableCell>{row.packageName}</TableCell>
                      <TableCell align="center">{row.reservationCount}</TableCell>
                      <TableCell align="center">{row.totalPassengers}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(row.totalAmountGenerated)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {rankingData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No hay datos de paquetes para este período.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Container>
  );
}

export default AdminDashboard;