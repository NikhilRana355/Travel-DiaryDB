//to,from,subject,text
const mailer = require('nodemailer');

///function

const sendingMail = async(to,subject,text) => {

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth:{
            user:"traveldiary194@gmail.com",
            pass:"chew hmnv jfvx dlfr"
        }
    })

    const mailOptions = {
        from: 'traveldiary194@gmail.com',
        to: to,
        subject: subject,
        text: text
        //html:"<h1>"+text+"</h1>"
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;

}

module.exports ={
    sendingMail
}
//sendingMail("samir.vithlani83955@gmail.com","Test Mail","this is test mail")
