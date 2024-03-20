import productModel from '../models/productModel.js'
import slugify from 'slugify'
import fs from 'fs';


export const createProductController = async (req,res) => {
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const { photo} = req.files;
        
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !description:
                return res.status(500).send({error:'Description is Required'})
            case !price:
                return res.status(500).send({error:'Price is Required'})
            case !category:
                 return res.status(500).send({error:'Category is Required'})
            case !quantity:
                 return res.status(500).send({error:'Quantity is Required'})
            case photo && photo.size > 1000000:
                 return res.status(500).send({error:'Photo is Required and should be less than 1 mb'})       
        }
        const product = new productModel({
            name,
            slug: slugify(name),
            description,
            price,
            category,
            quantity,
            shipping
        });

       if (photo) {
            const imageData = await fs.promises.readFile(photo.path);
            product.photo.data = imageData;
            product.photo.contentType = photo.type;
        }
        await product.save()
        res.status(201).send({
            success:true,
            message:'Product Created Successfully',
            product,
        })
        
    } catch (error) {
        console.log(error)
        res.status(200).send({
            success:false,
            message:'error while creating product',
            error
        })
        
    }
}

//to getall a product
export const getProductController = async (req,res) => {
    try {
        const products = await productModel.find({}).select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:'got All products',
            products,
            totalcount: products.length

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting product',
            error:error.message
        })
        
    }

}

// to get a single product
export const getSingleproduct = async (req,res) => {
    try {
        const {slug} = req.params
        const product = await productModel.findOne({slug}).select("-photo").populate("category")
        res.status(200 ).send({
            success:true,
            message:"Got the single product",
            product
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting product',
            error:error.message
        })
        
    }
}

//to get the product photo
export const productPhotoController = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.pid).select("photo");
      if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erorr while getting photo",
        error,
      });
    }
  };

//delete the product
export const deleteProductController = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:'Product deleted successfully',
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in deleting product',
            error
        })
        
    }

}

//update the product
export const updateProductController = async (req,res) => {
    try {
        const {name,description,price,category,quantity,shipping} = req.fields;
        const { photo} = req.files;
        
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !description:
                return res.status(500).send({error:'Description is Required'})
            case !price:
                return res.status(500).send({error:'Price is Required'})
            case !category:
                 return res.status(500).send({error:'Category is Required'})
            case !quantity:
                 return res.status(500).send({error:'Quantity is Required'})
            case photo && photo.size > 1000000:
                 return res.status(500).send({error:'Photo is Required and should be less than 1 mb'})       
        }
        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            {...req.fields, slug:slugify(name)},
            {new:true}
            )
       if (photo) {
            // const imageData = await fs.promises.readFile(photo.path);
            // product.photo.data = imageData;
            // product.photo.contentType = photo.type;
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save()
        res.status(201).send({
            success:true,
            message:'Product updated Successfully',
            product,
        })
        
    } catch (error) {
        console.log(error)
        res.status(200).send({
            success:false,
            message:'error while updating product',
            error
        })
        
    }
}

//to filter the product by price and category
export const productFiltersController = async (req,res) => {
    try {
        const {checked, radio} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while Filtering products',
            error
        })
        
    }
}

//product count

export const productCountController = async (req,res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total,
        })

        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'error in product count',
            error,
        })
    }

}

//product list based on page
export const productListController = async (req,res) => {
    try {
       const perPage = 2; 
       const page = req.params.page ? req.params.page : 1;
       const products = await productModel
       .find({})
       .select("-photo")
       .skip((page-1)*perPage)
       .limit(perPage)
       .sort({createdAt:-1});
       res.status(200).send({
        success:true,
        products,
       })
    } catch (error) {
        console.log(error),
        res.status(400).send({
            success:false,
            message:'Error in per page ctrl',
            error
        })
    }
}

//search product controller
export const searchProductController = async (req,res) => {
    try {
        const {keyword} = req.params;
        const results = await productModel.find({
            $or : [
                {name:{$regex : keyword, $options:"i"}},
                {description:{$regex : keyword, $options:"i"}}
            ]
        }).select("-photo");
        res.json(results);
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error in searching",
            error,
        })
    }

}

//similar products
export const relatedProductController  = async (req,res) => {
    try {
        const {pid, cid} = req.params;
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(3).populate("category");

        res.status(200).send({
            success:true,
            message:'got similar products successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error in getting similar products',
            error
        })
    }
}