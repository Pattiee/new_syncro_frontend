import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../../services/order.service';
import { OrderCard } from '../../../components/orders/OrderCard';
import { CustomLoader2 } from '../../../components/loaders/CustomLoader2';

export const Orders = () => {
    const [fetching, setFetching] = useState(false);
    const [orders, setOrders] = useState([]);
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user && !loading) navigate('/', { replace: true });
        const loadOrders = async () => {
            if (user && !loading) {
                setFetching(true);
                await getOrders({}).then(res => {
                    console.log(res?.data);
                    setOrders(res?.data);
                }).catch(err => {
                    console.error(err);
                }).finally(() => setFetching(false));
            }
        }
        loadOrders()
    }, [loading, navigate, user]);

    if (fetching) return <CustomLoader2/>
    
    return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">
            Orders [{orders?.length}]
        </h2>

        {/* Orders */}
        <div>
            {orders.length < 1
                ? <span className="text-gray-700 dark:text-gray-300 text-base"> You have no recent orders </span>
                : orders.map((odr, idx) => <OrderCard key={idx} order={odr}/>)}
        </div>
        
    </div>
    );
}
