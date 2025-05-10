import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchProducts, saveOrder } from '../api';
import Footer from '../Footer';
import { checkIsSelected } from './helpers';
import OrderLocation from './OrderLocation';
import OrderSummary from './OrderSummary';
import ProductsList from './ProductsList';
import StepsHeader from './StepsHeader';
import { OrderLocationData, Product } from './types';
import { Hourglass } from 'react-loader-spinner';
import './styles.css';

function Orders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [orderLocation, setOrderLocation] = useState<OrderLocationData>();
  const [isLoading, setIsLoading] = useState(true);

  const totalPrice = selectedProducts.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  useEffect(() => {
    fetchProducts()
      .then(response => setProducts(response.data))
      .catch(() => toast.error('❌ Erro ao listar produtos!'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectProduct = (product: Product) => {
    const isAlreadySelected = checkIsSelected(selectedProducts, product);

    if (isAlreadySelected) {
      const selected = selectedProducts.filter(item => item.id !== product.id);
      setSelectedProducts(selected);
    } else {
      setSelectedProducts(previous => [...previous, product]);
    }
  };

  const handleSubmit = () => {
    if (selectedProducts.length === 0) {
      toast.warning('⚠️ Selecione pelo menos um produto antes de enviar o pedido!');
      return;
    }

    if (!orderLocation) {
      toast.warning('📍 Informe o local de entrega antes de enviar o pedido!');
      return;
    }

    const productIds = selectedProducts.map(({ id }) => ({ id }));
    const payload = {
      ...orderLocation,
      products: productIds
    };

    saveOrder(payload)
      .then((response) => {
        console.log("📦 Pedido enviado:", response);
        if (response.data?.id) {
          toast.success(`✅ Pedido enviado com sucesso! Nº ${response.data.id}`);
          setSelectedProducts([]);
        } else {
          toast.error("⚠️ Pedido enviado, mas resposta inesperada do servidor.");
        }
      })
      .catch(() => {
        toast.error('❌ Erro ao enviar pedido');
      });
  };

  return (
    <>
      <div className="orders-container">
        <StepsHeader />

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <Hourglass
              visible={true}
              height="60"
              width="60"
              ariaLabel="hourglass-loading"
              colors={['#3f51b5', '#1976d2']}
            />
          </div>
        ) : (
          <ProductsList
            products={products}
            onSelectProduct={handleSelectProduct}
            selectedProducts={selectedProducts}
          />
        )}

        <OrderLocation onChangeLocation={location => setOrderLocation(location)} />
        <OrderSummary
          amount={selectedProducts.length}
          totalPrice={totalPrice}
          onSubmit={handleSubmit}
        />
      </div>
      <Footer />
    </>
  );
}

export default Orders;
