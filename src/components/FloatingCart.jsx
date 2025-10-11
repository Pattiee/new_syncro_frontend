import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingCart = ({ cart }) => {
    const navigate = useNavigate();

    const handleNavigateToSummary = async () => navigate('/cart-summary');

    return (
        <button
            onClick={handleNavigateToSummary}
            className='fixed bottom-6 right-6 bg-orange-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-orange-600 transition'
        >
            <div className='flex flex-col justify-center items-center relative'>
                <ShoppingCart size={24} />
                {cart && (
                    <span className='absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                        { cart?.items.length ?? 0 }
                    </span>
                )}
            </div>
        </button>
    )
}

export default FloatingCart
