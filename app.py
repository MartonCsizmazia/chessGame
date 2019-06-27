from flask import Flask, render_template, redirect, url_for
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/')
def mainpage():
    return render_template('index.html')


@socketio.on('move')
def handle_my_custom_event(message):
    emit('test_event', {'data': 42}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
