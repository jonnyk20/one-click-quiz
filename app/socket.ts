import socketIO from 'socket.io';
import { getImageQuiz, getSentenceQuiz } from './quizBuilder';
import { Server } from 'http';
import { detectLanguage } from './services/DetectLanguageService';

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

    socket.on('submit-sentence-quiz', async data => {
      const language = await detectLanguage(data);

      getSentenceQuiz(data, socket, language);
    });
  });
};

module.exports = socket;
