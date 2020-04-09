const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar DateTime

  type Query {
    webUsers: [WebUser]
    webUser(email: String!): WebUser

    mobileUser(uuid: ID!, type: Int!): MobileUser

    registratedUser(uuid: ID!, state: Int!) : [MobileUser]
    registratedInstructor(uuid: ID!, state: Int!) : [MobileUser]

    enrollmentByState(dojo_uuid: ID!, course_idx: ID!, state: Int): [MobileUserForEnroll]
    enrollmentForMobile(user_uuid: ID!, state: Int): [Enrollment]

    assosiations(web_user_uuid: ID): [Assosiation]
    assosiationsByState(web_user_uuid: ID, state: Int): [Assosiation]
    assosiation(web_user_uuid: ID): Assosiation

    historiesForStudent(user_uuid: ID!): [History]
    historiesForInstructor(user_uuid: ID!): [History]


    issuancesForDojo(web_user_uuid: ID): [Issuance]
    issuancesForAssn(web_user_uuid: ID, state: [Int]): [Issuance]

    dojos: [Dojo]
    dojo(web_user_uuid: ID!): Dojo
    searchDojoName(keyword: String): [Dojo]

    registratedDojo(mobile_user_uuid: ID!): [DojoWithCourse]
    joinedDojo(mobile_user_uuid: ID!): [Dojo]

    dojoRegState(
      dojo_uuid: ID!,
      user_uuid: ID!
    ) : RegistrationState

    dojoJoinState(
      dojo_uuid: ID!,
      user_uuid: ID!
    ) : RegistrationState

    assignedDojos(web_user_uuid: ID!): [DojoStatus]
    requestingDojos(web_user_uuid: ID!): [DojoStatus]

    courses(dojo_uuid: ID): [Course]
    coursesWithState(
      dojo_uuid: ID!,
      user_uuid: ID!
    ): [CourseWithState]

    certificates(uuid: ID!): [Certificates]

    weixinLogin(
      appid: ID!,
      code: String!
    ) : WeixinResponse

    googleLogin(
      email: ID,
      innerID: ID,
    ) : GoogleResponse

  }

  type Mutation {
    signIn(
      email: String!, 
      password: String!,
      dojo_name: String!,
      manager: String!,
      address: String!,
      images: [Upload],
      phone: String,
      description: String
    ) : AuthData

    signUp(
      email: String!,
      password: String!  
    ): AuthData # login token

    signInMobile(
      openId: ID!,
      unionId: ID!,
      name: String!,
      age: Int,
      address: String!,
      phone: String!
      account_type: Int
    ) : Response

    signUpModile(
      openId: ID!,
      unionId: ID!
    ) : Response

    uploadFiles(files: [Upload]!): [File] #for Upload Test

    updateDojoInfo(
      web_user_uuid: ID!
      dojo_name: String
      manager: String
      address: String
      phone: String
      images: [Upload]
      description: String
    ) : Response

    updateAssnInfo(
      web_user_uuid: ID!
      assn_name: String
      manager: String
      address: String
      phone: String
      images: [Upload]
      description: String
      found_date: String
    ) : Response

    updateWebUserPassword(
      uuid: ID!
      prev_password: String!,
      password: String!,
    ) : Response

    updateMobileUserInfo(
      uuid: ID!,
      account_type: Int!,
      name: String,
      age: Int,
      address: String,
      phone: String
    )
    : Response

    updateRegistratedState(
      user_uuid: [ID]!,
      dojo_uuid: ID!,
      state: Int,
    ) : Response

    updateRegistratedInstructorState(
      user_uuid: [ID]!,
      dojo_uuid: ID!,
      state: Int,
    ) : Response

    deleteRegistrate(
      user_uuid: [ID]!,
      dojo_uuid: ID,
    ) : Response

    deleteRegistrateInstructor(
      user_uuid: [ID]!,
      dojo_uuid: ID,
    ) : Response

    joinAssosiation(
      assn_uuid: ID!,
      dojo_uuid: ID!,
    ) 
    : Response

    requestCareer(
      user_uuid: ID!,
      dojo_uuid: ID!
    )
    : Response

    registrateDojo(
      user_uuid: ID!,
      dojo_uuid: ID!
    ) 
    : Response

    createCourse(
      dojo_uuid: ID!,
      course_name: String,
      manager: String!,
      images: [Upload],
      description: String
    )
    : Response

    updateCourse(
      IDX: ID!
      course_name: String,
      manager: String!,
      images: [Upload],
      description: String
    )
    : Response

    deleteCourse(
      IDX: ID!
    )
    : Response


    createEnrollment(
      course_idx: ID!
      dojo_uuid: ID!,
      user_uuid: ID!
    )
    : Response

    updateEnrollmentState(
      course_idx: ID!
      dojo_uuid: ID!,
      user_uuid: [ID]!
      state: Int
    ) 
    : Response

    deleteEnrollment(
      course_idx: ID!,
      dojo_uuid: ID!,
      user_uuid: [ID]!,
    )
    : Response

    updateDojoAssnStatus(
      dojo_uuid: ID!,
      assn_uuid: ID!,
      status: Int
    )
    : Response

    createCertificate(
      uuid: ID!,
      cert_name: String!,
      images: [Upload]
    )
    : Response

    updateCertificate(
      cert_idx: ID!,
      uuid: ID!,
      cert_name: String!,
      images: [Upload]
    )
    : Response

    deleteCertificate(
      cert_idx: ID!,
      uuid: ID!
    )
    : Response

    createIssuance(
      assn_uuid: ID!,
      dojo_uuid: ID!,
      user_uuid: [ID]!,
      issue_name: String,
      message: String,
    )
    : Response

    updateIssuanceState(
      assn_uuid: ID!,
      dojo_uuid: ID!,
      user_uuid: [ID]!,
      state: Int,
    )
    : Response

  }


  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """

  type Course {
    IDX: ID
    course_name: String
    manager: String
    images: [String]
    description: String
  }

  type CourseWithState {
    IDX: ID
    course_name: String
    manager: String
    images: [String]
    description: String
    state: Int
  }

  type Certificates {
    IDX: ID
    cert_name: String
    images: [String]
  }

  type Response {
    status: Int,
    message: String
  }

  type AuthData {
    token: String
    email: String
    uuid: String
    account_type: Int
    status: Int!,
    message: String
  }

  type WebUser {
    IDX: ID!
    email: String
    # password: String
    account_type: Int
    registration_date: DateTime
    last_login_date: DateTime
  }

  type MobileUser {
    IDX: ID!
    mobile_user_uuid: ID
    name: String
    age: Int
    address: String
    phone: String
    registration_date: DateTime
  }

  type MobileUserForEnroll {
    IDX: ID!
    mobile_user_uuid: ID
    name: String
    age: Int
    address: String
    phone: String
    registered_date: DateTime
    start_date: DateTime
    end_date: DateTime
  }



  type EnrolledMobileUser {
    IDX: ID!
    mobile_user_uuid: ID
    name: String
    age: Int
    address: String
    phone: String
    state: Int
    registration_date: DateTime
  }

  type Assosiation {
    IDX: ID!
    web_user_uuid: ID!
    assn_name: String
    manager: String
    address: String
    phone: String
    images: [String]
    description: String
    found_date: String
    status: String   
  }
  
  type AssosiationStatus {
    IDX: ID!
    web_user_uuid: ID!
    assn_name: String
    manager: String
    address: String
    phone: String
    images: [String]
    description: String
    found_date: String   
    status: String
  }

  type Dojo {
    IDX: ID!
    web_user_uuid: ID!
    dojo_name: String
    manager: String
    address: String
    images: [String]
    phone: String
    description: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type DojoWithCourse {
    IDX: ID!
    web_user_uuid: ID!
    dojo_name: String
    manager: String
    address: String
    images: [String]
    phone: String
    description: String
    courses: [Course]

  }


  type DojoStatus {
    IDX: ID!
    web_user_uuid: ID!
    dojo_name: String
    manager: String
    address: String
    images: [String]
    phone: String
    description: String
    createdAt: DateTime
    updatedAt: DateTime
    status: Int
  }

  type Enrollment {
    IDX: ID!
    course_IDX: ID!
    dojo_uuid: ID!
    user_uuid: ID!
    state: Int,
    fixed_name: String
    registered_date: DateTime
    start_date: DateTime
    end_date: DateTime
    removed_date: DateTime
  }

  type RegistrationState {
    user_uuid: ID!
    dojo_uuid: ID!
    state: Int,
  }

  type WeixinResponse {
    openid: ID!
    unionid: ID!
    access_token: String!,
    refresh_token: String!,
    uuid: String,
    type: Int,
    name: String,
    hasAccount: Boolean
  }

  type GoogleResponse {
    uuid: String,
    type: Int,
    name: String,
    hasAccount: Boolean
  }

  type File {
    id: ID
    filename: String
    mimetype: String
  }

  type History {
    dojo_name: String
    course_name: String
    start_date: DateTime
    end_date: DateTime
  }

  type Issuance{
    dojo_uuid: ID,
    dojo_name: String,
    user_uuid: ID,
    user_name: String,
    assn_uuid: ID,
    assn_name: String,

    issue_name: String,
    message: String,
    state: Int,
    stateText: String,

    request_date: DateTime,
    issue_date: DateTime,
    list_date: DateTime,
  }
`;

module.exports = typeDefs;
