import { useUser } from '@/hooks/useUser'

export default async function handler (req, res) {
  let nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransport({
    port: 587,
    host: 'smtp.gmail.com',
    auth: {
      user: 'vviixo.contacto@gmail.com',
      pass: 'vviixo_chev'
    },
    secure: false
  })

  let products_template = ''
  req.body.products.map(product => {
    products_template += `${product.title} quantity: ${product.qty} price: ${product.price} <br>`
  })

  const mailData = {
    from: 'vviixo.contacto@gmail.com',
    to: req.body.email,
    subject: `Message From vviixo store`,
    html: `<div>
    comprasion averiguada<br>
    customer: ${req.body.email}
    products: <br>${products_template}
    total: ${req.body.total}
    </div>`
  }

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log(info)
        resolve(info)
      }
    })
  })

  res.status(200).json({ status: 'Ok' })
}
