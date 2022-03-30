const Menu = require('../model/model.menu')


exports.getAllMenuItems= async (request,response)=>{
    let limit = 2
    try
    {
        const length = await Menu.find({isDeleted:false}).count()
        const user = await Menu.find({isDeleted:false}).sort({menuCreatedTime:-1}).limit(limit).skip()
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

// exports.getCreatedAsc = async (request,response)=>{
//     let limit = 2
//     let skip=request.params.quesNo
//     try
//     {
//         const length = await Menu.find({isDeleted:false}).count()
        
//         const user = await Menu.find({isDeleted:false}).sort({menuCreatedTime:1}).limit(limit).skip(skip)
        
//         response.status(200).send({
//             success:true,
//             user:request.rootUser,
//             // token:request.token,
//             items:user,
//             length:length
//         })
//     }
//     catch(err)
//     {
//         response.status(400).send({
//             error: 'Your request could not be processed. Please try again.'
//         });
//     }
// }

exports.search=(req,res)=>{
    let pname = req.query.menu
    if(pname!=null)
    {
        Menu.find({itemName:{$regex:pname,$options:/i/},isDeleted:false})
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

exports.getOneMenuItem= async (request,response)=>{
    let limit = 2
    let skip=request.params.quesNo
    try
    {
        const length = await Menu.find({isDeleted:false}).count()
        const user = await Menu.find({isDeleted:false}).sort({menuCreatedTime:-1}).limit(limit).skip(skip)
        response.status(200).send({
            success:true,
            user:request.rootUser,
            // token:request.token,
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

exports.getMenuItemsForUser= async (request,response)=>{
    let limit = 2
    let skip=request.params.quesNo
    try
    {
        const length = await Menu.find({isDeleted:false,isAvailable:true}).count()
        const user = await Menu.find({isDeleted:false,isAvailable:true}).sort({menuCreatedTime:-1}).limit(limit).skip(skip)
        response.status(200).send({
            success:true,
            user:request.rootUser,
            // token:request.token,
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
