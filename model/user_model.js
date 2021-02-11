class UserLogin {
    constructor(id, name, password) {
        this.id = id ;
        this.username= name ;
        this.password = password ;
    }
}

class User {
    constructor(id, name,username, password, createDate, modifyDate,type) {
        this.id = id ;
        this.name= name ;
        this.username =  username;
        this.password= password ;
        this.type = type ;
        this.createDate = (!createDate)?" ":createDate ;
        this.modifyDate =  (!modifyDate)?" ":modifyDate ;
    }
}


module.exports = {
    UserLogin ,
    User
}