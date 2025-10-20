import { useEffect, useState } from 'react'
import { getProducts } from '../services/products.service';
import { useDebounce } from './useDebounce';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState('');
    const [featured, setFeatured] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const { debouncedValue } = useDebounce({ value: searchQuery });

    useEffect(() => {
        const loadProducts = async () => {
          try {
            if (!loading){
              setLoading(true);
              const requestList = [
                await getProducts({ category: filter ? filter : null, isFeatured: featured, search: debouncedValue ? debouncedValue : null }),
              ];
        
              const [productResponse, ] = await Promise.allSettled(requestList);
        
              if (productResponse.status === "fulfilled") {
                const responseData = productResponse?.value?.data;
  
                setProducts(responseData);
              } else {
                // setErrMessage(productResponse.reason);
              }
            }
          } catch (error) {
            
          } finally{
            setLoading(false);
          }
        }
    
        loadProducts();
      }, [featured, filter, debouncedValue]);

    return { products, categories, loading, errMessage, filter, setFilter, featured, setFeatured, setSearchQuery }
}
