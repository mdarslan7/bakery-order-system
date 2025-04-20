import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Button, TextField, Typography, Card, CardContent,
  CircularProgress, ThemeProvider, createTheme, Modal, Box
} from '@mui/material';
import axios from 'axios';

// Custom MUI Theme
const theme = createTheme({
  palette: {
    primary: { main: '#FFB6C1' },
    secondary: { main: '#A3D8F4' },
    background: {
      default: '#FFFAFA',
      paper: '#FFF0F5',
    },
    text: { primary: '#4A4A4A' },
    action: { active: '#FF69B4' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 400 },
    h6: { fontWeight: 400 },
  },
});

// Modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 500,
  backgroundColor: '#FFF0F5',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: 24,
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({ product_id: '', customer_name: '' });
  const [orderStatus, setOrderStatus] = useState(null);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);

  // New state for tracking
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [openTrackModal, setOpenTrackModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderStatus('Submitting...');

    axios.post('http://localhost:3000/order', orderDetails)
      .then(res => {
        setOrderStatus(`Order Created: ${res.data.status}`);
        setOpenStatusModal(true);
      })
      .catch(err => {
        console.error('Error creating order:', err);
        setOrderStatus('Failed to create order');
        setOpenStatusModal(true);
      });
  };

  const handleTrackOrder = () => {
    if (!trackOrderId) return;
    setTrackResult('Fetching...');
    axios.get(`http://localhost:3000/order/${trackOrderId}`)
      .then(res => {
        setTrackResult(`Customer: ${res.data.customer_name} | Status: ${res.data.status}`);
      })
      .catch(err => {
        console.error('Error tracking order:', err);
        setTrackResult('Order not found.');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom style={{ fontFamily: 'Roboto', color: '#4A4A4A' }}>
            Bakery Shop
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            style={{ backgroundColor: '#A3D8F4', color: '#000', fontWeight: 'bold' }}
            onClick={() => setOpenTrackModal(true)}
          >
            Track Order
          </Button>
        </div>

        {/* Product List */}
        {loading ? (
          <CircularProgress style={{ display: 'block', margin: 'auto' }} />
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card style={{ backgroundColor: '#FFF0F5', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                  />
                  <CardContent>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>{product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.description || 'Delicious bakery item'}
                    </Typography>
                    <Typography variant="h6" style={{ color: '#FF69B4', fontWeight: 'bold' }}>
                      ${product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{ marginTop: '15px', backgroundColor: '#FF69B4', color: '#fff' }}
                      onClick={() => {
                        setOrderDetails({ product_id: product.id, customer_name: '' });
                        setOpenOrderModal(true);
                      }}
                    >
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Order Modal */}
        <Modal open={openOrderModal} onClose={() => setOpenOrderModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h4" align="center" gutterBottom style={{ color: '#FF69B4' }}>
              Place Your Order
            </Typography>
            <form onSubmit={handleOrderSubmit}>
              <TextField
                label="Customer Name"
                fullWidth
                margin="normal"
                required
                value={orderDetails.customer_name}
                onChange={e => setOrderDetails({ ...orderDetails, customer_name: e.target.value })}
              />
              <TextField
                label="Product ID"
                fullWidth
                margin="normal"
                required
                value={orderDetails.product_id}
                disabled
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ backgroundColor: '#FF69B4', color: '#fff', marginTop: '20px' }}
              >
                Place Order
              </Button>
            </form>
          </Box>
        </Modal>

        {/* Order Status Modal */}
        <Modal open={openStatusModal} onClose={() => setOpenStatusModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h4" align="center" style={{ color: '#FF69B4' }} gutterBottom>
              Order Status
            </Typography>
            <Typography variant="h6" align="center" style={{ color: '#4A4A4A' }}>
              {orderStatus}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              style={{ marginTop: '20px', backgroundColor: '#A3D8F4' }}
              onClick={() => setOpenStatusModal(false)}
            >
              Close
            </Button>
          </Box>
        </Modal>

        {/* Track Order Modal */}
        <Modal open={openTrackModal} onClose={() => setOpenTrackModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h4" align="center" gutterBottom style={{ color: '#A3D8F4' }}>
              Track Your Order
            </Typography>
            <TextField
              label="Enter Order ID"
              fullWidth
              margin="normal"
              value={trackOrderId}
              onChange={(e) => setTrackOrderId(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              style={{ backgroundColor: '#A3D8F4', color: '#000', fontWeight: 'bold', marginTop: '10px' }}
              onClick={handleTrackOrder}
            >
              Check Status
            </Button>
            {trackResult && (
              <Typography variant="body1" align="center" style={{ marginTop: '15px', color: '#4A4A4A' }}>
                {trackResult}
              </Typography>
            )}
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default App;