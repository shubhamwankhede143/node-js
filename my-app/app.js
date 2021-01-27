const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('sample','aiknowshubham','Shubham@sw1',{
    host : 'localhost',
    dialect : 'postgres'
})

const main = async() => {
    try{
        await sequelize.authenticate()
        console.log('Database connection established')
    }catch(e){
        console.log('Error in database connection')
    }
}
main()