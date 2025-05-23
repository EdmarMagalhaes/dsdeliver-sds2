import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Alert, Linking } from 'react-native';
import Header from '../Header';
import { Order } from '../types';
import OrderCard from '../OrderCard';
import { RectButton } from 'react-native-gesture-handler';
import { confirmDelivery } from '../api';

type Props = {
    route: {
        params: {
            order: Order;
        } 
    }
}

function OrderDetails({ route}: Props) {
  const { order } = route.params;  
  const navigation = useNavigation();

  const handleOnCancel = () => {
    navigation.navigate('Orders');
  }
   const handleConfirmDelivery = () => {
    confirmDelivery(order.id)
    .then(() => {
        Alert.alert(`Pedido ${order.id} confirmado com sucesso!`)
        navigation.navigate('Orders');
    })
    .catch(() => {
        Alert.alert(`Houve um erro ao confirmar o pedido ${order.id}`)
    })
   } 
  const handleStartNavigation = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${order.latitude},${order.longitude}`);

  }

  return (
    <>
    <Header />
      <View style={styles.container}>
        <OrderCard order={order} />
        <RectButton style={styles.button}>
            <Text style={styles.buttonText} onPress={handleStartNavigation}>INICIAR NAVEGAÇÃO</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleConfirmDelivery}>
            <Text style={styles.buttonText}>CONFIRMAR ENTREGA</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleOnCancel}>
            <Text style={styles.buttonText}>CANCELAR</Text>
        </RectButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingRight: '5%',
      paddingLeft: '5%',
      backgroundColor: '#F5F5F5'
    },
    button: {
      backgroundColor: '#DA5C5C',
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 50,
      paddingRight: 50,
      fontWeight: 'bold',
      fontSize: 16,
      color: '#FFF',
      letterSpacing: -0.24,
      fontFamily: 'OpenSans_700Bold'
    }
  });
  

export default OrderDetails;