import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { json, useParams } from 'react-router-dom'
import { useSearch } from '../context/search'
const ProductDetail = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    //initial details
    useEffect(() => {
      if(params?.slug) getProduct();
    },[params?.slug])

    //get product
    const getProduct = async () => {
        try {
            const {data} = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id,data?.product.category._id);
        } catch (error) {
            console.log(error);
        }

    }
    //get similar products
    const getSimilarProduct = async (pid,cid) => {
      try {
        const {data} = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
        setRelatedProducts(data?.products)
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <Layout>
       <div className="row container mt-2">
        <div className="col-md-6">
           <img 
             src={`/api/v1/product/product-photo/${product._id}`} 
             className="card-img-top" 
             alt={product.name} 
             height={'300px'}
             width={'350px'}
           />
        </div>
        <div className="col-md-6 text-center">
            <h1>Product Details</h1>
            <h6>Name : {product.name}</h6>
            <h6>Description : {product.description}</h6>
            <h6>Price : {product.price}</h6>
            <h6>Category : {product.category?.name}</h6>
            <button class="btn btn-secondary ms-1">Add to Cart</button>
        </div>
       </div>
       <div className="row">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (<p>No similar Products Found</p>) }
        <div className="d-flex flex-wrap align-tems-center justify-content-center">
            {relatedProducts?.map((p) => (
                    <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                      <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                        <p className="card-text">$ {p.price}</p>
                        <button class="btn btn-secondary ms-1">Add to Cart</button>
                      </div>
                    </div>
                ))
              }
            </div>
       </div>
    </Layout>
  )
}

export default ProductDetail