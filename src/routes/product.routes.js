import { Router } from 'express'
import {
    addProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
    filterProduct,
    getCatagories,
    editProduct,
    getSingleProduct,
    downloadProducts
} from '../controllers/product.controller.js'
import {upload} from "../middlewares/multer.middleware.js"

const router = new Router()

function dynamicUpload(req, res, next) {
  const variantPicFields = [];
  const maxVariants = 16; // Adjust based on your needs

  // Dynamically create field entries for multer
  for (let i = 0; i < maxVariants; i++) {
    variantPicFields.push({ name: `variantPic_1_[${i}]`, maxCount: 1 });
    variantPicFields.push({ name: `variantPic_2_[${i}]`, maxCount: 1 });
    variantPicFields.push({ name: `variantPic_3_[${i}]`, maxCount: 1 });
    variantPicFields.push({ name: `variantPic_4_[${i}]`, maxCount: 1 });
  }

  // Attach multer with dynamic fields
  upload.fields(variantPicFields)(req, res, next);
}

router.route('/add-product').post( 
    upload.fields([
        { name: "variantPic_1", maxCount: 16 }, 
        { name: "variantPic_2", maxCount: 16 },
        { name: "variantPic_3", maxCount: 16 },
        { name: "variantPic_4", maxCount: 16 },
    ])
    , addProduct)

router.route('/delete-product').delete(deleteProduct)
router.route('/get-product').get(getProduct)
router.route('/all-products').get(getAllProducts)
router.route('/filter-products').get(filterProduct)
router.route('/get-catagories').get(getCatagories)

// router.route('/edit-product').post(
//     upload.fields([
//       { name: "variantPic_1", maxCount: 16 },
//       { name: "variantPic_2", maxCount: 16 },
//       { name: "variantPic_3", maxCount: 16 },
//       { name: "variantPic_4", maxCount: 16 },
//     ]),
//     editProduct
//   );
router.route('/edit-product').post(dynamicUpload, editProduct);
router.route('/product').get(getSingleProduct)
router.route('/download-products').get(downloadProducts)

export default router