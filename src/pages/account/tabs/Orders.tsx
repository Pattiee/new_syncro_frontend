import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../../services/order.service";
import { OrderCard } from "../../../components/orders/OrderCard";
import { CustomLoader2 } from "../../../components/loaders/CustomLoader2";

// Structural interface defining an individual Order item data shape
export interface UserOrderRecord {
  id: string | number;
  code?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  totals: number;
  createdAt: string;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

export const Orders: React.FC = () => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [orders, setOrders] = useState<UserOrderRecord[]>([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/", { replace: true });
      return;
    }

    let active = true;

    const loadOrders = async () => {
      if (user && !loading) {
        try {
          setFetching(true);
          const res = await getOrders({});
          if (active && res?.data) {
            // Explicit cast to satisfy strict mode assignment arrays
            setOrders(res.data as UserOrderRecord[]);
          }
        } catch (err) {
          console.error("Failed to load user orders:", err);
        } finally {
          if (active) {
            setFetching(false);
          }
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [loading, navigate, user]);

  if (fetching) {
    return <CustomLoader2 />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">
        Orders [{orders?.length || 0}]
      </h2>

      {/* Orders Grid */}
      <div className="space-y-4">
        {orders.length < 1 ? (
          <span className="text-gray-700 dark:text-gray-300 text-base">
            You have no recent orders
          </span>
        ) : (
          orders.map((odr, idx) => (
            <OrderCard key={odr?.id || idx} order={odr} />
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;