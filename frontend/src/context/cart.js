import { Children, createContext, useContext, useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

const CartContext = createContext();

const CartProvider = ({children}) => {
    const [cart,setCart] = useState([]);

    useEffect(()=>{
        let existingCartItem = localStorage.getItem('cart');
        if(existingCartItem) setCart(JSON.parse(existingCartItem))
    },[])

    return(
        <CartContext.Provider value={[cart,setCart]}>
            {children}
        </CartContext.Provider>
    )
}

//custom hook

const useCart = () => useContext(CartContext);

export {useCart,CartProvider}