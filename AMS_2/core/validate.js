function Validate() {};

Validate.prototype = {

    check : function(body,callback){
        c = 0
        for(prop in body){
            if(body[prop] == ""){
                c += 1
            }
        }
        if(c>0){
            callback(true)
        }
        else{
            callback(false)
        }
    }
}

module.exports = Validate;