import express from "express";
import { 
    forgotPasswordController, 
    getAllOrdersController, 
    getOrdersController, 
    loginController, 
    orderStatusController, 
    registerController, 
    testController, 
    updateProfileController
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";



//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login",loginController);

//Forget Password
router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSignIn,isAdmin,testController);

//protected user-route
router.get("/user-auth",requireSignIn, (req, res) => {
    res.status(200).send({ok:true});
})

//protected Admin-route
router.get("/admin-auth",requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok:true});
})

//update profile
router.put('/profile',requireSignIn, updateProfileController)

//orders
router.get('/orders',requireSignIn, getOrdersController)

//ALL orders for admin panel
router.get('/all-orders',requireSignIn,isAdmin, getAllOrdersController);

//to update the status
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router;