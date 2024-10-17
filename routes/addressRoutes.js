import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import { addAddress, setDefaultAddress, updateAddress, deleteAddress, getUserAddresses } from '../controllers/addressController.js';

router.post('/add', verifyToken, addAddress);
router.put('/default/:id', verifyToken, setDefaultAddress);
router.put('/update/:id', verifyToken, updateAddress);
router.delete('/delete/:id', verifyToken, deleteAddress);
router.get('/', verifyToken, getUserAddresses);
 
export default router;