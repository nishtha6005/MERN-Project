const express = require('express')
const MenuController = require('../controller/controller.menu')
const auth = require('../middleware/middleware.auth')
const isAdmin = require('../middleware/middleware.admin')
const multer = require('multer')

let storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'_'+file.originalname)
    }
})

let upload = multer({storage : storage})

const router = express.Router()

router.get('/user/get/:quesNo',auth,MenuController.getMenuItemsForUser);

router.get('/get/all/:quesNo',auth,isAdmin,MenuController.getMenuItemsForAdmin);

router.post('/add',auth,isAdmin,upload.single('image'),MenuController.addMenuItem);

router.put('/update/:id',auth,isAdmin,upload.single('image'),MenuController.editMenuItem);

router.delete('/delete/:id',auth,isAdmin,MenuController.deleteMenuItem);

router.get('/search',auth, MenuController.search);

router.get('/get/available-menu-items/:quesNo',auth,isAdmin,MenuController.getAvailableItems)

router.get('/get/unavailable-menu-items/:quesNo',auth,isAdmin,MenuController.getUnavailableItems)

// ?sort=menuCreatedTime&?order=asc
router.get('/get/items',auth,MenuController.getCreatedAsc)

module.exports = router;