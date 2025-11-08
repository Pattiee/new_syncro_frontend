import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const FloatingCart = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    const handleNavigateToSummary = async () => navigate('/cart');

    return (
        <button
            onClick={handleNavigateToSummary}
            className='flex fixed bottom-6 right-6 bg-orange-500 text-white rounded-full w-14 h-14 items-center justify-center shadow-lg hover:bg-orange-600 transition'
        >
            <div className='flex flex-col justify-center items-center relative'>
                {cartItems?.length > 0 && (
                    <span className='absolute -top-1 text-sm bg-transparent text-white font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                        { cartItems.length || 0 }
                    </span>
                )}
                <ShoppingCart size={30} />
            </div>
        </button>
    )
}

export default FloatingCart
