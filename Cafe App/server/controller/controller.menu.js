const Menu = require('../model/model.menu')

exports.getAllMenuItems=(request,response)=>{
    Menu.find()
    .then(res=>{
        response.status(200).send({
            success:true,
            user:request.rootUser,
            // token:request.token,
            items:res,
            length:res.length
        })
    })
    .catch(error=>{
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
          });
    })
}

exports.getOneMenuItem=(request,response)=>{
    const query={_id:request.params.id}
    Menu.findById(query)
    .then(res=>{
        response.status(200).send({
            success:true,
            product:res
        })
    })
    .catch(error=>{
        response.status(400).send({
            error: 'Your request could not be processed. Please try again.'
        })
    })
}

exports.addMenuItem=(request,response)=>{
    console.log(request.file)
    const menu = new Menu({
        itemName:request.body.itemName,
        description:request.body.description,
        price:request.body.price,
        isAvailable:request.body.isAvailable,
        image:request.file.filename,
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
        image:request.file.filename,
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
