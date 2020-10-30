var { buildSchema } = require('graphql');

const schema = buildSchema(`
type Person {
        name : String ,
        email : String
    },
type Main{
content:String,
application:String
},
type Details{
 url : String,
 title:String,
 location:String,
 description:String
},
type Data{
details : Details,
main:Main
},
type Jobs {
    pages : Int,
    data : Data
},
type Query{
    hello : String,
    person : Person,
    jobs : [Jobs]
}
`)

module.exports = { schema };