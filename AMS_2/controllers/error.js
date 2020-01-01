exports.get404 = (req,res,next)=>{
    //console.log('404 error page')
    res.status(404).render('404' ,{title:'Page not found'});
    next();
};

exports.get500= (req,res,next)=>{
    //console.log('500 error page')
    res.status(500).render('500' ,{title:'Server Error'});

}
