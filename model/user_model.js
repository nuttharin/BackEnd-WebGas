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

class UserRegister {
    constructor(username,password,name,type,createDate,modifyDate,
        personnelCode,positionCode,taxIdentificationNumber,	
        birthday,province,district,subDistrict,phone,	
        salary,businessLeave,sickLeave){
            this.name= name ;
            this.username =  username;
            this.password= password ;
            this.type = type ;
            this.personnelCode = personnelCode ;
            this.positionCode = positionCode ;
            this.taxIdentificationNumber = taxIdentificationNumber ;
            this.birthday = birthday ;
            this.province = province ;
            this.district = district ;
            this.subDistrict = subDistrict ;
            this.phone = phone;
            this.salary = salary ;
            this.businessLeave = businessLeave ;
            this.sickLeave = sickLeave ;
            this.createDate = (!createDate)?" ":createDate ;
            this.modifyDate =  (!modifyDate)?" ":modifyDate ;
        }
}

module.exports = {
    UserLogin ,
    User ,
    UserRegister
}