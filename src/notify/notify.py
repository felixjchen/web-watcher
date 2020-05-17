import os

import smtplib
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

production = 'KUBERNETES_SERVICE_HOST' in os.environ

if production:
	COS_API_KEY_ID = os.environ['SECRET_APIKEY']
	COS_RESOURCE_CRN = os.environ['SECRET_RESOURCE_INSTANCE_ID']
else:
	import secrets
	USER = secrets.credentials['user']
	PASSWORD = secrets.credentials['password']

	
def send_email(to, url_changed, difference_image_path):

	msg = MIMEMultipart()
	msg['Subject'] = 'web-watcher notification'
	msg['From'] = USER
	msg['To'] = to

	# Encapsulate the plain and HTML versions of the message body in an
	# 'alternative' part, so message agents can decide which they want to display.
	msgAlternative = MIMEMultipart('alternative')
	msg.attach(msgAlternative)

	msgText = MIMEText(f'{url_changed} has changed')
	msgAlternative.attach(msgText)

	# We reference the image in the IMG SRC attribute by the ID we give it below
	msgText = MIMEText(f'{url_changed} has changed <br><img src="cid:image1"><br>', 'html')
	msgAlternative.attach(msgText)

	with open(difference_image_path, 'rb') as fp:
		msgImage = MIMEImage(fp.read())

	# Define the image's ID as referenced above
	msgImage.add_header('Content-ID', '<image1>')
	msgImage.add_header('Content-Disposition', "attachment; filename=difference")
	msg.attach(msgImage)

	server = smtplib.SMTP( "smtp.gmail.com", 587 )
	server.starttls()
	server.login(USER, PASSWORD)
	server.send_message(msg)
	server.quit()
	
if __name__ == "__main__":
	send_email('felixchen1998@gmail.com', 'http://www.youtube.com', 'files/img.png')