from flask import Flask, request, make_response, jsonify
import json
import pandas as pd
import re
from nltk.tokenize import sent_tokenize
from bs4 import BeautifulSoup # used in clean text function (Deprecated)
# from helper import contraction_mapping, stop_words
from helper_functions import *

app = Flask(__name__)

def writeToFile(article: str, fileName: str):
    f = open(fileName, "w");
    f.write(article)
    f.close()

def generateSummary(fileName: str) -> str:
    with open("testarticle.txt", "r", encoding="utf-8") as file:
        text = file.read()

    text = sent_tokenize(text)
    print("Text:")
    print(text[:20], "\n")
    total_documents = len(text)

    # Calculate Frequency Matrix
    freq_matrix = create_frequency_matrix(text)
    # print("Frequency Matrix:")
    # print(list(freq_matrix)[:5], "\n")

    # Create Term Frequency Matrix
    tf_matrix = create_tf_matrix(freq_matrix)
    # print("Term Frequency Matrix:")
    # print(list(tf_matrix)[:5], "\n")

    # Create Document counts per word Matrix
    doc_per_word = create_documents_per_words(freq_matrix)
    # print("Number of documents each word appear in:")
    # print(list(doc_per_word)[:5], "\n")

    # Create Inverse Document Frequency Matrix
    idf_matrix = create_idf_matrix(freq_matrix, doc_per_word, total_documents)
    # print("IDF Matrix:")
    # print(list(idf_matrix)[:5], "\n")

    # Create TF-IDF matrix
    tf_idf_matrix = create_tf_idf_matrix(tf_matrix, idf_matrix)
    # print("TF-IDF Matrix:")
    # print(list(tf_idf_matrix)[:5], "\n")

    # Score each sentence
    sentenceScores = score_sentences(tf_idf_matrix)
    # print("Scores of each sentence:")
    # print(list(sentenceScores)[:5], "\n")

    # Calculate the threshold to select important sentences for summary
    threshold = find_average_score(sentenceScores)
    # print("threshold:")
    # print(threshold, "\n")

    # Generate the summary
    summary = generate_summary(text, sentenceScores, threshold)
    # print(message[:35])
    return summary

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
