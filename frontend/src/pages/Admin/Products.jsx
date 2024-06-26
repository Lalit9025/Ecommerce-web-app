import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../../components/styles/ProductDetailsStyles.css'


const Products = () => {
  const [products,setProducts] = useState();

  //get all products
  const getAllProducts = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("error while getting all products")
    }
  }
  useEffect(() => {
    getAllProducts();
  },[]);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu/>
        </div>
        <div className="col-md-9">
          <h1 className='text-center'>All Products List</h1>
          <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <Link 
                  key={p._id} 
                  to={`/dashboard/admin/product/${p.slug}`} 
                  className='product-link' 
                >
                    <div className="card m-2" style={{width: '18rem'}}>
                      <img 
                        src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`} 
                        className="img_div_1" 
                        alt={p.name} 
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.name.substring(0,15)}</h5>
                        <p className="card-text">{p.description.substring(0,20)}</p>
                      </div>
                    </div>
                </Link> 
                ))
              }
          </div>
        </div>
      </div>       
    </Layout>
  )
}

export default Products