import { sendConfirmationEmail } from './nodemailer';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';

const amqp = require('amqplib/callback_api');

// connect to RabbitMQ server
const rabbitMqUrl = process.env.RABBIT_MQ_URL || 'host.docker.internal';

export const listenMessagesFromRabbitMQ = () => {
    amqp.connect(`amqp://${rabbitMqUrl}`, function (error0, connection) {
        if (error0) {
            console.log('Error: RabbitMQ connection error');
            return;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            const queueName = process.env.RABBIT_MQ_QUEUE;

            channel.assertQueue(queueName, {
                durable: false
            });

            console.log("[*] Waiting for emails to send confirmation code");

            channel.consume(queueName, async function (msg) {
                const email = msg.content.toString();
                console.log(" [x] Received email: %s", email);
                const user = await User.findOne({ email });
                if (!user) return;
                const token = jwt.sign({ id: user._id }, config.SECRET, {
                    expiresIn: '48h'
                });
                sendConfirmationEmail(email, token);
            }, {
                noAck: true
            });
        });
    });
};
