// Importe password-validator:
const pwdValid = require('password-validator');

// création du schema:
const pwdSchema = new pwdValid();
// Propriétés du password:
pwdSchema
.is().min(5)                                    // Minimum 5
.is().max(20)                                   // Maximum 20
.has().uppercase()                              // Must have uppercase
.has().lowercase()                              // Must have lowercase
.has().digits(2)                                // Mini 2 digits
.has().not().spaces()                           // No spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist

module.exports = (req, res, next)=>{
    if(pwdSchema.validate(req.body.password)){
        next();
    }else{
        return res.status(400)
        .json({error: `Mot de passe trop faible. (${(pwdSchema.validate('req.body.password', { list: true }))})`});
    }
}