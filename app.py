import sqlalchemy
import datetime as dt
import time
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify, redirect, render_template
from flask_pymongo import PyMongo
import pandas as pd
import os
from bs4 import BeautifulSoup as bs
import requests
import pymongo
from splinter import Browser
import json
import pprint
import requests
import sys
import urllib


allInfo={}
   

def init_browser(): 
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    return Browser('chrome', **executable_path, headless=True)

def updateFacts():
    browser= init_browser()
    url="https://www.povertyusa.org/facts"
    browser.visit(url)
    time.sleep(1)
    html=browser.html
    soup=bs(html, 'html.parser')
    paragraphs=soup.find_all('p')
    facts_dict={} 
    for x in range(2,12):
        if (len(paragraphs[x].text)>2):
            fact=paragraphs[x]
            facts_dict[f'Fact_{x}']=fact
    browser.quit()
    allInfo['Facts']=facts_dict

    return allInfo


app=Flask(__name__)
mongo = PyMongo(app, uri="mongodb://localhost:27017/ProjectTwoDB")

@app.route("/")
def index():


    return render_template("index.html", allInfo=allInfo)


@app.route("/facts")
def facts():

    allInfo=mongo.db.facts.find_one()

    return render_template("facts.html", allInfo=allInfo)

@app.route("/mapping")
def map():
    

    return render_template("mapping.html", allInfo=allInfo)

@app.route("/Graphs")
def Graphs():
    

    return render_template("Graphs.html", allInfo=allInfo)

@app.route("/overview")
def overview():
    

    return render_template("overview.html", allInfo=allInfo)




if __name__ == '__main__':    
    app.run(debug=True)