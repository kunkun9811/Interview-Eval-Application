import os
import pandas as pd
import numpy as np
import re
import nltk
import math
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer 
from helper import stop_words
from bs4 import BeautifulSoup
nltk.download("punkt")

def generate_summary(sentences, sentenceScores, threshold):
    sentence_count = 0
    summary = ''
    
    for sentence in sentences:
        if sentence[:15] in sentenceScores and sentenceScores[sentence[:15]] >= (threshold):
            summary += " " + sentence
            sentence_count += 1
            
    return summary

def find_average_score(sentenceScores) -> int:
    sumScores = sum([sentenceScores[entry] for entry in sentenceScores])
    average = (sumScores / len(sentenceScores))
    
    return average

def score_sentences(tf_idf_matrix) -> dict:
    sentenceValue = {}
    
    for sentence, score_table in tf_idf_matrix.items():
        total_score = 0
        
        diff_words_in_sentence = len(score_table)
        # total_num_wrods_in_sentence = sum([freq_table[t] for t in freq_table])
        
        
        for word, score in score_table.items():
            total_score += score
            
        sentenceValue[sentence] = total_score / diff_words_in_sentence
        
    return sentenceValue

def create_tf_idf_matrix(tf_matrix, idf_matrix):
    tf_idf_matrix = {}
    
    for (sentence1, freq_table1), (sentence2, freq_table2) in zip(tf_matrix.items(), idf_matrix.items()):
        
        tf_idf_table = {}
        
        for (word1, value1), (word2, value2) in zip(freq_table1.items(), freq_table2.items()):
            tf_idf_table[word1] = float(value1 * value2)
            
        tf_idf_matrix[sentence1] = tf_idf_table
        
    return tf_idf_matrix

def create_idf_matrix(freq_matrix, doc_per_word, total_documents):
    idf_matrix = {}
    
    for sentence, freq_table in freq_matrix.items():
        idf_table = {}
        
        for word in freq_table.keys():
            idf_table[word] = math.log10(total_documents/ float(doc_per_word[word]))
            
        idf_matrix[sentence] = idf_table
        
    return idf_matrix

def create_documents_per_words(freq_matrix):
    doc_per_word_table = {}
    
    for _, word_freq in freq_matrix.items():
        for word, freq in word_freq.items():
            if word in doc_per_word_table:
                doc_per_word_table[word] += 1
            else:
                doc_per_word_table[word] = 1
    
    return doc_per_word_table

def create_tf_matrix(freq_matrix):
    tf_matrix = {}
    
    for sentence, freq_table in freq_matrix.items():
        tf_table = {}
        
        diff_words_in_sentence = sum([freq_table[t] for t in freq_table])
        
        for word, count in freq_table.items():
            tf_table[word] = count / diff_words_in_sentence
            
        tf_matrix[sentence] = tf_table
        
    return tf_matrix

def create_frequency_matrix(sentences):
    frequency_matrix = {}
    stopWords = stop_words
    ps = PorterStemmer()

    for sent in sentences:
        freq_table = {}
        words = word_tokenize(sent)
        for word in words:
            word = word.lower()
            word = ps.stem(word)
            if word in stopWords:
                continue

            if word in freq_table:
                freq_table[word] += 1
            else:
                freq_table[word] = 1

        frequency_matrix[sent[:15]] = freq_table

    return frequency_matrix