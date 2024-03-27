import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DropIn from "braintree-web-drop-in-react";
import { useSearch } from '../context/search';
import axios from 'axios';
import '../components/styles/CartStyles.css'
const CartPage = () => {
    const [auth,setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //Total price4
    const totalPrice = () => {
        try {
            let total =0;
            cart?.map(item =>{
                total = total + item.price;
            })
            return total.toLocaleString("en-US",{
                style:"currency",
                currency:"USD",
            });

        } catch (error) {
            console.log(error)
        }
    }

    //delete item fromn cart
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.filter((item) => item._id === pid);
            myCart.splice(index,1);
            setCart(myCart)
            localStorage.setItem("cart", JSON.stringify(myCart))
        } catch (error) {
            console.log(error);
            toast.error('error in removing item from cart')
        }
    }

    //get payment gateway token
    const getToken = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/braintree/token`);
            setClientToken(data?.response?.clientToken)
            console.log(clientToken)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getToken();
    }, [auth?.token])

    //handle payment
    const handlePayment = async () => {
        try {
            setLoading(true);
            const {nonce} = await instance.requestPaymentMethod()
            const {data} = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/braintree/payment`,{
                nonce, cart
            })
            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            navigate('/dashboard/user/orders')
            toast.success('payment completed successfully')
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-center bg-light p-2 mb-1">
                        {`Hello ${auth?.token && auth?.user?.name}`}
                   
                        <p className="text-center">
                            {cart?.length > 1 
                            ? `You have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout"}` :"your cart is empty"}
                        </p>
                    </h1>
                </div>
            </div>
            <div className="container">
            <div className="row">
                <div className="col-md-7 p-0 m-0">
                    {cart?.map((p) => (
                        <div className="row card flex-row" key={p._id}>
                            <div className="col-md-4">
                                 <img 
                                   src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`} 
                                   className="card-img-top" 
                                   alt={p.name} 
                                   width={'100%'}
                                   height={'130px'}
                                />
                            </div>
                            <div className="col-md-4">
                                <p>{p.name}</p>
                                <p>{p.description.substring(0, 30)}</p>
                                <p>Price : {p.price}</p>
                            </div>
                            <div className="col-md-4 cart-remove-btn">
                                <button
                                className="btn btn-danger"
                                onClick={() => removeCartItem(p._id)}
                                >
                                Remove
                                </button>
                            </div>
                        </div>        
                    ))}
                </div>
                <div className="col-md-5 cart-summary">
                   <h2>Cart Summary</h2>
                   <p>Total | Checkout | Payment</p>
                   <hr />
                   <h4>Total : {totalPrice()} </h4>
                   {auth?.user?.address ? (
                    <>
                      <div className="mb-3">
                            <h4>Current Address</h4>
                            <h5>{auth?.user?.address}</h5>
                            <button 
                            className='btn btn-outline-warning' 
                            onClick={()=> navigate('/dashboard/user/profile')}
                            > 
                            Update Address
                            </button>                      
                        </div>
                    </>
                   ) : (
                    <div className="mb-3">
                        {auth?.token ? (
                            <button 
                              className='btn btn-outline-warning' 
                              onClick={() => navigate('/dashboard/user/profile')}
                            >
                                Update Address
                            </button>
                        ) : (                            
                            <button 
                              className='btn btn-outline-warning' 
                              onClick={() => navigate('/login',{state:"/cart"})}
                            >
                                Please Login
                            </button>
                        )}
                    </div>
                   )}
                   <div className="mt-2">
                    {
                        !clientToken || !cart?.length ? (""):(
                            <>
                                <DropIn
                                    options={{
                                        authorization: clientToken,
                                        paypal:{
                                            flow:'vault',
                                        },
                                    }}
                                    onInstance={(instance) => setInstance(instance)}
                                />
                                <button 
                                    className='btn btn-primary' 
                                    onClick={handlePayment}
                                    disabled={loading || !instance || !auth?.user?.address}
                                >
                                     {loading ? 'Processing ...' : 'Make Payment'}
                                </button>
                            </>
                        )
                    }
                        
                        
                   </div>
                   </div>
                </div>
            </div>
        </div>
    </Layout>
  );
};

export default CartPage