import axios from "axios";
const API_URL = 'https://edmar-aulas-sds2.herokuapp.com';

function fetchOrders() {
    return axios(`${API_URL}/orders`)
}
export function confirmDelivery(orderId: number) {
    return axios.put(`${API_URL}/orders/${orderId}/delivered`);
      
}
export default fetchOrders