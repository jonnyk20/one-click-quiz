import socketIO from 'socket.io';
import { getImageQuiz, getSentenceQuiz } from './quizBuilder';
import { Server } from 'http';

const socket = (server: Server) => {
  const io = socketIO.listen(server);
  io.on('connection', socket => {
    console.log('a user is connected!');
    socket.emit('update', { hello: 'world!' });
    socket.on('boom', msg => {
      console.log('msg from client', msg);
    });

    socket.on('submit-image-quiz', data => {
      getImageQuiz(data, socket);
    });

    socket.on('submit-sentence-quiz', data => {
      getSentenceQuiz(data, socket);
    });
  });
};

module.exports = socket;
