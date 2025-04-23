export const sendEmail = async (to, subject, body) => {
    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }
  
      console.log('Email sent successfully:', { to, subject, body });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };