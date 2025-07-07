import { sendMail } from '../utilities/sendMail.js';

export const sendNotification = async (req, res) => {
  try {
    const from = 'careerservices@oc.edu';

    // for testing on dev - JS 7/7/2025
    // const { to, subject, body } = req.body;
    const { subject, body } = req.body;
    const to =  'david.north@oc.edu';

    const cc = null;
    
    await sendMail(from, to, cc, subject, body);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};