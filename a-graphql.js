const { ApolloServer, gql, UserInputError } = require("apollo-server")
const { v1: uuid } = require("uuid")


// 原始资源/数据
let persons = [
  {
    name: "Arto hellas",
    phone: "040-123456",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "05150515"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]


// 一个GQL的 schema，声明/描述请求的输入
const typeDefs = gql`
  enum YesNo {
    Yes
    NO
  }
  
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }
`
// resolvers 解析器声明如何响应请求
const resolvers = {
  // 对于 persons 的查询工具
  Query: {
    personCount: () => persons.length,
    // allPersons: () => persons,
    allPersons: (root, args) => {
      if (!args.phone) {
        return persons
      }
      const byPhone = (person) => 
        args.phone === "YES" ? person.phone : !person.phone
      return persons.filter(byPhone)
    },
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },
  // 对于 person 的查询
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  // 对于变化/新增/修改
  Mutation: {
    addPerson: (root, args) => {
      // 如果要添加的名字已经存在于电话簿中，抛出UserInputError错误
      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        })
      }

      const person = { ...args, id: uuid()}
      persons = persons.concat(person)
      return person
    },
    editNumber: (root, args) => {
      const person = persons.find(p => p.name === args.name)
      if (!person) {
        return null
      }

      const updatedPerson = { ...person, phone: args.phone }
      persons = persons.map(p => p.name === args.name ? updatedPerson : p)
      return updatedPerson
    }
  }
}

const server = new ApolloServer({
  // 2个参数，分别对应输入、输出的定义
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})