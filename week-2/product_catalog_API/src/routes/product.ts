import { Router }  from "express";
import dotenv from 'dotenv';
import { PrismaClient } from '../../generated/prisma';
import { AuthMiddleware } from '../middlewares/authMiddleware';

dotenv.config();
const prisma = new PrismaClient();
const router = Router();
const authMiddleware = new AuthMiddleware();



/**
 * list all products
 */
router.get('/',authMiddleware.authenticateToken,  async (req,res)=>{
  try {
      // Get userId from JWT payload
    const userId = (req as any).userId;

  const products = await prisma.product.findMany({
      where: { userId }
    });
    if(products.length==0){
      res.send("products is Empty");
    }else{
       res.json({ products });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// create a product
  router.post('/', authMiddleware.authenticateToken, async(req,res)=>{
        
    try {
        // Get userId from JWT payload
       const userId = (req as any).userId;;

      console.log(userId+"userId")
      const {title , price} = req.body
      console.log(title+"price"+price);
      // Optional: basic input validation
      if (!title || price === undefined) {
        return res.status(400).json({ message: "Title and price are required" });
      }

      console.log(userId);
      const product =  await prisma.product.create({
        data: {
            title : title,
            price : parseFloat(price),
            user: {
              connect: { userId }  // must use connect
            }   
        },
      }) 
      console.log(product);
      res.status(201).json({ message: "Product created", product });
    } catch (error) {
      res.status(500).json({"create product ": error});
    }
  });


router.put('/:id', authMiddleware.authenticateToken, async(req,res)=>{
      
  try {
    const productId = parseFloat(req.params.id);
    // Get userId from JWT payload
    const userId = (req as any).userId; 
    const {title, price} = req.body;
    const product = await prisma.product.findUnique({
      where: { productId },
    });

    if (!product || product.userId !== userId) {
      return res.status(404).json({ message: "Product not found or not owned by you" });
    }

    const updatedProduct = await prisma.product.update({
      where: { productId },
      data: { title, price },
    })

   res.json({ message: "Product updated", product: updatedProduct });

  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
    }
});



router.get('/:id', authMiddleware.authenticateToken, async(req,res)=>{
      
    try {
    const productId = parseInt(req.params.id);
    const userId = (req as any).userId;

    const product = await prisma.product.findUnique({
      where: { productId },
    });

    if (!product || product.userId !== userId) {
      return res.status(404).json({ message: "Product not found or not owned by you" });
    }

    res.json({ message: "Product found", product });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
});


router.delete('/:id', authMiddleware.authenticateToken, async(req,res)=>{
      
    try {
    const productId = parseInt(req.params.id);
    const userId = (req as any).userId;

    const product = await prisma.product.findUnique({
      where: { productId },
    });

    if (!product || product.userId !== userId) {
      return res.status(404).json({ message: "Product not found or not owned by you" });
    }

    await prisma.product.delete({
      where: { productId },
    });


    res.json({ message: "Product deleted", product });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
});


export default router;