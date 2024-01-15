const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Personal = require('../../models/Personal')
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql');

const ClientType = new GraphQLObjectType({
    name:'Client',
    fields:() => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        phoneNo:{type:GraphQLString},

    })
})

const ProjectType = new GraphQLObjectType({
    name:'Project',
    fields:() => ({
        id:{type:GraphQLID},
        clientId:{type:GraphQLString},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        status:{type:GraphQLString},
        client:{
            type:ClientType,
            resolve(parent,args){
                return Client.findById(parent.clientId)
            }
        }
    })
})

const PersonalType = new GraphQLObjectType({
    name:'Personal',
    fields:() => ({
        gender:{type:GraphQLString}
    })
})


const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
       clients:{
        type:new GraphQLList(ClientType),
        resolve(parent,args){
            return Client.find()
        }
       }, 
       client:{
        type:ClientType,
        args:{id:{type:GraphQLID}},
        resolve(parent,args){
            return Client.findById(args.id)
        }
       },
       projects:{
        type:new GraphQLList(ProjectType),
        resolve(parent,args){
            return Project.find()
        }
       },
       project:{
        type:ProjectType,
        args:{id:{type:GraphQLID}},
        resolve(parent,args){
            return Project.findById(args.id)
        }
       },
       personal:{
        type:new GraphQLList(PersonalType),
        //args:{gender:{type:GraphQLString}},
        resolve(parent,args){
            return Personal.find()
        }
       }
    }
})

const mutation = new GraphQLObjectType({
    name:'mutation',
    fields:{
        addClient:{
            type:ClientType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                phoneNo:{type:GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                const client = new Client({
                    name:args.name,
                    phoneNo:args.phoneNo,
                    email:args.email
                })

                return client.save()
            }
        },
        deleteClient:{
            type:ClientType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return Client.findByIdAndDelete(args.id)
            }
        },
        addProject:{
        type:ProjectType,
        args:{
            name:{type:GraphQLString},
            description:{type:GraphQLString},
            status:{
                type:new GraphQLEnumType({
               name:'ProjectStatus',
               values:{
                'new':{value:'Not Started'},
                'progress':{value:'In Progress'},
                'completed':{value:"Completed"},
               }
                
                }),
                defaultValue:'Not Started'
                 },
            clientId:{type:GraphQLNonNull(GraphQLID)}
        },
        resolve(parent,args){
            const project = new Project({
                name:args.name,
                description:args.description,
                status:args.status,
                clientId:args.clientId
            })
            return project.save()
        }
        },
        deleteProject:{
            type:ProjectType,
            args:{
                id:{type:GraphQLID},
            },
            resolve(parent,args){
                return Project.findByIdAndDelete(args.id)
            }
        },
        updateProject:{
            type:ProjectType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                description:{type:GraphQLString},
                status:{
                    type:new GraphQLEnumType({
                   name:'ProjectStatusUpdate',
                   values:{
                    'new':{value:'Not Started'},
                    'progress':{value:'In Progress'},
                    'completed':{value:"Completed"},
                   }
                    
                    }),
                    defaultValue:'Not Started'
                     },
               // clientId:{type:GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                const initialProject = Project.findById(args.id);
                const project = Project.findByIdAndUpdate(args.id,{
                    name:args.name || initialProject.name,
                    description:args.description || initialProject.description ,
                    status:args.status || args.status
                })
                return project
            }
        },

        addPersonal:{
            type:PersonalType,
            args:{
                 gender:{type:GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                 const personal = new Personal({
                    gender:args.gender
                 })

                 return personal.save()
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:mutation
})