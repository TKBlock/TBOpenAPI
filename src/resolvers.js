
const { GraphQLScalarType } = require('graphql');
const promisesAll = require('promises-all');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const md5 = require('md5');
const uuid = require('uuid/v4');

const saltRounds = 10;

const role = ["Dojo", "Assn"]

module.exports = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A date and time, represented as an ISO-8601 string',
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
  }),

  Query: {
    webUsers: async(obj, args, { db }, info) => db.web_user.findAll(),
    webUser: async(obj, args, { db }, info) => {
      return db.web_user.findOne({ 
        where: {email: args.email} 
      })
    },

    registratedUser: async(obj, args, { db }, info) => {

      // return db.training.findAll({
      //   where: {
      //     dojo_uuid: args.uuid,
      //     state: args.state
      //   }
      // })
      // .then(result => {
      //   console.log(result);
      // })

      let query = `
        select student.*, training.state
        from training, student
        where training.dojo_uuid=:uuid AND training.state=:state AND student.mobile_user_uuid = training.user_uuid
      `

      let values = {
        uuid: args.uuid,
        state: args.state
      }

      return db.sequelize.query(query, {replacements: values})
      .spread(function (results, metadata) {
        // 쿼리 실행 성공
        console.log(results[0]);
        return results;
  
      }, function (err) {
        // 쿼리 실행 에러

        console.error("=====================")
        console.error(err);
        console.error("=====================")
        throw err
      });

    },

    registratedInstructor: async(obj, args, { db }, info) => {
      let query = `
        select instructor.*, career.state
        from career, instructor
        where career.dojo_uuid=:uuid AND career.state=:state AND instructor.mobile_user_uuid = career.user_uuid
      `

      let values = {
        uuid: args.uuid,
        state: args.state
      }

      return db.sequelize.query(query, {replacements: values})
      .spread(function (results, metadata) {
        // 쿼리 실행 성공
        console.log(results[0]);

        if(results.length <= 0) {
          return [];
        }

        return results;

      }, function (err) {
        // 쿼리 실행 에러

        console.error("=====================")
        console.error(err);
        console.error("=====================")
        throw err
      });

    },

    mobileUser: async(obj, args, { db }, info) => {

      if(args.type == 1) {
        return db.student.findOne({
          where: {
            mobile_user_uuid: args.uuid
          } 
        })

      } else if(args.type == 2) {
        return db.instructor.findOne({
          where: {
            mobile_user_uuid: args.uuid
          } 
        })

      }

    },

    enrollmentByState: async(obj, args, { db }, info) => {
      return db.enrollment.findAll({
        where: {
          dojo_uuid: args.dojo_uuid,
          course_IDX: args.course_idx,
          state: args.state
        }
      })
      .then(results => {
        // console.log(results[0].dataValues);

        if(results && results.length > 0) {
          return promisesAll.all(
            results.map(  ({dataValues})  => {
              return db.student.findOne({
                where: {
                  mobile_user_uuid: dataValues.user_uuid
                }
              })
              .then( result => {
                return {
                  ...result.dataValues,
                  registered_date: dataValues.registered_date,
                  start_date: dataValues.start_date,
                  end_date: dataValues.end_date,
                }
              })
            })
          )
          .then( ({resolve, reject}) => {
  
            console.log(resolve);
          
            return resolve;
          })

        }
        
        return [];

      })

    },

    enrollmentForMobile: async(obj, args, { db }, info) => {
      return db.enrollment.findAll({
        where: {
          user_uuid: args.user_uuid,
          state: args.state
        }
      })
    },

    assosiations: async(obj, args, { db }, info) => {
      // return db.assosiation.findAll()

      const statusText = ["", "신청 중", "승인", "거부"];

      return db.sequelize.query(`
        select A.*, B.status
        from assosiation as A 
        LEFT OUTER JOIN ( select * from assn_dojo where dojo_uuid="${args.web_user_uuid}") as B
        ON A.web_user_uuid = B.assn_uuid
        ORDER BY status desc
      `)
      .then(([results, metadata]) => {
        console.log(results);

        return results.map( (dataValues) => {
          let list = [];
        
          console.log(dataValues.status);
  
          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);
  
          return {
            images : list,
            ...dataValues,
            status: statusText[dataValues.status],
          }
        })
      })
      .catch(err => {

        console.log(err)
      })

    },
    assosiationsByState: async(obj, args, { db }, info) => {
      // return db.assosiation.findAll()

      const statusText = ["", "신청 중", "승인", "거부"];

      return db.sequelize.query(`
        select A.*, B.status
        from assosiation as A 
        JOIN ( select * from assn_dojo where dojo_uuid="${args.web_user_uuid}" And status="${args.state}") as B
        ON A.web_user_uuid = B.assn_uuid
        ORDER BY status desc
      `)
      .then(([results, metadata]) => {
        console.log(results);
        console.log(metadata);

        return results.map( (dataValues) => {
          let list = [];
        
          console.log(dataValues.status);
  
          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);
  
          return {
            images : list,
            ...dataValues,
            status: statusText[dataValues.status],
          }
        })
      })
      .catch(err => {

        console.log(err)
      })

    },
    assosiation: async(obj, args, { db }, info) => {
      return db.assosiation.findOne(
        { where: {web_user_uuid: args.web_user_uuid} }
      )
      .then( ( {dataValues} ) => {
        let list = [];
        
        console.log(dataValues);

        if(dataValues.image1) list.push(dataValues.image1);
        if(dataValues.image2) list.push(dataValues.image2);
        if(dataValues.image3) list.push(dataValues.image3);
        if(dataValues.image4) list.push(dataValues.image4);
        if(dataValues.image5) list.push(dataValues.image5);

        return {
          images : list,
          ...dataValues
        }
      })
    },

    historiesForStudent: async(obj, args, { db }, info) => {
      let query = `
      select dojo.dojo_name, t.fixed_name, t.state, t.start_date, t.end_date 
        from (select * from enrollment 
        where user_uuid = :uuid and state = 2) as t 
        join dojo on dojo.web_user_uuid = t.dojo_uuid
        
      `

      let values = {
        uuid: args.user_uuid,
      }


      return db.sequelize.query(query, {
        replacements: values,
        type: db.sequelize.QueryTypes.SELECT
      })
      .then(result => {

        result.map( x => {
          x.course_name = x.fixed_name
        })

        return result;

      })

    },


    historiesForInstructor: async(obj, args, { db }, info) => {
      let query = `
      select dojo.dojo_name, t.state, t.start_date, t.end_date 
        from (select * from career
        where user_uuid = :uuid and state in (2, 3) ) as t 
        join dojo on dojo.web_user_uuid = t.dojo_uuid
        
      `

      let values = {
        uuid: args.user_uuid,
      }


      return db.sequelize.query(query, {
        replacements: values,
        type: db.sequelize.QueryTypes.SELECT
      })
      .then(result => {

        console.log(result);

        return result;
      })

    },


    dojos: async(obj, args, { db }, info) => {
      return db.dojo.findAll()
      .then(results => {
        console.log(results);

        return results.map( ({dataValues}) => {
          let list = [];
        
          console.log(dataValues);
  
          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);
  
          return {
            images : list,
            ...dataValues
          }
        })
      })
    
    },

    dojo: async(obj, args, { db }, info) => {
      return db.dojo.findOne(
        { where: {web_user_uuid: args.web_user_uuid} }
      )
      .then( ( {dataValues} ) => {
        let list = [];
        
        console.log(dataValues);

        if(dataValues.image1) list.push(dataValues.image1);
        if(dataValues.image2) list.push(dataValues.image2);
        if(dataValues.image3) list.push(dataValues.image3);
        if(dataValues.image4) list.push(dataValues.image4);
        if(dataValues.image5) list.push(dataValues.image5);

        return {
          images : list,
          ...dataValues,
        }
      })
    },

    searchDojoName: async(obj, args, { db }, info) => {
      return db.dojo.findAll({
        where: {
          dojo_name: {
            [db.Sequelize.Op.like]: `%${args.keyword}%`
          }
        }
      })
      .then(results => {
        console.log(results);

        return results.map( ({dataValues}) => {
          let list = [];
        
          console.log(dataValues);
  
          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);
  
          return {
            images : list,
            ...dataValues
          }
        })
      })
    },

    registratedDojo: async(obj, args, { db }, info) => {
      let query = `
      select dojo.*, training.registered_date 
      from training, dojo
      where training.user_uuid = :uuid 
        AND training.dojo_uuid = dojo.web_user_uuid
      `

      let values = {
        uuid: args.mobile_user_uuid,
      }


      return db.sequelize.query(query, {
        replacements: values,
        type: db.sequelize.QueryTypes.SELECT
      })
      .then(results => {
        // 쿼리 실행 성공

        console.log(results);


        results.map(x => {
          let list = [];

          if(x.image1) list.push(x.image1);
          if(x.image2) list.push(x.image2);
          if(x.image3) list.push(x.image3);
          if(x.image4) list.push(x.image4);
          if(x.image5) list.push(x.image5);

          x.images = list;
        })
        
        console.log(results);

        // return results;

        let innerQuery = `
        select course.* 
        from enrollment, course
        where user_uuid = :uuid
          AND enrollment.course_IDX = course.IDX
          AND course.dojo_uuid = :dojo_uuid
          AND enrollment.state = 1
        `  

        return promisesAll.all(
          results.map( (x) => {
            
            let innerValues = {
              uuid: args.mobile_user_uuid,
              dojo_uuid: x.web_user_uuid
            }



            return db.sequelize.query(innerQuery, {
              replacements: innerValues,
              type: db.sequelize.QueryTypes.SELECT
            })
            .then( courseRes => {
              console.log("courseRes");
              console.log(courseRes);

              courseRes.map( c => {
                let list = [];

                if(c.image1) list.push(c.image1);
                if(c.image2) list.push(c.image2);
                if(c.image3) list.push(c.image3);
                if(c.image4) list.push(c.image4);
                if(c.image5) list.push(c.image5);
        
                c.images = list;
              })

              x.courses = courseRes;

              return x;
            })
          })
        ).then( ({ resolve, reject, message }) => {

          console.log(resolve);
          return resolve;
        })

      })
      .catch(err => {
        // 쿼리 실행 에러

        console.error("=====================")
        console.error(err);
        console.error("=====================")
        throw err
      });
    },

    joinedDojo: async(obj, args, { db }, info) => {
      let query = `
      select dojo.*, career.start_date 
      from career, dojo
      where career.user_uuid = :uuid 
        AND career.dojo_uuid = dojo.web_user_uuid
      `

      let values = {
        uuid: args.mobile_user_uuid,
      }


      return db.sequelize.query(query, {
        replacements: values,
        type: db.sequelize.QueryTypes.SELECT
      })
      .then(results => {
        // 쿼리 실행 성공

        console.log(results);


        results.map(x => {
          let list = [];

          if(x.image1) list.push(x.image1);
          if(x.image2) list.push(x.image2);
          if(x.image3) list.push(x.image3);
          if(x.image4) list.push(x.image4);
          if(x.image5) list.push(x.image5);

          x.images = list;
        })
        
        console.log(results);

        return results;
      })
      .catch(err => {
        // 쿼리 실행 에러

        console.error("=====================")
        console.error(err);
        console.error("=====================")
        throw err
      });
    },


    requestingDojos: async(obj, args, {db}, info) => {
      return db.sequelize.query(`
        select * 
        from dojo 
        where web_user_uuid in (
          select dojo_uuid 
          from assn_dojo 
          where assn_uuid = "${args.web_user_uuid}" and status=1
        );
      `)
      .then(([results, metadata]) => {
        // console.log(results);

        return results.map( (dataValues) => {
          let list = [];
        
          console.log(dataValues.status);

          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);

          return {
            images : list,
            ...dataValues,
            status: 1,
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
      
    },
    assignedDojos: async(obj, args, {db}, info) => {
      return db.sequelize.query(`
        select * 
        from dojo 
        where web_user_uuid in (
          select dojo_uuid 
          from assn_dojo 
          where assn_uuid = "${args.web_user_uuid}" and status=2
        );
      `)
      .then(([results, metadata]) => {
        // console.log(results);

        return results.map( (dataValues) => {
          let list = [];
        
          console.log(dataValues.status);

          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);

          return {
            images : list,
            ...dataValues,
            status : 2, 
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
      
    },


    dojoRegState: async(obj, args, {db}, info) => {
      return db.training.findOne({
        where: {
          dojo_uuid: args.dojo_uuid,
          user_uuid: args.user_uuid
        }
      })
      .then(result => {

        if (result == null || result.length == 0) {
          return {
            dojo_uuid: args.dojo_uuid,
            state: 0
          }
        } else {
          return {
            dojo_uuid: args.dojo_uuid,
            state: result.dataValues.state
          }
        }
      })
    },

    dojoJoinState: async(obj, args, {db}, info) => {
      return db.career.findOne({
        where: {
          dojo_uuid: args.dojo_uuid,
          user_uuid: args.user_uuid
        }
      })
      .then(result => {

        if (result == null || result.length == 0) {
          return {
            dojo_uuid: args.dojo_uuid,
            state: 0
          }
        } else {
          return {
            dojo_uuid: args.dojo_uuid,
            state: result.dataValues.state
          }
        }
      })
    },



    courses: async(obj, args, { db }, info) => {
      return db.course.findAll(
        { where: {dojo_uuid: args.dojo_uuid}}
      )
      .then(results => {
        console.log(results);

        return results.map( ({dataValues}) => {
          let list = [];
        
          console.log(dataValues);
  
          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);
  
          return {
            images : list,
            ...dataValues
          }
        })
      })
    },

    coursesWithState: async(obj, args, { db }, info) => {
      let query = `
        select course.*, B.state
        from course
        LEFT OUTER JOIN (
          select * from enrollment 
          where enrollment.dojo_uuid = :dojo_uuid
          AND enrollment.user_uuid = :user_uuid
          AND enrollment.end_date is NULL
          ) as B
        ON B.course_IDX = course.IDX
        WHERE course.dojo_uuid = :dojo_uuid
      `

      let values = {
        dojo_uuid: args.dojo_uuid,
        user_uuid: args.user_uuid
      }

      return db.sequelize.query(
        query, {
          replacements: values,
          type: db.sequelize.QueryTypes.SELECT
        })
      .then( result => {
        console.log(result)

        result.map( c => {

          let list = [];

          if(c.image1) list.push(c.image1);
          if(c.image2) list.push(c.image2);
          if(c.image3) list.push(c.image3);
          if(c.image4) list.push(c.image4);
          if(c.image5) list.push(c.image5);
  
          c.images = list;
        })

        return result;
      })
      
    },

    certificates: async(obj, args, { db }, info) => {
      return db.certificate.findAll({
        where: {
          uuid: args.uuid
        }
      })
      .then(results => {
        console.log(results);

        return results.map( ({dataValues}) => {
          let list = [];
        
          console.log(dataValues);
  
          if(dataValues.image1) list.push(dataValues.image1);
          if(dataValues.image2) list.push(dataValues.image2);
          if(dataValues.image3) list.push(dataValues.image3);
          if(dataValues.image4) list.push(dataValues.image4);
          if(dataValues.image5) list.push(dataValues.image5);
  
          return {
            images : list,
            ...dataValues
          }
        })
      })
    },

    weixinLogin: async(obj, args, { db, dataSources }, info) => {

      console.log("weixinLogin")

      return dataSources.weixinAPI.registerUser({
        appid: args.appid,
        code: args.code
      })
      .then(wexinResult => {
        console.log(wexinResult);
        console.log(wexinResult.openid);

        return db.mobile_user.findOne({
          where: {
            //openid: "12345678abcdef" //result.openid
            openid: wexinResult.openid
          }
        })
        .then(userResult => {
          console.log(userResult);

          if(userResult == null) {
            return {
              hasAccount: false,
              ...wexinResult
            }

          } else {
            
            let type = userResult.dataValues.account_type;
            
            if(type == 1) {
              return db.student.findOne({
                where : {
                  mobile_user_uuid: userResult.dataValues.uuid
                }
              })
              .then( result => {
                return {
                  hasAccount: true,
                  uuid: userResult.dataValues.uuid,
                  type: userResult.dataValues.account_type,
                  name: result.dataValues.name,
                  ...wexinResult
                }
              })
              .catch( err => {
                throw err
              })

            } else if (type ==2) {
              return db.instructor.findOne({
                where : {
                  mobile_user_uuid: userResult.dataValues.uuid
                }
              })
              .then( result => {
                return {
                  hasAccount: true,
                  uuid: userResult.dataValues.uuid,
                  type: userResult.dataValues.account_type,
                  name: result.result.name,
                  ...wexinResult
                }
    
              })
              .catch( err => {
                throw err
              })

            } else {
              throw {
                message: "account_type error"
              }
            }


          }
        })
        .catch( err => {
          console.error("=====================")
          console.error(err);
          console.error("=====================")
  
          throw {
            status: 400,
            message: 'Login Error',
          }
        })

      })
    },

    googleLogin: async(obj, args, { db, dataSources }, info) => {
      return db.mobile_user.findOne({
        where: {
          openid: args.email
        }
      })
      .then(userResult => {
        console.log(userResult);

        if(userResult == null) {
          console.log(userResult);

          return {
            hasAccount: false,
          }

        } else {
          
          let type = userResult.dataValues.account_type;
          
          if(type == 1) {
            return db.student.findOne({
              where : {
                mobile_user_uuid: userResult.dataValues.uuid
              }
            })
            .then( result => {
              return {
                hasAccount: true,
                uuid: userResult.dataValues.uuid,
                type: userResult.dataValues.account_type,
                name: result.dataValues.name,
              }
            })
            .catch( err => {
              throw err
            })

          } else if (type ==2) {
            return db.instructor.findOne({
              where : {
                mobile_user_uuid: userResult.dataValues.uuid
              }
            })
            .then( result => {
              return {
                hasAccount: true,
                uuid: userResult.dataValues.uuid,
                type: userResult.dataValues.account_type,
                name: result.dataValues.name,
              }
  
            })
            .catch( err => {
              throw err
            })

          } else {
            throw {
              message: "account_type error"
            }
          }


        }
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        throw {
          status: 400,
          message: 'Login Error',
        }
      })
    },

    issuancesForDojo: async(obj, args, { db, dataSources }, info) => {

      let stateTexts = ["", "신청 중", "발급 완료", "신청 거부"]

      console.log(args);

      let query = `
        select assosiation.assn_name, student.name as user_name, issuance.* from issuance
        Join assosiation ON issuance.assn_uuid = assosiation.web_user_uuid
        Join student ON issuance.user_uuid = student.mobile_user_uuid
        where issuance.dojo_uuid = :dojo_uuid
      `

      let values = {
        dojo_uuid: args.web_user_uuid,
      }

      return db.sequelize.query(
        query, {
          replacements: values,
          type: db.sequelize.QueryTypes.SELECT
        }
      )
      .then(result => {
        console.log(result);

        result.map( data => {
          if(data.state == 1 || data.state == 3) {
            data.list_date = data.request_date
          } else if(data.state == 2) {
            data.list_date = data.issue_date
          }

          data.stateText = stateTexts[data.state];
        })

        return result;

      })

    },
    issuancesForAssn: async(obj, args, { db, dataSources }, info) => {
      let stateTexts = ["", "신청 중", "발급 완료", "신청 거부"]

      let query = `
        select dojo.dojo_name, student.name as user_name, issuance.* from issuance
        Join dojo ON issuance.dojo_uuid = dojo.web_user_uuid
        Join student ON issuance.user_uuid = student.mobile_user_uuid
        where issuance.assn_uuid = :assn_uuid and issuance.state in (:issue_state)
      `

      let values = {
        assn_uuid: args.web_user_uuid,
        issue_state: args.state
      }

      return db.sequelize.query(
        query, {
          replacements: values,
          type: db.sequelize.QueryTypes.SELECT
        }
      )
      .then(result => {
        console.log(result);

        result.map( data => {
          if(data.state == 1 || data.state == 3) {
            data.list_date = data.request_date
          } else if(data.state == 2) {
            data.list_date = data.issue_date
          }
          
          data.stateText = stateTexts[data.state];

        })

        return result;

      })
    }

  },

  Mutation: {
    signIn : async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction((t) => {

        return bcrypt.genSalt(saltRounds)
        .then( salt => {
          return bcrypt.hash(args.password, salt)
        })
        .then( hash => {
          return db.web_user.create({
            email: args.email, 
            password: hash, 
            account_type: 0,
            uuid: md5(uuid())
          }, {transaction: t})
          .then( (userResult) => {
            return db.dojo.create({
              web_user_uuid: userResult.dataValues.uuid,
              ...args          
            }, {transaction: t})  
            .then(result => {
              if( !args.images || args.images.length === 0) 
                return {
                  message: "No Images"
                };

              return promisesAll.all(
                args.images.map(storeUpload("Dojo"))
              )
            })
            .then( ({ resolve, reject, message }) => {
              if(message) {
                return null;
              }

              if(reject.length > 0) {
                throw reject;
              }

              let images = {
                image1 : resolve[0] && resolve[0].path,
                image2 : resolve[1] && resolve[1].path,
                image3 : resolve[2] && resolve[2].path,
                image4 : resolve[3] && resolve[3].path,
                image5 : resolve[4] && resolve[4].path,
              }
                           
              return db.dojo.update(
                images,
                {
                  where: { web_user_uuid: userResult.dataValues.uuid },
                  transaction: t
                },
              )
            })
            .then( result => {
  
              return {
                email: args.email,
                uuid: userResult.dataValues.uuid,
                account_type: userResult.account_type
              }
            })
            .catch( err => {
              throw err
            })
          })
          .catch( err => {
            throw err
          })
  
        })
        .catch( err => {
          throw err
        })
      }) 
      .then( result => {
        console.log(result);

        const token = jwt.sign(
          result,
          'serverSecret',
          {
            expiresIn: '1d', // token will expire in 30days
          },
        )

        console.log({
          token,
          ...result
        });

        console.log("USER CREATED")

        return {
          status: 200,
          message: 'OK',
          token,
          ...result
        };

      })  
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 404,
          message: 'Auth Error',
        }
      })
    },

    signUp:  async(obj, args, { db, storeUpload }, info) => {
      console.log("SIGNUP")

      return db.web_user.findOne({ where: { email: args.email}})
      .then( userResult => {
        console.log(userResult);
        return bcrypt.compare(
          args.password, 
          userResult.dataValues.password
        )
        .then(result => {
          console.log(result)

          if(!result) {
            return {
              status: 404,
              message: 'Auth Error',
            }
          }

          return db.web_user.update(
            {
              last_login_date: db.Sequelize.literal('CURRENT_TIMESTAMP')
            },
            {where: {uuid : userResult.dataValues.uuid} }
          )
          .then(() => {
            let data = {
              email: args.email,
              uuid: userResult.dataValues.uuid,
              account_type: userResult.account_type
            }
    
            const token = jwt.sign(
              data,
              'serverSecret',
              {
                expiresIn: '1d', // token will expire in 30days
              },
            )
  
            console.log({
              status: 200,
              message: 'OK',
              token,
              ...data
            })
    
            console.log("USER LOGGED IN");

            return {
              status: 200,
              message: 'OK',
              token,
              ...data
            }
          })
          .catch(err => {
            throw err;
          })
        })
        .catch(err => {
          throw err;
        })
      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")
      }) 
      
    },


    signInMobile:  async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction((t) => {

        console.log(args);

        return db.mobile_user.create({
          openid: args.openId,
          unionid: args.unionId,
          account_type: args.account_type,
          uuid: md5(uuid())
        },
        {transaction: t}
        )
        .then( userResult => {

          let account_type = userResult.dataValues.account_type;

          switch(account_type) {
            case 1: 
              return db.student.create({
                mobile_user_uuid: userResult.dataValues.uuid,
                ...args
              }, 
              {transaction: t}
              )
              .then( result => {
                console.log(result);
                return {
                  status: 200,
                  message: JSON.stringify({
                    openid: args.openId,
                    name: args.name,
                    type: args.account_type,
                    uuid: userResult.dataValues.uuid,
                  })
                }
              })
            case 2: 
              return db.instructor.create({
                mobile_user_uuid: userResult.dataValues.uuid,
                ...args
              }, 
              {transaction: t}
              )
              .then( result => {
                console.log(result);
                return {
                  status: 200,
                  message: JSON.stringify({
                    openid: args.openId,
                    name: args.name,
                    type: args.account_type,
                    uuid: userResult.dataValues.uuid,
                  })
                }
              })
            default:
              throw {
                status: 400,
                message: "account_type_error"
              }
            
          }

        })
        .catch(err => {
          throw err;
        })

      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 400,
          message: 'Account Creation Error',
        }
      })
    },



    uploadFiles : async(obj, { files }, { db, storeUpload }, info) => {

      const { resolve, reject } = await promisesAll.all(
        files.map(storeUpload("Test"))
      )

      if (reject.length)
        reject.forEach(({ name, message }) =>
          console.error(`${name}: ${message}`)
        )

      console.log("Uploaded");
      console.log(resolve);

      return resolve;
    },

    updateDojoInfo: async(obj, args, { db, storeUpload }, info) => {

      return db.sequelize.transaction( (t) => {
        return db.dojo.update(
          {
            dojo_name: args.dojo_name,
            manager: args.manager,
            address: args.address,
            phone: args.phone,
            description: args.description,
            updatedAt: db.Sequelize.literal('CURRENT_TIMESTAMP')
          },
          {
            where: {
              web_user_uuid: args.web_user_uuid,
           },
           transaction: t
         })
         .then(result => {

          console.log(result);
            if(args.images && args.images.length > 0) {
              return promisesAll.all(
                args.images.map(storeUpload("Dojo"))
              )
              .then( ({ resolve, reject, message }) => {
                if(message) {
                  return null;
                }
  
                if(reject.length > 0) {
                  throw reject;
                }
  
                let images = {
                  image1 : resolve[0] && resolve[0].path,
                  image2 : resolve[1] && resolve[1].path,
                  image3 : resolve[2] && resolve[2].path,
                  image4 : resolve[3] && resolve[3].path,
                  image5 : resolve[4] && resolve[4].path,
                }
                             
                return db.dojo.update(
                  images,
                  {
                    where: { web_user_uuid: args.web_user_uuid },
                    transaction: t
                  },
                )
                .catch( err => {
                  throw err;
                })
              })
              .catch( err => {
                throw err;
              })

            }

            console.log(result);
            return;
         })
         .catch( err => {
          throw err;
        })
         


      })
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK_UPDATED'
        }  
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 404,
          message: 'Dojo Info Update Error',
        }
      })
    },

    updateAssnInfo: async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction( (t) => {
        return db.assosiation.update(
          {
            assn_name: args.assn_name,
            manager: args.manager,
            address: args.address,
            phone: args.phone,
            description: args.description,
            updatedAt: db.Sequelize.literal('CURRENT_TIMESTAMP')
          },
          {
            where: {
              web_user_uuid: args.web_user_uuid,
           },
           transaction: t
         })
         .then(result => {

          console.log(result);
            if(args.images && args.images.length > 0) {
              return promisesAll.all(
                args.images.map(storeUpload("Assosiation"))
              )
              .then( ({ resolve, reject, message }) => {
                if(message) {
                  return null;
                }
  
                if(reject.length > 0) {
                  throw reject;
                }
  
                let images = {
                  image1 : resolve[0] && resolve[0].path,
                  image2 : resolve[1] && resolve[1].path,
                  image3 : resolve[2] && resolve[2].path,
                  image4 : resolve[3] && resolve[3].path,
                  image5 : resolve[4] && resolve[4].path,
                }
                             
                return db.assosiation.update(
                  images,
                  {
                    where: { web_user_uuid: args.web_user_uuid },
                    transaction: t
                  },
                )
                .catch( err => {
                  throw err;
                })
              })
              .catch( err => {
                throw err;
              })

            }

            console.log(result);
            return;
         })
         .catch( err => {
          throw err;
        })
         


      })
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK_UPDATED'
        }  
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 404,
          message: 'Assisiation Info Update Error',
        }
      })
    },

    updateWebUserPassword : async(obj, args, {db}, info) => {
      return db.web_user.findOne({ where: { uuid: args.uuid}})
      .then( userResult => {
        return bcrypt.compare(
          args.prev_password, 
          userResult.dataValues.password
        )
        .then( result => {
          if(!result) {
            throw {
              status: 400,
              message: 'Auth Error',
            }
          }

          return bcrypt.genSalt(saltRounds)
          .then( salt => {
            return bcrypt.hash(args.password, salt)
          })
          .then( hash => {
            return db.web_user.update({
              password: hash
            },
            {
              where: {
                uuid: args.uuid
              }
            })
          })
          .catch( err => {
            throw err
          })

        })
        .catch( err => {
          throw err
        })
      })
      .then( result => {
        return {
          status: 200,
          message: 'OK_UPADTED'
        }  
      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return err;
      }) 

    },


    updateRegistratedState : async(obj, args, {db}, info) => {
      if(args.state == 2) {
        return db.training.update({
          state: args.state,
          registered_date: db.Sequelize.fn('NOW')
        }, {
          where: {
            user_uuid: args.user_uuid,
            dojo_uuid: args.dojo_uuid,
          }
        })
        .catch(err => {
          console.error("=====================")
          console.error(err);
          console.error("=====================")
  
          return err;
        }) 
      }


      return db.training.update({
        state: args.state
      }, {
        where: {
          user_uuid: args.user_uuid,
          dojo_uuid: args.dojo_uuid,
        }
      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return err;
      }) 
    },


    updateRegistratedInstructorState : async(obj, args, {db}, info) => {
      if(args.state == 2) {
        return db.career.update({
          state: args.state,
          start_date: db.Sequelize.fn('NOW')
        }, {
          where: {
            user_uuid: args.user_uuid,
            dojo_uuid: args.dojo_uuid,
          }
        })
        .then(result => {
          console.log(result);
          return result;
        })  
        .catch(err => {
          console.error("=====================")
          console.error(err);
          console.error("=====================")
  
          return err;
        }) 
      }


      return db.career.update({
        state: args.state
      }, {
        where: {
          user_uuid: args.user_uuid,
          dojo_uuid: args.dojo_uuid,
        }
      })
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return err;
      }) 
    },

    deleteRegistrate: async(obj, args, { db }, info) => {
      return db.training.destroy({
        where: {
          user_uuid: args.user_uuid,
          dojo_uuid: args.dojo_uuid,
        }
      })
    },

    deleteRegistrateInstructor: async(obj, args, { db }, info) => {
      return db.career.destroy({
        where: {
          user_uuid: args.user_uuid,
          dojo_uuid: args.dojo_uuid,
        }
      })
    },


    joinAssosiation: async(obj, args, { db }, info) => {
      console.log(args);

      return db.assn_dojo.findOrCreate({
        where: {
          ...args,
        },
        defaults : {
          status: 1  
        }
      }, )
      .then( ([result, created]) => {
        console.log(result);
        console.log(created);


        if(created) {
          return {
            status: 200,
            message: 'OK_CREATED'
          }  
        }

        return db.assn_dojo.update(
          {
            status: 1
          },
          {
            where: {
              assn_uuid: args.assn_uuid,
              dojo_uuid: args.dojo_uuid
            }
          }
        )
        .then(result => {
          console.log(result);
  
          return {
            status: 200,
            message: 'OK_UPDATED'
          }
        })

      })
      .catch(err => {

        console.log(err);

        throw err;
      })

    },

    registrateDojo: async(obj, args, { db }, info) => {
      return db.training.create({
        user_uuid: args.user_uuid,
        dojo_uuid: args.dojo_uuid,
        state: 1
      })
      .catch(err => {

        console.log(err);

        throw err;
      })

    },

    requestCareer: async(obj, args, { db }, info) => {
      return db.career.create({
        user_uuid: args.user_uuid,
        dojo_uuid: args.dojo_uuid,
        state: 1
      })
      .catch(err => {

        console.log(err);

        throw err;
      })

    },


    updateDojoAssnStatus: async(obj, args, { db }, info) => {
      return db.assn_dojo.update(
        {
          status: args.status
        },
        {
          where: {
            assn_uuid: args.assn_uuid,
            dojo_uuid: args.dojo_uuid
          }
        }
      )
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK'
        }
      })
      .catch(err => {

        console.log(err);

        throw err;
      })
    
    },


    updateMobileUserInfo: async(obj, args, { db }, info) => {

      if(args.account_type == 1) {
        return db.student.update({
          name: args.name,
          age: args.age,
          address: args.address,
          phone: args.phone
        }, {
          where: {
            mobile_user_uuid : args.uuid
          }
        })
        .then(result => {
          console.log(result);
  
          return {
            status: 200,
            message: 'OK_UPDATED'
          }
        })
        .catch(err => {
          console.error("=====================")
          console.error(err);
          console.error("=====================")
  
          throw err
        }) 
      } else if(args.account_type == 2) {
        return db.instructor.update({
          name: args.name,
          age: args.age,
          address: args.address,
          phone: args.phone
        }, {
          where: {
            mobile_user_uuid : args.uuid
          }
        })
        .then(result => {
          console.log(result);
  
          return {
            status: 200,
            message: 'OK_UPDATED'
          }
        })
        .catch(err => {
          console.error("=====================")
          console.error(err);
          console.error("=====================")
  
          throw err
        }) 
      } else {
        throw {
          status: 400,
          message: "account_type error"
        }
      }
    },


    createCourse: async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction((t) => {

        return db.course.create({
          dojo_uuid: args.dojo_uuid,
          course_name: args.course_name,
          manager: args.manager,
          description: args.description
        }, {
          transaction: t
        })
        .then(courseResult => {
          console.log(courseResult);

          if(args.images && args.images.length > 0) {
            return promisesAll.all(
              args.images.map(storeUpload("Course"))
            )
            .then( ({ resolve, reject, message }) => {
              if(message) {
                return null;
              }

              if(reject.length > 0) {
                throw reject;
              }

              let images = {
                image1 : resolve[0] && resolve[0].path,
                image2 : resolve[1] && resolve[1].path,
                image3 : resolve[2] && resolve[2].path,
                image4 : resolve[3] && resolve[3].path,
                image5 : resolve[4] && resolve[4].path,
              }
                           
              return db.course.update(
                images,
                {
                  where: { IDX: courseResult.dataValues.IDX },
                  transaction: t
                },
              )
              .catch( err => {
                throw err;
              })
            })
            .catch( err => {
              throw err;
            })

          }

          return {
            statis: 200,
            message: 'OK_CREATED',
          }
        })
        .catch(err => {
    
          console.log(err);
    
          throw err;
        }) 
      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        throw err
      }) 
    },

    updateCourse: async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction((t) => {
        return db.course.update({
          course_name: args.course_name,
          manager: args.manager,
          description: args.description
        }, {
          where: {
            IDX: args.IDX
         },
         transaction: t
        })
        .then(result => {
          if(args.images && args.images.length > 0) {
            return promisesAll.all(
              args.images.map(storeUpload("Course"))
            )
            .then( ({ resolve, reject, message }) => {
              if(message) {
                return null;
              }

              if(reject.length > 0) {
                throw reject;
              }

              let images = {
                image1 : resolve[0] && resolve[0].path,
                image2 : resolve[1] && resolve[1].path,
                image3 : resolve[2] && resolve[2].path,
                image4 : resolve[3] && resolve[3].path,
                image5 : resolve[4] && resolve[4].path,
              }
                           
              return db.course.update(
                images,
                {
                  where: { IDX: args.IDX },
                  transaction: t
                },
              )
              .catch( err => {
                throw err;
              })
            })
            .catch( err => {
              throw err;
            })
          }
        })

      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        throw err
      }) 
    },

    deleteCourse: async(obj, args, { db, storeUpload }, info) => {
      return db.course.destroy({
        where: {
          IDX: args.IDX
        }
      })
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK_UPDATED'
        }
      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        throw err
      }) 
    },


    
    createEnrollment: async(obj, args, { db, storeUpload }, info) => {
      console.log("createEnrollment");

      return db.enrollment.create({
        course_IDX: args.course_idx,
        dojo_uuid: args.dojo_uuid,
        user_uuid: args.user_uuid,
        state: 0,
        registered_date: db.Sequelize.fn('NOW')
      })
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK_CREATED'
        }
      })
      .catch(err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        throw err
      }) 

    },

    updateEnrollmentState: async(obj, args, { db, storeUpload }, info) => {
      console.log("updateEnrollment");
      console.log(args);


      return db.course.findOne({
        where: {
          IDX: args.course_idx
        }
      })
      .then( ({ dataValues }) => {

        console.log(dataValues);

        return db.enrollment.update({
          state: args.state,
          start_date: args.state == 1 ? db.Sequelize.fn('NOW') : undefined,
          end_date: args.state == 2 ? db.Sequelize.fn('NOW') : undefined,
          removed_date: args.state == 5 ? db.Sequelize.fn('NOW') : undefined,
          fixed_name: dataValues.course_name
        },
        {
          where: {
            course_IDX: args.course_idx,
            dojo_uuid: args.dojo_uuid,
            user_uuid: args.user_uuid,
          }
        })
      })
      .then(result => {
        console.log(result);
        
        return {
          status: 200,
          message: 'OK_UPDATED'
        }  
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 404,
          message: 'Cert create Error',
        }
      })
    },

    deleteEnrollment: async(obj, args, { db, storeUpload }, info) => {
      console.log("deleteEnrollment");

      return db.enrollment.destroy({
        where: {
          course_IDX: args.course_idx,
          dojo_uuid: args.dojo_uuid,
          user_uuid: args.user_uuid,
        }
      })
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK_UPDATED'
        }  
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 404,
          message: 'Cert create Error',
        }
      })
    },

    createCertificate: async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction( (t) => {

        return db.certificate.create({
          uuid: args.uuid,
          cert_name: args.cert_name
        }, {
          transaction: t
        })
        .then( ({ dataValues }) => {
          
          console.log(dataValues.IDX);
   
          if(args.images && args.images.length > 0) {
            return promisesAll.all(
              args.images.map(storeUpload("Certificates"))
            )
            .then( ({ resolve, reject, message }) => {

              if(message) {
                return null;
              }

              if(reject.length > 0) {
                throw reject;
              }

              let images = {
                image1 : resolve[0] && resolve[0].path,
                image2 : resolve[1] && resolve[1].path,
                image3 : resolve[2] && resolve[2].path,
                image4 : resolve[3] && resolve[3].path,
                image5 : resolve[4] && resolve[4].path,
              }
                           
              return db.certificate.update(
                images,
                {
                  where: { IDX: dataValues.IDX },
                  transaction: t
                },
              )
              .catch( err => {
                throw err;
              })
            })
            .catch( err => {
              throw err;
            })

          }
        })
        .catch( err => {
          throw err;
        })
      })
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK_UPDATED'
        }  
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 404,
          message: 'Cert create Error',
        }
      })
    },


  
    updateCertificate: async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction( (t) => {

        return db.certificate.update({
          cert_name: args.cert_name
        }, {
          where: {
            cert_idx: args.cert_idx
          },
          transaction: t
        })
        .then( result => {
          
          console.log(result);
   
          if(args.images && args.images.length > 0) {
            return promisesAll.all(
              args.images.map(storeUpload("Certificates"))
            )
            .then( ({ resolve, reject, message }) => {

              if(message) {
                return null;
              }

              if(reject.length > 0) {
                throw reject;
              }

              let images = {
                image1 : resolve[0] && resolve[0].path,
                image2 : resolve[1] && resolve[1].path,
                image3 : resolve[2] && resolve[2].path,
                image4 : resolve[3] && resolve[3].path,
                image5 : resolve[4] && resolve[4].path,
              }
                           
              return db.certificate.update(
                images,
                {
                  where: { IDX: args.IDX },
                  transaction: t
                },
              )
              .catch( err => {
                throw err;
              })
            })
            .catch( err => {
              throw err;
            })

          }
        })
        .catch( err => {
          throw err;
        })
      })
      .then(result => {
        console.log(result);

        return {
          status: 200,
          message: 'OK_UPDATED'
        }  
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")

        return {
          status: 404,
          message: 'Cert update Error',
        }
      })
    },

    deleteCertificate: async(obj, args, { db, storeUpload }, info) => {
    
      return db.certificate.destroy({
        where: {
          IDX: args.cert_idx,
          uuid: args.uuid 
        }
      })
      .then(result => {
        console.log(result);
  
        return {
          status: 200,
          message: 'OK_DELETED'
        }
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")
  
        return {
          status: 404,
          message: 'Cert delete Error',
        }
      })
      
    },


    createIssuance: async(obj, args, { db, storeUpload }, info) => {
      return db.sequelize.transaction( (t) => {

        return promisesAll.all(
          args.user_uuid.map( x => {
            return db.issuance.create({
                assn_uuid: args.assn_uuid,
                dojo_uuid: args.dojo_uuid,
                user_uuid: x,
                issue_name: args.issue_name,
                message: args.message,
                request_date: db.Sequelize.fn('NOW'),
                state: 1
              },
              {transaction: t}
            )
            .then( ({ resolve, reject }) => {
              console.log(resolve);
        
              if(reject) {
                throw reject;
              }

              return {
                status: 200,
                message: 'OK_DELETED'
              }
            })
            .catch( err => {
              throw err
            })
          })
        )
      })
      .catch( err => {
        console.error("=====================")
        console.error(err);
        console.error("=====================")
  
        return err
      })
    },


    updateIssuanceState: async(obj, args, { db, storeUpload }, info) => {

      if(args.state == 1) {
        return db.issuance.update({
          issue_date: db.Sequelize.fn('NOW'),
          state: args.state
        }, {
          where : {
            assn_uuid: args.assn_uuid,
            dojo_uuid: args.dojo_uuid,
            user_uuid: args.user_uuid,
          }
        })
      } else {
        return db.issuance.update({
          state: args.state
        }, {
          where : {
            assn_uuid: args.assn_uuid,
            dojo_uuid: args.dojo_uuid,
            user_uuid: args.user_uuid,
          }
        })
      }

    }


  },
};
