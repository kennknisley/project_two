import sqlalchemy
import datetime as dt
import time
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify
import pandas as pd
import os
from bs4 import BeautifulSoup as bs
import requests
import pymongo
from splinter import Browser
import json
import plotly.express as px

# poverty_file='Resources/poverty.csv'
# poverty_df=pd.read_csv(poverty_file)
# narrowed_poverty_df=poverty_df[['Year', 'State', 'County ID', 'State / County Name','All Ages in Poverty Count', 'All Ages in Poverty Percent']]
# unemp_file="Resources/unemployment.csv"
# unemp_df=pd.read_csv(unemp_file)
# narrowed_unemp=unemp_df[['County ID','Labor Force','Employed','Unemployed','Unemployment Rate(%)']]
# combined_df=narrowed_poverty_df.merge(narrowed_unemp,how='outer', on='County ID')
# mo=combined_df[combined_df['State']==29]
# mo=mo.reset_index(drop=True)
# mo=mo.rename(columns={'Unemployment Rate(%)':'Unemployment Rate'})
mo_data='Resources/mo_data.csv'
# mo.to_csv(mo_data)
mo=pd.read_csv(mo_data)
mo=mo.drop(mo.columns[[0]], axis = 1)

rds_connection_string = "postgres:postgres@localhost:5433/ProjectTwoDB"
engine = create_engine(f'postgresql://{rds_connection_string}')
mo.to_sql(name = "poverty_data", con = engine, if_exists='append', index = True)

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
    return facts_dict

app=Flask(__name__)


@app.route("/")
def index():
    allInfo=pd.read_sql_query('select * from poverty_data', con = engine)
    return render_template("index.html", allInfo=allInfo)






if __name__ == '__main__':    
    app.run(debug=True)