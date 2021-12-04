import numpy as np
import json
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import json
from io import StringIO

url = "http://localhost:5000/getallfilm"

response = requests.get(url, verify=False)
movies_df ={}

data_json = json.loads(response.content)
movies_df['cast'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['cast'].values
movies_df['id'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['id'].values
movies_df['keywords'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['keywords'].values
movies_df['original_title'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['id'].values
movies_df['crew'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['crew'].values
movies_df['genre_ids'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['genre_ids'].values

def allTitle():
    url = "http://localhost:5000/getallfilm"
    response = requests.get(url, verify=False)
    data_json = json.loads(response.content)
    result = {}
    result['original_title'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['original_title'].values
    result['id'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['id'].values
    result['title'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['title'].values
    result['poster_path'] = pd.read_json(StringIO(json.dumps(data_json['result'])), orient='values')['poster_path'].values

    return result

def get_recommendations(title, cosine_sim):
    """
    in this function,
        we take the cosine score of given movie
        sort them based on cosine score (movie_id, cosine_score)
        take the next 10 values because the first entry is itself
        get those movie indices
        map those indices to titles
        return title list
    """
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:21]
    # (a, b) where a is id of movie, b is sim_score

    movies_indices = [ind[0] for ind in sim_scores]
    movies = movies_df[1].iloc[movies_indices]
    return movies

movies_df["director"]=[]
def get_director(x):
    for i in x:
        team_dir = []
        for j in i:
            if j["job"] == "Director":
                team_dir.append(str.lower(j["name"].replace(" ", "")))
        movies_df['director'].append(team_dir)

def get_list(x, collumn):
    movies_df[collumn] = []
    for i in x[0]:
        temp = []
        if(i != 0):
            for j in i:
                temp.append( str.lower(j["name"].replace(" ", "")))
        movies_df[collumn].append(temp)

pd.DataFrame(movies_df["crew"]).apply(get_director)

get_list(pd.DataFrame(movies_df["cast"]), collumn='cast')
get_list(pd.DataFrame(movies_df["keywords"]), collumn='keywords')
get_list(pd.DataFrame(movies_df["genre_ids"]), collumn='genre_ids')

movies_df['soup'] = []
def create_soup(x):
    stop = (int)(x.size /len(x))
    for i in range(stop):
        movies_df["soup"].append((' '.join(x[i]['keywords']) + ' ' + ' '.join(x[i]['cast']) + ' ' + ' '.join(x[i]['director']) + ' '+ ' '.join(x[i]['genre_ids'])).replace("'", "").replace("\\", ""))

create_soup(pd.DataFrame.from_dict(movies_df, orient = 'index'))

count_vectorizer = CountVectorizer(stop_words="english")
count_matrix = count_vectorizer.fit_transform(movies_df["soup"])

cosine_sim2 = cosine_similarity(count_matrix, count_matrix)

movies_df = pd.DataFrame.from_dict(movies_df, orient = 'index').reset_index()
movies_df = movies_df.transpose()
indices = pd.Series(movies_df.index, index=movies_df[3])

def recommand(title):
    result = get_recommendations(title, cosine_sim2).to_json(orient="records")
    parsed = json.loads(result)
    json.dumps(parsed, indent=4)
    return parsed


