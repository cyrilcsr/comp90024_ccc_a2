## Assumptions:
1. Only tweets related to COVID19 vaccines will be stored.
2. A tweet that explicitly includes keywords such as 'COVID19', 'vaccine', name of vaccines, 'vaccination', 'vaccinated', etc. are seen as related.
3. A tweet that tags related accounts are seen as related.

## Assumed data structure:
``` Javascript
{
    "id": "", // tweet id
    "created_at": "", // date of the tweet
    "coordinates": [], // coordinates
    /* above are attributes that can be extracted 
    directly from the raw data  */
    
    "city": "", // melbourne sydney etc. 
    "vaccine_brands": [], 
    "sentiment_score": "",
    "metropolitan": true | false // does the location belong to metropolitan areas?
}
```

### 4. People from ``metropolitan areas`` care more about the COVID-19 vaccination.
#### Assumptions
1. The more keywords mentioned in a tweet and/or the stronger the feelings expressed, the more concerned the tweet is about the topic of vaccines.
2. keywords are extracted from the tweet text
   - should we weight them?
3. The higher the absolute value of a tweet's sentiment scores, the stronger the sentiment expressed in the tweet

#### Method
1. calculate accumulated ``sentiment score``s for tweets from ``metropolitan`` areas, and those not from ``metropolitan`` areas, then compare the absolue values
   
#### MapReduce
``` JavaScript
// map
function(doc){
    emit(doc.metropolitan, doc.sentiment_score)
}

// reduce
_sum
```

#### Alternative Method
1. Simply count the number of tweets mentioning vaccines from each area, more the tweeets, more concerned

#### MapReduce
``` Javascript
// map
function(doc){
    emit(doc.city, 1)
}

// reduce
_count
```

### 5. People from different city (Melbourne, Brisbane, Sydney, Adelaide, Canberra, Perth, Hobart)

#### Methods:
1. use sentiment score
``` Javascript
// map
function(doc){
    if(doc.metropolitan){
        emit(doc.city, doc.sentiment_score)
    }
}

// reduce
_sum
```

2. use counts
``` Javascript
// map
function(doc){
    if(doc.metropolitan){
        emit(doc.location, 1)
    }
}

// reduce
_count
```

### 6. People from different states has different views on the COVID-19 vaccination.
#### Asumptions:
1. What views a tweet hold about vaccines can be determined by the sentiment scores of the tweet

#### Methods
1. compare sentiment scores of vaccine-related tweets across different states.
   
#### MapReduce
``` JavaScript 
// map
fucntion(doc){
    emit(doc.city, sentiment_score)
}

// reduce
_sum

```

#### Follow-up questions:
1. Is there a correlation between vaccination rate in the state and sentiment scores of vaccine-related tweets from the state?


### 7. People have different views on different COVID-19 vaccination.

#### Questions
1. when multiple vaccine brands are mentioned in one tweet, how do we determine the tweet's attitudes toward each one, given the sentiment score is calculated based on the text as a whole.
2. even if a tweet contains vaccine brand(s), the sentiment score is not necessarily about the mentioned vaccine brands

#### Solution
1. ignore if two or more vaccine brands exist in one tweet, only analyze those mentioning only one brand of vaccine.
2. --

#### Methods
1. compare sentiment scores of vaccine-related tweets when mentioning vaccines of different brands.

#### MapReduce
``` JavaScript
//map
function(doc){
    if(doc.vaccine_brands){
        for (var vaccine in doc.vaccine_brands) {
            emit(vaccine, doc.sentiment_score);
            }
    }

}
// reduce
_sum
```

### 8. Trend changes in the frequency of appearances across brands over time

#### MapReduce
``` JavaScript
//map 
function (doc) {
  if (doc.vaccine_brands) {
    for (var vaccine in doc.vaccine_brands) {
      emit([vaccine, doc.created_at], 1);
    }
  }
}

// reduce
_count
```