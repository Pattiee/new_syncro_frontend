import { useEffect, useState } from 'react'
import { getProducts } from '../services/products.service';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts({ });
                setProducts(response.data?.products ?? []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return { products, loading }
}
