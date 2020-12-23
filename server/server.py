from flask import Flask, request
import json
import pandas as pd
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World'

@app.route('/datatext', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # data will be json of the form {1: "p1", 2: "p2"}
        #convert into dictionary
        data = request.json
        article = "";
        for key, value in data:
            article += value + " "
        print(article)
