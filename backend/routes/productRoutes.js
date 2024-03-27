import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { 
    braintreePaymentController,
    braintreeTokenController,
    createProductController, 
    deleteProductController, 
    getProductController, 
    getSingleproduct, 
    productCategoryController, 
    productCountController, 
    productFiltersController, 
    productListController, 
    productPhotoController, 
    relatedProductController, 
    searchProductController, 
    updateProductController 
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

//routes
//create product
router.post('/create-product',requireSignIn, isAdmin,formidable(), createProductController)

//update product
router.put('/update-product/:pid',requireSignIn, isAdmin,formidable(), updateProductController)

//get products
router.get('/get-product',getProductController)

//get single product
router.get('/get-product/:slug', getSingleproduct)


//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete a product
router.delete('/delete-product/:pid', deleteProductController)

//filter product
router.post('/product-filters',productFiltersController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword', searchProductController)

//similar product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug',productCategoryController)


//payments route
//token :  to verfiy the account
router.get('/braintree/token', braintreeTokenController)

//for payemts
router.post('/braintree/payment',requireSignIn, braintreePaymentController)

export default router;