import User from '../models/User';

import * as Yup from 'yup';

class UserController {
  async store(req,res){
    const schema = Yup.object().shape({
      name:Yup.string().required(),
      email:Yup.string().email().required(),
      password:Yup.string().required().min(6),
    });
    if(!( await schema.isValid(req.body))){
        return res.status(400).json({"erro":"Validation error"});
    }
    const UserExists = await User.findOne({where:{email:req.body.email}});

    if(UserExists){
      return res.status(400).json({"error":'This user already on this database'});
    }else{
      const {id,name,email,provider} = await User.create(req.body);
        return res.json({
          id,
          name,
          email,
          provider
        });
    }

  }

  async update(req,res){
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      old_password: Yup.string().min(6),
      password: Yup.string().min(6).when('old_password',(old_password,field)=>{
        old_password ? field.required() : field;
      }),
      confirm_password:Yup.string().when('password',(password,field)=>{
         password ? field.required().oneOf([Yup.ref('password')]) :field
      })
    });

    if(!( await schema.isValid(req.body))){
      return res.status(400).json({"erro":"Validation error"});
    }
    const {email,old_password} = req.body;
    const user = await User.findByPk(req.userId);

    if(email != user.email){
      const UserExists = await User.findOne({ where: {email}});
        if(UserExists){
          return res.status(400).json({"error":'User already exists'});
        }
    }

    if(old_password && !(await user.checkPassword(old_password))){
      return res.status(401).json({error:'Password does not match'})
    }

    const {id,name,provider} = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

export default new UserController();
