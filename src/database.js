const Sequelize = require('sequelize')

var db = {}

const sequelize = new Sequelize(
    'taekwonblock',
    'root',
    'root',
    {
        host: 'localhost',
        port: '3306',
        dialect: 'mysql',
        define: {
            freezeTableName: true,
        },
        pool: {
            max: 50,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        // <http://docs.sequelizejs.com/manual/tutorial/querying.html#operators>
        operatorsAliases: false,
    },
)

let models = [
    require('./models/assn_dojo.js'),
    require('./models/assosiation.js'),
    require('./models/career.js'),
    require('./models/certificate.js'),
    require('./models/course.js'),
    require('./models/dojo.js'),
    require('./models/fitness.js'),
    require('./models/history.js'),
    require('./models/instructor.js'),
    require('./models/student.js'),
    require('./models/training.js'),
    require('./models/web_user.js'),
    require('./models/enrollment.js'),
    require('./models/mobile_user.js'),
    require('./models/issuance.js'),
]

// Initialize models
models.forEach(model => {
    const seqModel = model(sequelize, Sequelize)
    db[seqModel.name] = seqModel
})

// Apply associations
Object.keys(db).forEach(key => {
    if ('associate' in db[key]) {
        db[key].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db