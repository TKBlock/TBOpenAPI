// require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');
const { createWriteStream, unlink } = require('fs')
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const WeixinAPI = require('./datasources/weixin');

const shortid = require('shortid');

const mkdirp = require('mkdirp')


const db = require('./database');
const UPLOAD_DIR = './uploads'


const internalEngineDemo = require('./engine-demo');



mkdirp.sync(UPLOAD_DIR)

// set up any dataSources our resolvers need
const dataSources = () => ({
//   // launchAPI: new LaunchAPI(),
//   // userAPI: new UserAPI({ store }),
  weixinAPI: new WeixinAPI()
});

const storeUpload = folderName => {
  return async (upload) => {
    const { createReadStream, filename, mimetype } = await upload

    console.log(await upload);
  
    const stream = createReadStream()
    const id = shortid.generate()
    const path = `${UPLOAD_DIR}/${folderName}/${id}-${filename}`
    const file = { id, filename, mimetype, path }
  
    mkdirp.sync(`${UPLOAD_DIR}/${folderName}`);

    // Store the file in the filesystem.
    await new Promise((resolve, reject) => {
      stream
        .on('error', error => {
          unlink(path, () => {
            reject(error)
          })
        })
        .pipe(createWriteStream(path))
        .on('error', reject)
        .on('finish', resolve)
    })
  
    // Record the file metadata in the DB.
  
    return file
  };
}


// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  // simple auth check on every request
  const token = (req.headers && req.headers.authorization) || '';
  // const email = new Buffer(auth, 'base64').toString('ascii');

  // // if the email isn't formatted validly, return null for user
  // if (!isEmail.validate(email)) return { user: null };
  // // find a user by their email
  // const users = await store.users.findOrCreate({ where: { email } });
  // const user = users && users[0] ? users[0] : null;

  // return { user: { ...user.dataValues } };

  return { db, storeUpload }
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
    ...internalEngineDemo,
  },
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test')
  server
    .listen({ port: 6640 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));

// export all the important pieces for integration/e2e tests to use
module.exports = {
  // dataSources,
  // context,
  typeDefs,
  resolvers,
  ApolloServer,
  // LaunchAPI,
  // UserAPI,
  // store,
  server,
};
