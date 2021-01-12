from flask import Flask, request, make_response, jsonify
import json
import pandas as pd
import re
from bs4 import BeautifulSoup
from helper import contraction_mapping, stop_words

app = Flask(__name__)

def writeToFile(article: str, fileName: str):
    f = open(fileName, "w");
    f.write(article)
    f.close()

def generateSummary(fileName: str) -> str:
    f = open(fileName, "r")
    message = f.readline()
    f.close()
    # print(message[:35])
    return message

def clean_text(text: str) -> str:
    processedString = text.lower()
    #remove html tags
    processedString = BeautifulSoup(processedString, "lxml").text
    #replace text inside parethesis with nothing
    processedString = re.sub(r'\([^)]*\)', '', processedString)
    #remove all double quotes
    processedString = re.sub('"', '', processedString)
    processedString = ' '.join([contraction_mapping[t] if t in contraction_mapping else t for t in processedString.split(" ")])
    # remove 's
    processedString = re.sub(r"'s\b'", '', processedString)
    # remove all non alphabet characters
    processedString = re.sub("[^a-zA-Z]", ' ', processedString)
    tokens = [w for w in processedString.split() if not w in stop_words]
    long_words = []
    for i in tokens:
        if len(i)>=3:
            long_words.append(i)
    return(" ".join(long_words)).strip()

@app.route('/')
def hello_world():
    return 'Hello, World'

@app.route('/datatext', methods=['POST'])
def upload_file():
    fileName = "testarticle.txt"
    if request.method == 'POST':
        # data will be json of the form {1: "p1", 2: "p2"}
        #convert into dictionary
        text = json.loads(request.data)
        print(text['0'])
        article = ""
        for key, value in text.items():
            article += value + " "
        # prepreocess text from article
        # article = clean_text(article)
        writeToFile(article, fileName)

        print("written to file")
        message = generateSummary(fileName)
        res = make_response(jsonify({"message": message}), 200)
        return res
