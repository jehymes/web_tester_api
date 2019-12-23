const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const express = require('express');
const router = express.Router();

exports.rootUser = async (req, res) => {
    return res.status(200).send('Rota de Usuário funcionando');
};

exports.registerUser = async (req, res) => {
    
    const {email} = req.body;

    try {
        if( await Users.findOne({ email }) )
            return res.status(400).send({ error: "Email de usuário já se encontra em nossa base de dados." });

        const user = await User.create(req.body);   

        Users.password = undefined;

        res.send({user});
    }catch (err){
        return res.status(400).send({error: 'Falha ao registrar usuário'});
    }
};

//Teste para GET
router.get('/register', async (req, res) => {
    return res.status(200).send(await Users.find());
});

router.get('/register/:id', async (req, res) => {
    try{
        const user = await Users.findById( req.params.id );
        if(!user){
            return res.status(400).send('Usuário não encontrado!');
        }
        return res.status(200).send(user);
    }catch (err){
        return res.status(400).send(err);
    }
});

//Teste para PUT
router.put('/register/:id', async (req, res) => {
    try{
        const user = await Users.findByIdAndUpdate( req.params.id, req.body, {new : true} );
        if(!user){
            return res.status(400).send('Usuário não encontrado!');
        }
        return res.status(200).send({user, msg:'Usuário alterado com sucesso.'});
    }catch (err){
        return res.status(400).send(err);
    }
});

//Teste para DELETE
router.delete('/register/:id', async (req, res) => {
    try{
        const user = await Users.findByIdAndDelete( req.params.id );
        if(!user){
            return res.status(400).send('Usuário não encontrado!');
        }
        return res.status(200).send({user, msg:'Usuário deletado com sucesso.'});
    }catch (err){
        return res.status(400).send(err);
    }
});