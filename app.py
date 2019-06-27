from flask import Flask, render_template, redirect, url_for
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/')
def mainpage():
    return render_template('index.html')


@socketio.on('move')
def handle_move(message):
    emit('test_event', message, broadcast=True, include_self=False)


if __name__ == '__main__':
    socketio.run(app)
