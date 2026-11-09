const text = {type:'string'};
const page = {
  type:'object', properties:{kicker:text,title:text,body:text,emoji:text,takeaway:text},
  required:['kicker','title','body','emoji','takeaway'],
};
export const courseSchema = {
  type:'object',
  properties:{title:text,subtitle:text,lessons:{type:'array',minItems:3,maxItems:3,items:{
    type:'object',properties:{title:text,subtitle:text,minutes:{type:'integer',enum:[3]},
      pages:{type:'array',minItems:3,maxItems:3,items:page},
      quiz:{type:'object',properties:{question:text,choices:{type:'array',minItems:4,maxItems:4,items:text},answer:{type:'integer',minimum:0,maximum:3},why:text},required:['question','choices','answer','why']},
    },required:['title','subtitle','minutes','pages','quiz'],
  }}},required:['title','subtitle','lessons'],
};
