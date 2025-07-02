const { sendMail } = require('../utilities/sendMai');

exports.sendNotification = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const from = 'OC Flight Plan <no-reply@oc.edu>';
    const cc = null;
    
    await sendMail(from, to, cc, subject, body);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};