const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const authConfig = require('../config/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).send({ routerOn: true , status: "Ok"});
})

//86400 - 1 Dia
function generateToken( parms = [] ){
    return jwt.sign(parms, authConfig.secret, {
        expiresIn: 86400
    });
};

//Rotas POST
router.post('/register', async (req, res) => {
    
    const {email} = req.body;

    try {
        if( await User.findOne({ email }) )
            return res.status(400).send({ error: "Email de usuário já se encontra em nossa base de dados." });

        const user = await User.create(req.body);   

        user.password = undefined;

        res.send({
            user, 
            token: generateToken({ id: user.id })
        });

    }catch (err){
        return res.status(400).send({error: 'Falha ao registrar usuário'});
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        res.status(400).send({ error: "Usuário não encontrado", msg: "Parece que este email não se encontra em nossa base de dados." });

    if(!await bcrypt.compare(password, user.password))
        res.status(400).send({ error: "Senha inválida", msg: "Você digitou a senha incorretamente. Tente novamente." });

    user.password = undefined;

    res.send({ 
        user, 
        token: generateToken({ id: user.id })
    });

});

//Rotas GET
router.get('/search', async (req, res) => {
    return res.status(200).send(await User.find());
});

router.get('/search/:id', async (req, res) => {
    try{
        const user = await User.findById( req.params.id );
        if(!user){
            return res.status(400).send('Usuário não encontrado!');
        }
        return res.status(200).send(user);
    }catch (err){
        return res.status(400).send(err);
    }
});

//Rotas PUT
router.put('/update/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate( req.params.id, req.body, {new : true} );
        if(!user){
            return res.status(400).send('Usuário não encontrado!');
        }
        return res.status(200).send({user, msg:'Usuário alterado com sucesso.'});
    }catch (err){
        return res.status(400).send(err);
    }
});

//Rotas DELETE
router.delete('/delete/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete( req.params.id );
        if(!user){
            return res.status(400).send('Usuário não encontrado!');
        }
        return res.status(200).send({user, msg:'Usuário deletado com sucesso.'});
    }catch (err){
        return res.status(400).send(err);
    }
});

module.exports = app => app.use('/auth', router);