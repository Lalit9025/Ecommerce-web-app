import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken"



export const registerController = async (req,res) => {
    try {
        const {name,email,password,phone,address,answer} = req.body
        //validations
        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!email){
            return res.send({message:'Email is Required'})
        }
        if(!password){
            return res.send({message:'Password is Required'})
        }
        if(!phone){
            return res.send({message:'Phone no is Required'})
        }
        if(!address){
            return res.send({message:'address is Required'})
        }
        if(!answer){
            return res.send({message:'answer is Required'})
        }


        //check user
        const  existingUser = await userModel.findOne({email});

        //register user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'Already Register please login ',
            })
        }

        //register user
        const hashedPassword = await hashPassword(password);

        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer,
        }).save();

        res.status(201).send({
            success:true,
            message:"user registered",
            user,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in registration',
            error,
        })
    }
}


export const loginController = async (req,res)=>{
   try {
    const {email,password} = req.body;

    //validation
    if(!email || !password){
        return res.status(404).send({
            success:false,
            message:'Invalid email or password'
        })
    }
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(404).send({
            success:false,
            message:'error in login',
        })
    }
    const match = await comparePassword(password, user.password);
    
    if(!match){
        return res.status(200).send({
            success:false,
            message:'Invalid password'
        })
    }

    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).send({
        success:true,
        message:'login successfully',
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            answer:user.answer,
            role:user.role,
        },token
    })
    
   } catch (error) {
     console.log(error);
     res.status(500).send({
        success:false,
        message:'Error in login',
        error,
    })
   }
};

export const forgotPasswordController = async (req,res) => {
    try {
        const {email,answer,newPassword} = req.body;
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'newPassword is required'})
        }
        //check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong Email or Answer'
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully",
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"something went wrong",
            error,
        })
        
    }

}

export const testController = (req,res) => {
    try{
        res.send("Protected Routes");
    } catch(error){
        console.log(error);
        res.send({error});
    }
};

//profile update controller
export const updateProfileController = async (req,res) => {
    try {
        const {name, email,password,address,phone} = req.body;
        const user = await userModel.findById(req.user._id);
        if(password && password.length < 6){
            return res.json({error:'Password is requirerd and 6 character long'})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address

        },{new:true});

        res.status(200).send({
            success:true,
            message:'user updated successfully',
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'error in updating profile',
            error,
        })
    }

}

//orders
export const getOrdersController = async (req,res) => {
    try {
        const orders = await orderModel
        .find({buyer:req.user._id})
        .populate("products","-photo")
        .populate("buyer","name")
        .sort({createdAt : "-1"})
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error While Getting Orders',
            error
        })
    }

}

//all orders for admin panel
export const getAllOrdersController = async (req,res) => {
    try {
        const orders = await orderModel
        .find({})
        .populate("products","-photo")
        .populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error While Getting Orders',
            error
        })
    }
}

//order status
export const orderStatusController = async (req,res) => {
    try {
       const { orderId } = req.params; 
       const { status } = req.body;
       const orders = await orderModel.findByIdAndUpdate(
        orderId, 
        { status }, 
        {new:true}
        );
       res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error While Updating order',
            error
        })
    }
}