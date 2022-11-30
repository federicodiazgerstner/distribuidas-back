let nodemailer = require('nodemailer');


exports.sendEmail = async function (req,password, res, next){

    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: false,
        service: 'gmail',
        auth: {
            user: process.env.ACCOUNT,//poner cuenta gmail
            pass: process.env.PASS
        }
     });
    // Definimos el email
    var mailOptions = {
        from: process.env.ACCOUNT,
        to: req.body.email,
        subject: 'Nueva Contraseña para Morfando Inc',
        html: '<h1> Se ha generado su nueva contraseña para ingresar a Morfando Inc:  </h1><h3>' +password+'</h3>',
        
    };
    console.log("mail",mailOptions)
    // Enviamos el email
    try{
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    }
    catch(error){
        console.log("Error envio mail: ",error);   
    }
};