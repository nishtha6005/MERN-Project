const Menu = require('../model/model.menu')

// GET MENU ITEM FOR ADMIN API
exports.getMenuItemsForAdmin= async (request,response)=>{
    let limit = 3
    let skip=request.params.quesNo
    try
    {
        const length = await Menu.find({isDeleted:false}).count()
        const menu = await Menu.find({isDeleted:false}).sort({menuCreatedTime:-1}).limit(limit).skip(skip)
        response.status(200).send({
            success:true,
            user:request.rootUser,
            items:menu,
            length:length
        })
    }
    catch(err)
    {
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        });

    }
}


// GET MENU ITEMS FOR USER API
exports.getMenuItemsForUser= async (request,response)=>{
    let limit = 4
    let skip=request.params.quesNo
    try
    {
        const length = await Menu.find({isDeleted:false,isAvailable:true}).count()
        const user = await Menu.find({isDeleted:false,isAvailable:true}).sort({menuCreatedTime:-1}).limit(limit).skip(skip)
        response.status(200).send({
            success:true,
            user:request.rootUser,
            items:user,
            length:length
        })
    }
    catch(err)
    {
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        });

    }
}


// ADD MENU ITEM API
exports.addMenuItem=(request,response)=>{
    console.log(request.file)
    const menu = new Menu({
        itemName:request.body.itemName,
        description:request.body.description,
        price:request.body.price,
        isAvailable:request.body.isAvailable,
        image:request.file? request.file.filename : null,
        menuCreatedTime:Date.now(),
        menuUpdateTime:Date.now()
    })
    menu.save()
    .then(res=>{
        response.status(200).send({
            success: true,
            message:'Menu Item added',
            products: res
        })
    })
    .catch(error=>{
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        });
    })
}

// UPDATE MENU ITEM API
exports.editMenuItem=(request,response)=>{
    const query={_id:request.params.id}
    const update={
        itemName:request.body.itemName,
        description:request.body.description,
        price:request.body.price,
        isAvailable:request.body.isAvailable,
        image:request.file? request.file.filename : null,
        menuUpdateTime:Date.now()
    }
    Menu.findByIdAndUpdate(query,update)
    .then(res=>{
        response.status(200).send({
            success:true,
            message:"Menu item updated"
        })
    })
    .catch(error=>{
        response.status(400).send({
            error:'Your request could not be processed. Please try again.'
        })
    })
}


// DELETE MENU ITEM API
exports.deleteMenuItem=(request,response)=>{
    const query={_id:request.params.id}
    const update={
        isDeleted:true,
        isAvailable:false,
        menuUpdateTime:Date.now()
    }
    Menu.findByIdAndUpdate(query,update)
    .then(res=>{
        response.status(200).send({
            success: true,
            message:'Menu item deleted',
        })
    })
    .catch(error=>{
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        });
    })
}

// SEARCH MENU ITEMS BY NAME API
exports.search=(req,res)=>{
    let pname = req.query.menu
    limit=3
    if(pname)
    {
        Menu.find({itemName:{$regex:pname,$options:/i/},isDeleted:false}).sort({menuCreatedTime:-1}).limit(3)
        .then(result=>{
                res.status(200)
                .send({
                    success:true,
                    length:result.length,
                    search:result
                })            
        })
        .catch(error=>{
            res.status(400).json({
                error: 'Your request could not be processed. Please try again.'
              });
        })
    }
}


// GET AVAILABLE MENU ITEMS API
exports.getAvailableItems = async (request,response)=>{
    let limit = 3
    let skip=request.params.quesNo
    try
    {
        const length = await Menu.find({isDeleted:false,isAvailable:true}).count()
        const menu = await Menu.find({isDeleted:false,isAvailable:true}).sort({menuCreatedTime:-1}).limit(limit).skip(skip)
        response.status(200).send({
            success:true,
            user:request.rootUser,
            items:menu,
            length:length
        })
    }
    catch(err)
    {
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        });

    }
}


// GET UNAVAILABLE MENU ITEMS API
exports.getUnavailableItems= async (request,response)=>{
    let limit = 3
    let skip=request.params.quesNo
    try
    {
        const length = await Menu.find({isDeleted:false,isAvailable:false}).count()
        const menu = await Menu.find({isDeleted:false,isAvailable:false}).sort({menuCreatedTime:-1}).limit(limit).skip(skip)
        response.status(200).send({
            success:true,
            user:request.rootUser,
            items:menu,
            length:length
        })
    }
    catch(err)
    {
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        });

    }
}


// SORT MENU ITEMS : PRICE / MENU CREATED TIME APIS
exports.getCreatedAsc = async (request,response)=>{
    let limit = 4
    let field=request.query.sort
    let order = request.query.order === 'asc' ? 1 : -1
    try
    {
        console.log(field, order)
        const length = await Menu.find({isDeleted:false,isAvailable:true}).count()
        console.log(length)
        if (field == 'price')
        {
            console.log('Price')
            const user = await Menu.find({isDeleted:false,isAvailable:true}).sort({price:order}).limit(limit)
            response.status(200).send({
                success:true,
                user:request.rootUser,
                items:user,
                length:length
            })
        }
        else if (field == "menuCreatedTime")
        {
            console.log('Menu')
            const user = await Menu.find({isDeleted:false}).sort({menuCreatedTime:order}).limit(limit)
            response.status(200).send({
                success:true,
                user:request.rootUser,
                items:user,
                length:length
            })
        }
        
    }
    catch(err)
    {
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        });
    }
}




