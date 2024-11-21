import nodemailer from 'nodemailer'
import twilio from 'twilio'

const emailTransporter = nodemailer.createTransport({
  // Configure your email service here
})

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function POST(req: Request) {
  const { type, to, subject, body } = await req.json()

  try {
    if (type === 'email') {
      await emailTransporter.sendMail({
        from: 'your-email@example.com',
        to,
        subject,
        text: body,
      })
    } else if (type === 'sms') {
      await twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      })
    } else {
      throw new Error('Invalid message type')
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error sending message:', error)
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

